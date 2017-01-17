# The Yellow Dirt Road [![yellow-trailhead.png](https://s29.postimg.org/x02xfi91j/yellow_trailhead.png)](https://postimg.org/image/uir688p4z/)

The Yellow Dirt Road is a hiking and camping trip planner that provides users with an interactive map of trails and campgrounds that they can search in a variety of ways, including by name, location, and length. Users can create a new trip to save in their profiles by adding trails and campgrounds to a prospective trip.

Nick Galantowicz (front end) and Allie Rowan (back end) built this application as their capstone project for the engineering bootcamp at Iron Yard, DC.

## Front End

Built with [angular](http://angular.com),               [jQuery](http://jquery.com/),              [openLayers](http://openlayers.org/), [SASS](http://sass-lang.com/), and [grunt](http://gruntjs.com/)

[![TYDR.gif](https://s23.postimg.org/tp3py1kiz/TYDR.gif)](https://postimg.org/image/tccbrv293/)

### Using openLayers:

[OpenLayers](http://openlayers.org/) v3 is free and completely open source.  AngularJS provides an OpenLayers directive for developers combining both technologies.   

```javascript
    //example of map configuration:

    var map = new ol.Map({
        target: element,
        controls: ol.control.defaults(),
        renderer: 'canvas',
        layers: [baseLayer, vector],
        view: new ol.View({
            center: center,
            zoom: 4,
            maxZoom: 18,
            minZoom: 2
        })
    });
    return map;
```

All map feature's (ie: markers, popups, drawn polygons, the map) are constructor objects with chained prototype methods allowing for endless customization.

### Application Development:

1. Fork or download app directory
    - Review the ```package.json``` file

    ```javascript
    "dependencies": {
      "angular": "^1.6.0",
      "angular-openlayers-directive": "^1.18.0",
      "angular-sanitize": "^1.6.0",
      "angular-ui-router": "^0.3.2",
      "grunt": "^1.0.1",
      "grunt-contrib-clean": "^1.0.0",
      "grunt-contrib-concat": "^1.0.1",
      "grunt-contrib-copy": "^1.0.0",
      "grunt-contrib-jshint": "^1.1.0",
      "grunt-contrib-sass": "^1.0.0",
      "grunt-contrib-watch": "^1.0.0",
      "jquery": "^3.1.1",
      "openlayers": "^3.20.0"
    },
    ```

2. In terminal within root directory run ```npm init``` and then ```npm i```. This downloads dependencies on your local machine.
    - Note: You must have [npm](https://www.npmjs.com/) locally installed to obtain dependency files.
    - If successful, a ```node_modules``` directory will appear in the project directory.
3. Review ```gruntfile.js``` and make sure file path's for build tasks are correct in your project directory.  
    - ```grunt watch``` will launch automated build process during development on save of app files
4. Review Installation and Usage under the Back End section below to make sure you are able to run the back end of the application as well.

### Testing on the Front End:

The test directory in ```app\assets\tests``` holds unit tests in a bdd format for the current repo's code.  Testing is corroborated with [mocha](https://mochajs.org/),  [chai](http://chaijs.com/), and [grunt](http://gruntjs.com/).  Link to documentation if necessary.  
```javascript
"devDependencies": {
  "angular-mocks": "^1.6.0",
  "chai": "^3.5.0",
  "grunt-karma": "^2.0.0",
  "karma": "^1.3.0",
  "karma-chai": "^0.1.0",
  "karma-chrome-launcher": "^2.0.0",
  "karma-coverage": "^1.1.1",
  "karma-firefox-launcher": "^1.0.0",
  "karma-mocha": "^1.3.0",
  "karma-phantomjs-launcher": "^1.0.2",
  "karma-safari-launcher": "^1.0.0",
  "mocha": "^3.2.0",
  "phantomjs-prebuilt": "^2.1.14"
}
```
  While watching, grunt has been configured to automatically run test suites during development.  Add more test assertions directly to test files or create more test files during development and remember to ALWAYS ALWAYS TEST!   

## Back End

The back end of the Yellow Dirt Road was built in Ruby on Rails, and communicates to the front end through endpoints that consume and return JSON. The data is stored in a [PostGIS](http://postgis.net/) database which allowed me to work with spacial objects such as trail paths and park boundaries. The [activerecord-postgis-adaptor](https://github.com/rgeo/activerecord-postgis-adapter) gem provides ActiveRecord with access to the features of the PostGIS geospatial database. It extends the standard Postgres adaptor to handle the geospatial features.

### Installation and Usage

The [Yellow Dirt Road](https://yellow-dirt-road.herokuapp.com/) is currently deployed to Heroku, and we are working on getting the full trail data set loaded for the entire country. Currently, there is extensive trail data available in Olympic National Park and Shendandoah Valley, and there is campground data available across the country.

In order to run the application locally, you will need to have Postgres and PostGIS installed on your computer. The PostGIS installation is relatively straightforward. You can install it by running through the following commands, or for more in depth instructions please visit the github page for [activerecord-postgis-adaptor](https://github.com/rgeo/activerecord-postgis-adapter).

```
$ brew install postgis

$ bundle

$ rake db:gis:setup

$ rails db:migrate
```

You may then run ```$ rails s  ``` in order to start the application.

However, at this point you will have no data locally to work with within the application. You can load a copy of my database (with the WA and VA data) from dropbox [here](https://www.dropbox.com/s/h7x52zzs49y48cy/trailblazers_development.dump?dl=0), or I have provided a series of rake tasks that you can use. The data set is very large and many of these tasks will take a long time if you attempt to run them locally.

### National Park Data

I used the [National Park Service](https://www.nps.gov/subjects/digital/nps-data-api.htm) API in order to load national parks into my database. If you, too, would like to load the national parks into your database, first you wil need an API key, which should be stored as an environment variable with the name "NPS_KEY". Then run :

```
$ rails parks:create
```

This will get the park data from the NPS API, format it, and load it into your database. The park boundaries come from a different source, and therefore do not get loaded during this task. The NpsLoad class handles the NPS API connection.

In order to load the geospatial data related to the parks, run the following tasks - the add_boundaries task will take some time. It is pinging the [Open Street Maps Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API), converting the returned data into multi-line-strings and then loading that data into the database. There are around 500 national parks to do this for. There will be some output in your terminal when you run it so that you have an idea of what is happening. The Open Street Maps API does not require a key.

The second two tasks are cleaning the multi-line-strings and converting them into actual closed polygons, allowing commands such as "contains" to be run against them.

```
$ rails parks:add_lonlat

$ rails parks:add_boundaries

$ rails parks:add_boundaries_with_multiple

$ rails parks:add_multipoly
```

### Campground Data

I found the campground data at [USCAcampgrounds.info](http://uscampgrounds.info/). You will need to visit the [downloads page](http://uscampgrounds.info/takeit.html) and download the gpx files for each of the regions, and place them in the root of the project directory. The files contain a total of around 13,000 campgrounds. You can load them by running the following commands:

```
$ rails campgrounds:create

$ rails campgrounds:add_lonlat
```
The LoadCampgroundData class handles the codifying process of reading in the info string for each campground and converting the information into usable data. If there is no mention of an amenity, it does NOT necessarily mean it is not there, it might mean they don't have about it data yet.

### Trail Data

The trail data is the trickiest to get loaded in. I am working on ways to speed up the load process, as currently it would take days to load the entire United States. I recommend loading a small region to begin with, and I will continue to expand the data set hosted on Heroku.

If you open the trails.rake file, you will see a create task that defines a bounding box like so:

```ruby
  bounding_box = { south: 47.183150925877044, west: -124.80914762375481, north: 48.3301196276428, east: -122.55153714060215 }
```

It then further divides the bounding box into a grid, and systematically iterates through each box in the grid to load data.

```ruby
height = bounding_box[:north] - bounding_box[:south]

width = bounding_box[:east] - bounding_box[:west]

box_height = height / 5
box_width = width / 5

(0..5).to_a.each do |x|
  (0..5).to_a.each do |y|
    p "(#{x}, #{y})"
    OverpassArea.new(bounding_box[:south] + y * box_height, bounding_box[:west] + x * box_width, bounding_box[:south] + (y + 1) * box_height, bounding_box[:west] + (x + 1) * box_width).create_trails
  end
end
```

You may change the bounding box and grid as you see fit. I built the process this way to save memory while the process is running. The current bounding box is a chunk of western Washington that includes Olympic National Park.

I am using the [Open Street Maps Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) again for this process. The API has its own query language that you can read about on the Wiki. The query that is sent during this particular process looks for all 'ways' within the specified bounding box that have key 'highway' equal to either 'footway' or 'path', or any 'way' whose name contains the word 'trail' that is does NOT have 'highway=residential'. I have found this query to return relatively comprehensive data, but if you have changes to suggest, please submit a pull request.

Once you have set the bounding box and grid sizes to your liking, run the following commands to load the data.

```
$ rails trails:create
```

You should then run the merge_trails command in order to clean up the trail data. A lot of the trails come back from OSM in multiple different pieces, and this command finds segments of the same trail and merges them together so that your data set will be cleaner:

```
$ rails trails:merge_trails
```

In order to associate trails with parks, run the following command which will check which park a trail lies within and will associate the two.

```
$ rails trails:add_parks
```

You can also do this with campgrounds by running:

```
$ rails campgrounds:add_parks
```

### Testing

The project uses the standard rails ActiveSupport::TestCase for testing. I have also begun to implement some full integration testing using [Capybara](https://github.com/teamcapybara/capybara) and I intend to flesh that out.

### Contributing

We would be more that happy to receive pull requests for bug fixes or new features! Please:

1. Fork this repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request!

### Acknowledgements

A big thank you to our fellow classmates at the Iron Yard, and our incredible instructors who answered countless questions and guided us through the course and the project.
