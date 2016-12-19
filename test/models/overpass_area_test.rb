require 'test_helper'

class OverpassAreaTest < ActiveSupport::TestCase

  test "can get list of trails from api" do
    area = OverpassArea.new(38.71532, -78.3789, 38.715607, -78.256251)
    trail_list = area.list_of_trails
    assert_equal "node", trail_list[0][:type]
  end

  test "can get list of trails in the right format" do
    
  end

end
