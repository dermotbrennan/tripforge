module ApplicationHelper
  def nl2br(str)
    if str && str.is_a?(String) && str.present?
      str.gsub("\n", "<br />\n")
    end
  end
end
