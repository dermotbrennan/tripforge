class Event < ActiveRecord::Base
  include Pacecar
  include ActionView::Helpers::DateHelper
  
  belongs_to :trip
  has_many :items

  belongs_to :transport_mode

  validates_associated :trip
  validates :name, :started_at, :ended_at, :presence => true
  validates :transport_mode_id, :presence => true, :if => proc {|e| e.trip.events.present? }
  validate :check_times

  def next_event
    self.trip.events.where(["started_at >= ? AND id != ?", self.started_at, self.id]).by_started_at(:asc).first
  end

  def previous_event
    self.trip.events.where(["started_at <= ? AND id != ?", self.started_at, self.id]).by_started_at(:desc).first
  end

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
    unless self.started_at.respond_to?(:strftime) && self.ended_at.respond_to?(:strftime)
      return "Unknown duration"
    end
    
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

    # find the new previous and next events
    new_previous_event = Event.find(previous_event_id) if previous_event_id && previous_event_id > 0
    new_next_event = Event.find(next_event_id) if next_event_id && next_event_id > 0

    original_time_difference = Math.sqrt((self.ended_at - self.started_at).to_i**2).to_i

    # half way between previous and next
    if new_previous_event && new_next_event && (new_previous_event.started_at > self.started_at || new_next_event.started_at < self.started_at)
      self.started_at = new_previous_event.started_at + (new_next_event.started_at - new_previous_event.started_at)/2
    elsif new_previous_event && self.started_at < new_previous_event.started_at # if this is the last event now
      self.started_at = (new_previous_event.started_at + 1.hour)
    elsif new_next_event && self.started_at > new_next_event.started_at # if this is the first event now
      self.started_at  = (new_next_event.started_at - 1.hour)
    else
    end

    self.ended_at = self.started_at + original_time_difference
    save
  end

  def positionless?
    self.latitude.blank? && self.longitude.blank?
  end

  private
  def check_times
    unless self.started_at.respond_to?(:strftime) && self.ended_at.respond_to?(:strftime) &&
        self.ended_at >= self.started_at
      self.errors.add(:base, "Event can't end before it starts")
    end
  end
end
