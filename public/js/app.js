(function() {
    'use strict';

    angular.module('trailblazer', [  'openlayers-directive', 'ngSanitize', 'ui.router'])
        .config(viewConfig);

    viewConfig.$inject = [ '$stateProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');

       $stateProvider
       .state({
           name: 'home',
           url: '/',
           templateUrl: 'templates/home.template.html',
           controller: 'MapController',
           controllerAs: 'MapData'
       })
       .state({
           name: 'trails-and-campgrounds',
           url: '/trails-and-campgrounds',
           templateUrl: 'templates/trails-and-campgrounds.template.html'
       });

    }



}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('MapController', MapController);

    function MapController() {
        var vm = this;

        vm.mapData= function getMapData(data){
            return data;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
    .directive('map', MapDirective);

    MapDirective.$inject = [ '$state', 'TrailandCampgroundService' ];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function MapDirective($state, TrailandCampgroundService) {
        return {
            restrict: 'EA',
            scope: {
                dataTitle: '=',
                passRadiusCoords: '@'
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap() {
            var interactionCount = 0;
            var element = 'map';
            var vector;

            /**
             * Configs base Map layer with tiles sourced from MapBox
             * @return {Object} Vector layer used for map tileing
             */
            function buildBaseLayer() {
                var baseLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg'
                    })
                });
                return baseLayer;
            }

            /**
             * Builds rectangle layer for user select-radius functionality
             * @return {Object} rectangle vector layer compatible with map
             */
            function buildRectangle() {
                var source = new ol.source.Vector({wrapX: false});

                vector = new ol.layer.Vector({
                    source: source
                });
                return vector;
            }

            /**
             * Constructs openLayers Map
             * @param  {Object} baseLayer MapBox tiles
             * @param  {Object} vector    Rectangle radius vector object
             * @return {Object}           OpenLayers Map and configuration
             */
            function buildMap(baseLayer, vector) {
                var map = new ol.Map({
                    target: element,
                    controls: ol.control.defaults(),
                    renderer: 'canvas',
                    layers: [baseLayer, vector],
                    view: new ol.View({
                        center: [ -10853463.910959221, 4789639.227729736 ],
                        zoom: 4,
                        maxZoom: 18,
                        minZoom: 2
                    })
                });
                return map;
            }

            function centerMap(lat, long) {
                console.log("Long: " + long + " Lat: " + lat);
                map.getView().animate({zoom: 13}, {center: [lat, long]}, {duration: 2000});
            }

            var map = buildMap(buildBaseLayer(), buildRectangle());

            var draw = new ol.interaction.Draw({
                source: new ol.source.Vector({wrapX: false}),
                type: 'Circle',
                geometryFunction: ol.interaction.Draw.createBox(),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ffdd55',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 290, 0, 0.4)'
                    }),
                    image: new ol.style.Icon({
                        scale: 0.15,
                        src: 'images/204712-200.png'
                    })
                })
            });

            map.getView().on('change:resolution', function setRaduisBox() {
                if (map.getView().getZoom() > 7.5 && interactionCount <= 0) {
                        interactionCount ++;
                        map.addInteraction(draw);
                    }
            });

            draw.on('drawend',function(e){
                var coordArray = e.feature.getGeometry().v;
                var transCoordOne = ol.proj.transform([ coordArray[0], coordArray[1]], 'EPSG:3857', 'EPSG:4326');
                var transCoordTwo = ol.proj.transform([ coordArray[2], coordArray[3]], 'EPSG:3857', 'EPSG:4326');
                var coordinates = transCoordOne.concat(transCoordTwo);
                TrailandCampgroundService.findTrails(coordinates);
                $state.go('trails-and-campgrounds');
                map.removeLayer(vector);
                map.removeInteraction(draw);
                centerMap(coordArray[0]-((coordArray[0]-coordArray[2])/2), coordArray[1]-((coordArray[1]-coordArray[3])/2));
            });

        }
    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TrailandCampgroundService', TrailandCampgroundService);



    TrailandCampgroundService.$inject = [ '$http' ];

    /**
     * Constructs angular service for trail and campground http requests
     * @param {Service} $http core angular service for http requests
     */
    function TrailandCampgroundService($http){

        return {
            findTrails: findTrails
        };

        /**
         * executes http request to app backend for trail and campground data
         * @param  {Array} coordinates location data based off radius rectangle
         * @return {Promise} angular promise functions            [description]
         */
        function findTrails(coordinates){
            console.log('in service', coordinates);
            var west = coordinates[0];
            var south = coordinates[1];
            var east = coordinates[2];
            var north = coordinates[3];

            return $http({
                url: '/trails',
                params: {
                    north: north,
                    south: south,
                    west: west,
                    east: east
                }
            })
            .then( function transformResponse(response) {
                console.log(response);
                var trails = response.data.trails;
                var campgrounds = response.data.campgrounds;
                return { trails: trails, campgrounds: campgrounds};
            });
        }

    }

}());

// (function() {
//     'use strict';
//
//     angular.module('trailblazer')
//         .controller('TrailController', TrailController);
//
//     TrailController.$inject = [ 'TrailandCampgroundService' ];
//
//     function TrailController(TrailandCampgroundService) {
//         var vm = TrailandCampgroundService;
//         vm.trails = {};
//     }
// }());
