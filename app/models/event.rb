class Event < ActiveRecord::Base
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
end
