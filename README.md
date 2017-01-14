# The Yellow Dirt Road [![yellow-trailhead.png](https://s23.postimg.org/bfyx7x52z/yellow_trailhead.png)](https://postimg.org/image/fp3na38c7/)

The Yellow Dirt Road is a hiking and camping trip planner that provides users with an interactive map of trails and campgrounds that they can search in a variety of ways, including by name, location, and length. Users can create a new trip to save in their profiles by adding trails and campgrounds to a prospective  trip.

### Front End

Created with [angular](http://angular.com),               [jQuery](http://jquery.com/),              [openLayers](http://openlayers.org/), [SASS](http://sass-lang.com/), and [grunt](http://gruntjs.com/)

[![TYDR.gif](https://s23.postimg.org/tp3py1kiz/TYDR.gif)](https://postimg.org/image/tccbrv293/)

### Using openLayers

[OpenLayers](http://openlayers.org/) v3 is free and completely open source.  

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

##### How to Develop

1. Fork or download app directory
2. In terminal within root directory run ```npm install``` (this downloads dependencies on your local machine)
3. ```grunt watch``` will launch automated build process during development on save of app files

##### Testing

The test directory in ```app\assets\tests``` holds unit tests in a bdd format for the current repo's code.  Testing is corroborated with [mocha](https://mochajs.org/) and [chai](http://chaijs.com/).  Link to documentation if necessary.  Add tests directly to test files if necessary.

### Back End

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
