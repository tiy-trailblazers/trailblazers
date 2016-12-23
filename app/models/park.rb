class Park < ApplicationRecord

  def clean_name
    name.gsub("'", "")
  end


  def boundary
    self \
      .class
      .where(id: id)
      .group(:id)
      .select("ST_Polygonize((multi_line_boundary::geometry)) as calc_boundary")
      .first
      .calc_boundary
  end
end
