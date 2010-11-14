class Event < ActiveRecord::Base
  include ActionView::Helpers::DateHelper

  default_scope order("started_at asc")
  
  belongs_to :trip
  has_many :items

  belongs_to :next_event, :class_name => "Event"
  belongs_to :transport_mode
  belongs_to :previous_event, :class_name => "Event"

  validates_associated :trip
  validates :name, :presence => true

  def has_gphoto?(gphoto_xml)
    gphoto_id = gphoto_xml.elements['gphoto:id'].text
    self.items.exists?(:source => 'picasaweb', :source_id => gphoto_id)
  end

  # examples
  # 12:00 - 14:00 12th Oct 2010
  # 12:00 12th October - 14.30 15th October 2010
  # 12:00 12th-15th October 2010
  # 12:35, 12th June 2010 - 15:45, 15th June 2011
  def duration_description(include_distance = true)
    description = ''
    start_day = (self.started_at.to_i / 86400).floor
    start_time = self.started_at.strftime("%H:%M")

    if self.ended_at && self.ended_at > self.started_at
      end_day = (self.ended_at.to_i / 86400).floor
      is_same_day = start_day == end_day
      is_same_month = self.started_at.month != self.ended_at.month
      is_same_year = self.started_at.year != self.ended_at.year

      end_time = self.ended_at.strftime("%H:%M")
      start_day_description = "#{date_format(self.started_at, !is_same_month, !is_same_year)}"
      end_day_description = "#{date_format(self.ended_at, true, true)}"

      if is_same_day
        description = "#{start_time} - #{end_time}, #{end_day_description}"
      else
        description = "#{start_time}, #{start_day_description} - #{end_time}, #{end_day_description}"
      end
    else
      description = "#{start_time}, #{date_format(self.started_at)}" # 12:00 - 14:00 Sun 12th Oct 2010
    end

    if include_distance
      description << " (#{distance_of_time_in_words(self.started_at, self.ended_at)})"
    end

    description
  end

  def date_format(date, show_month = true, show_year = true)
    f = "#{date.strftime("%a")} #{date.strftime("%d").to_i.ordinalize} "
    f << "#{date.strftime("%b")} " if show_month
    f << "#{date.strftime("%Y")}" if show_year
    return f
  end

  def reorder(previous_event_id, next_event_id)
    previous_event_id, next_event_id = previous_event_id.to_i, next_event_id.to_i

    # join the original previous and original nexts together
    original_previous_event = self.previous_event
    original_next_event = self.next_event
    if original_previous_event
      original_previous_event.next_event = original_next_event
      original_previous_event.save
    end
    if original_next_event
      original_next_event.previous_event = original_previous_event
      original_next_event.save
    end
    
    # find the new previous and next events
    new_previous_event = Event.find(previous_event_id) if previous_event_id && previous_event_id > 0
    new_next_event = Event.find(next_event_id) if next_event_id && next_event_id > 0

    if (new_previous_event && new_previous_event != self.previous_event) ||
        (new_next_event && new_next_event != self.next_event)

      if new_previous_event
        self.previous_event = new_previous_event
        new_previous_event.next_event = self
        new_previous_event.save
      else
        self.previous_event = nil
      end

      if new_next_event
        self.next_event = new_next_event
        new_next_event.previous_event = self
        new_next_event.save
      else
        self.next_event = nil
      end

      # change the times if necessary
      if self.previous_event && self.previous_event > self.started_at || self.next_event && self.next_event.started_at < self.started_at
        original_time_difference = Math.sqrt((self.ended_at - self.started_at).to_i**2).to_i

        # half way between previous and next
        if self.previous_event && self.next_event
          self.started_at  = self.previous_event.started_at + (self.next_event.started_at - self.previous_event.started_at)/2
        elsif self.previous_event && self.started_at < self.previous_event.started_at # if this is the last event now
          self.started_at  = (self.previous_event.started_at + 1.hour)
        elsif self.next_event && self.started_at > self.next_event.started_at # if this is the first event now
          self.started_at  = (self.next_event.started_at - 1.hour)
        else
        end

        self.ended_at = self.started_at + original_time_difference
      end
      
      save
    end
  end
end
