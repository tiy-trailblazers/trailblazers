require 'test_helper'

class OverpassAreaTest < ActiveSupport::TestCase

  def setup
    stub_request(
      :get,
      "http://overpass-api.de/api/interpreter?data=(way%5Bhighway=footway%5D(38.71532,%20-78.3789,%2038.715607,%20-78.256251)%3B%20way%5Bhighway=path%5D(38.71532,%20-78.3789,%2038.715607,%20-78.256251)%3B%20way%5Bname~'trail',%20i%5D(38.71532,%20-78.3789,%2038.715607,%20-78.256251)%3B)%3B(._%3B%3E%3B)%3Bout%3B"
    ).to_return(
      :status => 200,
      :body => File.read("test/helpers/response.txt"),
      :headers => { 'Content-Type' => 'application/json' }
    )
    stub_request(
      :get,
      "http://overpass-api.de/api/interpreter?data=(way%5Bhighway=footway%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B%20way%5Bhighway=path%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B%20way%5Bname~'trail',%20i%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B)%3B(._%3B%3E%3B)%3Bout%3B"
    ).to_return(
      :status => 200,
      :body => File.read("test/helpers/response.txt"),
      :headers => { 'Content-Type' => 'application/json' }
    )
  end

  test "can get list of trails from api" do
    area = OverpassArea.new(38.71532, -78.3789, 38.715607, -78.256251)
    trail_list = area.list_of_trails
    assert_equal "node", trail_list[0][:type]
  end

  test "can get only nodes" do
    area = OverpassArea.new(38.71632, -78.3789, 38.716607, -78.256251)
    nodes = area.all_nodes
    assert_equal "node", nodes.last[:type]
    assert_equal 1887, nodes.size
  end

end
