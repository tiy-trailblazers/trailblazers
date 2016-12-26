class Park < ApplicationRecord

  def clean_name
    name.gsub("'", "")
  end


  def union_boundary
    self \
      .class
      .where(id: id)
      .group(:id)
      .select("ST_Union((multi_line_boundary::geometry)) as calc_boundary")
  end

  def poly_boundary
    self.class.select("ST_Polygonize(calc_boundary)::geography as boundary").from(union_boundary)[0].boundary
  end
end
