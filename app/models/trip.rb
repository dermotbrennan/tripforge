class Trip < ActiveRecord::Base
  belongs_to :user
  has_many :events

  validates :name, :presence => true

  def reorder_events(event_ids)
    event_ids.each_with_index do |event_id, i|
      event = self.events.find(event_id)
      event.update_position(event_ids[i-1].to_i, event_ids[i+1].to_i)
    end
  end
end
