# The Yellow Dirt Road [![yellow-trailhead.png](https://s29.postimg.org/x02xfi91j/yellow_trailhead.png)](https://postimg.org/image/uir688p4z/)

The Yellow Dirt Road is a hiking and camping trip planner that provides users with an interactive map of trails and campgrounds that they can search in a variety of ways, including by name, location, and length. Users can create a new trip to save in their profiles by adding trails and campgrounds to a prospective trip.

## Front End

Built with [angular](http://angular.com),               [jQuery](http://jquery.com/),              [openLayers](http://openlayers.org/), [SASS](http://sass-lang.com/), and [grunt](http://gruntjs.com/)

[![TYDR.gif](https://s23.postimg.org/tp3py1kiz/TYDR.gif)](https://postimg.org/image/tccbrv293/)

#### Using openLayers

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

#### Application Development

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

#### Testing: Front End

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

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
