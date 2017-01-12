require 'test_helper'

class TrailTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  setup do
    factory = RGeo::Geographic.spherical_factory(srid: 3785)
    @path = factory.multi_line_string(
      deep_convert_to_line_string(
        deep_convert_to_geo_point(trail_with_gap_coordinates)))
    @path_one = line_string_from_coords(touching_trails.first)
    @path_two = line_string_from_coords(touching_trails[1])
    @path_three = line_string_from_coords(touching_trails[2])
    @path_four = line_string_from_coords(another_trail)
    @trail_one = Trail.create(path: @path_one, name: "The Trail")
    @trail_two = Trail.create(path: @path_two, name: "The Trail")
    @trail_three = Trail.create(path: @path_three, name: "The Trail")
    @trail_four = Trail.create(path: @path_four, name: "The Trail")
  end


  test "can convert a multi_line_string to a line_string" do
    assert_equal RGeo::Geographic::SphericalLineStringImpl, (Trail.join_multi_line_string(@path)).class
  end

  test "can get distance between two paths" do
    assert_equal 5.863585441972248, Trail.distance_between_two_paths(@path.first, @path[2])
  end

  test "can convert nested tuples into lists of points" do
    assert_equal 37.4022791, deep_convert_to_geo_point(trail_with_gap_coordinates).first.first.y
  end

  test "can cluster trails that lay on the same path" do
    array_of_trails = [@trail_one, @trail_two, @trail_three, @trail_four]
    cluster = Trail.cluster_trails(array_of_trails)
    assert_equal 2, cluster.size
  end

  test "can join cluster of trail segments into trail and delete extra segments" do
    array_of_trails = [@trail_one, @trail_two, @trail_three, @trail_four]
    cluster = Trail.cluster_trails(array_of_trails)
    assert_equal 2, cluster.first.size
    to_be_deleted = cluster.first[1]
    new_trail = Trail.merge_connected_trails!(cluster.first)
    assert_equal 0.09546599281732107, new_trail.length
    refute Trail.find_by(id: to_be_deleted.id)
  end

  test "can get all duplicate trail names in an array" do
    assert_equal 1, Trail.duplicate_trail_names.size
    assert_equal "The Trail", Trail.duplicate_trail_names.first
  end

  test "can test whether two lines connect end to end" do
    assert @trail_one.connects_to?(@trail_two)
  end

  test "can get trail length" do
    assert_equal 0.019372271032907406, @trail_one.trail_length
  end

  test "can set the length of a trail" do
    @trail_one.update_length!
    assert_equal 0.0193722710329074, Trail.find(@trail_one.id).length
  end

  test "can update the trailhead of a trail if the path was changed" do
    assert_nil @trail_one.startlonlat
    @trail_one.update_trail_head!
    assert_equal(-79.2330195, @trail_one.startlonlat.x)
  end

  test "can find the park for a trail if the trail lays within the park's boundary" do
    assert_equal "The Grassy Park", trails(:north_fork).find_park.name
  end

  def deep_convert_to_geo_point(array)
    array.map do |obj|
      if obj.first.first.class == Float
        obj.map do |tuple|
          RGeo::Geographic.spherical_factory(srid: 4326).point(*tuple)
        end
      else
        deep_convert_to_geo_point(obj)
      end
    end
  end

  def deep_convert_to_line_string(array)
    array.map do |obj|
      if obj.first.class == RGeo::Geographic::SphericalPointImpl
        RGeo::Geographic.spherical_factory(srid: 3785).line_string(obj)
      else
        deep_convert_to_line_string(obj)
      end
    end
  end

  def line_string_from_coords(array)
    points = array.map do |point|
      RGeo::Geographic.spherical_factory(srid: 4326).point(*point)
    end
    RGeo::Geographic.spherical_factory(srid: 3785).line_string(points)
  end


  def trail_with_gap_coordinates
    [[[-79.2342769, 37.4022791],
    [-79.2342769, 37.4022615],
    [-79.2342587, 37.4022478],
    [-79.2342536, 37.4022341],
    [-79.2342769, 37.4022414],
    [-79.2342941, 37.4022478],
    [-79.2343578, 37.4022036],
    [-79.234373, 37.4021875],
    [-79.2343598, 37.4021602],
    [-79.234372, 37.4020059],
    [-79.2344023, 37.401932]],
    [[-79.2344033, 37.4019071],
    [-79.2344145, 37.4018838],
    [-79.2344286, 37.4018637],
    [-79.2344155, 37.4017319],
    [-79.2344397, 37.401711],
    [-79.2344701, 37.4017102],
    [-79.2344913, 37.4017359],
    [-79.2345318, 37.4017874],
    [-79.2345955, 37.4018275],
    [-79.2346825, 37.4020413],
    [-79.2348221, 37.4022502],
    [-79.2349344, 37.4023539],
    [-79.2349506, 37.4024069],
    [-79.2349263, 37.4024648],
    [-79.2349961, 37.4025218],
    [-79.2350264, 37.4025202],
    [-79.2350224, 37.4025644],
    [-79.2349202, 37.4026504],
    [-79.2349111, 37.4026986],
    [-79.2348848, 37.4027122],
    [-79.2348737, 37.4027974],
    [-79.2348767, 37.4028255],
    [-79.2348747, 37.4028408],
    [-79.2348858, 37.4028697],
    [-79.2348595, 37.4028794],
    [-79.2347274, 37.4030577],
    [-79.2346986, 37.403055]],
   [[-79.2330195, 37.4047307],
    [-79.2330195, 37.4047034],
    [-79.2330398, 37.4046809],
    [-79.2330499, 37.4046327],
    [-79.2330246, 37.4046134],
    [-79.2329467, 37.4045692],
    [-79.2328941, 37.4045098],
    [-79.2328769, 37.40448],
    [-79.232883, 37.4044583],
    [-79.2329204, 37.4044326],
    [-79.2329669, 37.4044503],
    [-79.2330135, 37.4044712],
    [-79.2330964, 37.4044479],
    [-79.2334049, 37.4042398],
    [-79.2334808, 37.4041643],
    [-79.233497, 37.4040574],
    [-79.2334859, 37.4039513],
    [-79.2335031, 37.4039336],
    [-79.2335718, 37.403916],
    [-79.2336427, 37.4038396],
    [-79.2336507, 37.4038163],
    [-79.233677, 37.4038075],
    [-79.2337934, 37.4036717],
    [-79.2337934, 37.4036315],
    [-79.2337873, 37.403597],
    [-79.2338146, 37.4035552],
    [-79.2338166, 37.4035295],
    [-79.2338804, 37.4034957],
    [-79.2339542, 37.403384],
    [-79.233938, 37.403339],
    [-79.2340007, 37.4032691],
    [-79.2340139, 37.4032145],
    [-79.234027, 37.4031735],
    [-79.2340746, 37.4031229],
    [-79.2341161, 37.4030827],
    [-79.234113, 37.4030272],
    [-79.2341343, 37.4029388],
    [-79.2341687, 37.4028247],
    [-79.2341697, 37.4027749],
    [-79.234201, 37.4027291],
    [-79.2342081, 37.4026247],
    [-79.2341939, 37.4025612],
    [-79.2341676, 37.4025387],
    [-79.2341939, 37.4025306],
    [-79.2341848, 37.4025146],
    [-79.2341939, 37.4024342],
    [-79.2342081, 37.4024045],
    [-79.234195, 37.4023627],
    [-79.2341909, 37.4023121],
    [-79.2341757, 37.4022872],
    [-79.2341929, 37.4022759],
    [-79.2342111, 37.4022856]]]
  end

  def touching_trails
    [[[-79.2330195, 37.4047307],
     [-79.2330195, 37.4047034],
     [-79.2330398, 37.4046809],
     [-79.2330499, 37.4046327],
     [-79.2330246, 37.4046134],
     [-79.2329467, 37.4045692],
     [-79.2328941, 37.4045098]],
     [[-79.2328941, 37.4045098],
     [-79.2328769, 37.40448],
     [-79.232883, 37.4044583],
     [-79.2329204, 37.4044326],
     [-79.2329669, 37.4044503],
     [-79.2330135, 37.4044712],
     [-79.2330964, 37.4044479],
     [-79.2334049, 37.4042398],
     [-79.2334808, 37.4041643],
     [-79.233497, 37.4040574],
     [-79.2334859, 37.4039513],
     [-79.2335031, 37.4039336],
     [-79.2335718, 37.403916],
     [-79.2336427, 37.4038396],
     [-79.2336507, 37.4038163],
     [-79.233677, 37.4038075]],
     [[-79.233677, 37.4038075],
     [-79.2337934, 37.4036717],
     [-79.2337934, 37.4036315],
     [-79.2337873, 37.403597],
     [-79.2338146, 37.4035552],
     [-79.2338166, 37.4035295],
     [-79.2338804, 37.4034957],
     [-79.2339542, 37.403384],
     [-79.233938, 37.403339],
     [-79.2340007, 37.4032691],
     [-79.2340139, 37.4032145],
     [-79.234027, 37.4031735],
     [-79.2340746, 37.4031229],
     [-79.2341161, 37.4030827],
     [-79.234113, 37.4030272],
     [-79.2341343, 37.4029388],
     [-79.2341687, 37.4028247],
     [-79.2341697, 37.4027749],
     [-79.234201, 37.4027291],
     [-79.2342081, 37.4026247],
     [-79.2341939, 37.4025612],
     [-79.2341676, 37.4025387],
     [-79.2341939, 37.4025306],
     [-79.2341848, 37.4025146],
     [-79.2341939, 37.4024342],
     [-79.2342081, 37.4024045],
     [-79.234195, 37.4023627],
     [-79.2341909, 37.4023121],
     [-79.2341757, 37.4022872],
     [-79.2341929, 37.4022759],
     [-79.2342111, 37.4022856]]]
  end

  def another_trail
    [[-111.3428442, 26.0103475],
   [-111.3421588, 26.0106424],
   [-111.3415774, 26.0108174],
   [-111.3409745, 26.0110436]]
  end
end
