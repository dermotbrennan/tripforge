class Photo < Item
  has_many :photo_urls, :dependent => :destroy

  accepts_nested_attributes_for :photo_urls

  MAX_LARGE_PHOTO_WIDTH = 600
  DEFAULT_THUMBNAIL_WIDTH = 75

  def image_url(width)
    self.source_url.gsub(/([^\/]+)$/, "s#{width}/\\1") if self.source_url.present?
  end

  def original_url
    photo_urls.order('width desc').first.url if !photo_urls.empty?
  end

  def large_url
    photo_urls.where("width < ?", MAX_LARGE_PHOTO_WIDTH).order('width desc').first.url if !photo_urls.empty?
  end

  def thumbnail_url
    if !photo_urls.empty?
      photo_urls.order('width asc').first.url
    elsif provider.code == 'picasa_web'
      image_url(DEFAULT_THUMBNAIL_WIDTH)
    end
  end

  class << self
    def from_gphoto_feed(xml, event, gphoto_ids)
      return false unless gphoto_ids && !gphoto_ids.empty?

      imported_gphoto_ids = []

      xml.each('entry') do |photo|
        gphoto_id = photo.elements['gphoto:id'].text
        if gphoto_ids.include?(gphoto_id)


          photo_urls_attributes = []
          if photo.elements['media:group/media:content']
            photo_urls_attributes << {:url => photo.elements['media:group/media:content'].attribute('url').value,
              :width => photo.elements['media:group/media:content'].attribute('width').value,
              :height => photo.elements['media:group/media:content'].attribute('height').value
            }
          end

          photo.elements.each('media:group/media:thumbnail') do |thumbnail|
            photo_urls_attributes <<
              {:url => thumbnail.attribute('url').value,
                :width => thumbnail.attribute('width').value.to_i,
                :height => thumbnail.attribute('height').value.to_i}
          end

          Rails.logger.debug photo_urls_attributes.inspect

          if Photo.create(:event => event,
              :source => 'picasaweb',
              :source_id => gphoto_id,
              :title => photo.elements['media:group/media:title'].text,
              :source_created_at => Time.at(photo.elements['gphoto:timestamp'].text.to_i),
              :photo_urls_attributes => photo_urls_attributes
            )
            imported_gphoto_ids = gphoto_id
          end
        end
      end

      return imported_gphoto_ids
    end
  end
end