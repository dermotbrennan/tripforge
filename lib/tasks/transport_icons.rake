$: << File.join(File.dirname(__FILE__), '..', '..')
require 'rake'
require 'config/environment'

Bundler.require(:default, :rake)

namespace :transport_icons do
  task :create do
    include Magick

    basic_icons = Dir.glob(Rails.public_path + File.join('/images', 'transport_modes', '*_basic_icon.png'))

    num_rotations = 36
    FULL_CIRCLE = 360
    QUARTER_CIRCLE = 90

    basic_icons.each do |icon_file|
      icon_base = icon_file.split('/').last.sub('_basic_icon.png', '')
      basic_icon = Image.read(icon_file).first
      basic_icon.background_color = 'transparent'
      combined_image = Image.new(num_rotations*basic_icon.columns, basic_icon.rows) {
        self.background_color = 'transparent'
      }
      num_rotations.times do |rotation_i|
        angle = -(rotation_i*(FULL_CIRCLE/num_rotations))
        puts angle
        rotated_image = basic_icon.rotate(angle).crop(CenterGravity, basic_icon.columns, basic_icon.rows)
        rotated_pixel_data = rotated_image.export_pixels(0, 0, basic_icon.columns, basic_icon.rows, "RGBA")
        x_offset = basic_icon.columns*rotation_i
        combined_image.import_pixels(x_offset, 0, basic_icon.columns, basic_icon.rows, "RGBA", rotated_pixel_data)
      end
      image_filename = Rails.public_path + File.join('/images', 'transport_modes', icon_base + '.png')
      combined_image.write(image_filename)
      puts "Wrote #{image_filename}"
    end
  end
end
