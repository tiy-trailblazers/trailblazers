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
       })
       .state({
           name: 'trails-and-campgrounds',
           url: '/trails-and-campgrounds',
           templateUrl: 'templates/trails-and-campgrounds.template.html',
           params: {
               centerCoords: null,
               trails: null,
               campgrounds: null,
           }
       })
       .state({
           name: 'buffer',
           url: '/buffering',
           templateUrl: 'templates/buffering.template.html',
           controller: 'TrailandCampgroundController',
           controllerAs: 'TandC',
           params: {
               transCoords: null,
               centerCoords: null
           }
       });

    }



}());

(function() {
    'use strict';

    angular.module('trailblazer')
    .directive('map', MapDirective);

    MapDirective.$inject = [ '$state' ];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function MapDirective($state) {
        return {
            restrict: 'EA',
            scope: {
                dataTitle: '=',
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
                        src: 'images/trailhead.png'
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
                $state.go('buffer', {transCoords: coordinates, centerCoords: coordArray});
                map.removeLayer(vector);
                map.removeInteraction(draw);
            });

        }
    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
    .directive('tandcmap', TrailandCampgroundMapDirective);

    TrailandCampgroundMapDirective.$inject = ['$stateParams'];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function TrailandCampgroundMapDirective($stateParams) {
        return {
            restrict: 'EA',
            scope: {
                dataTitle: '=',
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap() {
            var element = 'map';
            var map;
            var vectorArray = [];
            //var source;
            var baseLayer;
            var campgroundMarkers = [];
            var trailheadMarkers = [];
            var trailLineLayers = [];

            /**
             * Configs base Map layer with tiles sourced from MapBox
             * @return {Object} Vector layer used for map tileing
             */
            function buildBaseLayer() {
                baseLayer = new ol.layer.Tile({
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
            function buildMarker(icons) {
                icons.forEach(function buildVector(icon) {
                    var vectorSource = new ol.source.Vector({
                        features: [icon]
                    });

                    var vector = new ol.layer.Vector({
                        source: vectorSource
                    });
                    vectorArray.push(vector);
                });
                return vectorArray;
            }


            /**
             * Constructs openLayers Map
             * @param  {Object} baseLayer MapBox tiles
             * @param  {Object} vector    Rectangle radius vector object
             * @return {Object}           OpenLayers Map and configuration
             */
            function buildMap(baseLayer, campgroundVectors, trailheadVectors, trailLineVectors) {
                campgroundVectors.unshift(baseLayer);
                var vectorLayers = campgroundVectors.concat(trailLineVectors, trailheadVectors);
                var mapLayers = vectorLayers;
                map = new ol.Map({
                    target: element,
                    controls: ol.control.defaults(),
                    renderer: 'canvas',
                    layers: mapLayers,
                    view: new ol.View({
                        center: centerLayers($stateParams.centerCoords),
                        zoom: 11,
                        maxZoom: 19,
                        minZoom: 2
                    })
                });
                return map;
            }

            function addCampgroundMarkers(coordinates) {
               var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    name: 'Camping'
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        src: 'images/tent-icon.png',
                        scale: 0.03
                    }))
                });

                iconFeature.setStyle(iconStyle);
                campgroundMarkers.push(iconFeature);
            }

            function addTrailheadMarkers(coordinates) {
               var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    name: 'Trailhead'
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        src: 'images/trailhead.png',
                        scale: 0.15
                    }))
                });

                iconFeature.setStyle(iconStyle);
                trailheadMarkers.push(iconFeature);
            }

            function createTrailLayers(trails) {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.LineString(trails),
                    name: 'Trail'
                });

                var iconStyle = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                      color: [255, 255, 0, 0.5],
                      width: 8
                  })
                });

                iconFeature.setStyle(iconStyle);
                trailLineLayers.push(iconFeature);
            }

            function centerLayers(coordinates) {
                if (!coordinates) {
                    return;
                } else if (coordinates.length === 2) {
                    var transformCoordOne = ol.proj.fromLonLat([ coordinates[0], coordinates[1]]);
                    var transformCoordTwo = ol.proj.fromLonLat([( coordinates[0] + 0.005), ( coordinates[1] + 0.005 )]);
                    var markCoordinates = transformCoordOne.concat(transformCoordTwo);
                    return markCoordinates;
                }
                var coordArray = coordinates;
                var eastWest = (coordArray[0]-((coordArray[0]-coordArray[2])/2));
                var northSouth = (coordArray[1]-((coordArray[1]-coordArray[3])/2));
                var center = [ eastWest, northSouth ];

                return center;
            }

            function findCampgroundsAndTrails() {
                console.log('running', $stateParams);
                if (!$stateParams.campgrounds) {
                    return;
                }
                else {
                    var campgrounds = $stateParams.campgrounds;
                    campgrounds.forEach(function markAndPlotCampgrounds(campground) {
                        var campgroundCoord = [campground.longitude, campground.latitude];
                        addCampgroundMarkers(centerLayers(campgroundCoord));
                    });
                    var trailCoordinates = [];
                    var trails = $stateParams.trails;
                    console.log('trails', trails);
                    trails.forEach( function markAndPlottrails(trail){
                        var trailheadCoord = ([ Number(trail.head_lon), Number(trail.head_lat) ]);
                        addTrailheadMarkers(centerLayers(trailheadCoord));
                        trail.line.forEach(function plotTrail(trailNode){
                            var transformTrailNode = ol.proj.fromLonLat([ Number(trailNode.lon), Number(trailNode.lat) ]);
                            trailCoordinates.push(transformTrailNode);
                        });
                    });
                    window.clearInterval(waitForMarkerData);
                    createTrailLayers(trailCoordinates);
                    buildMap(buildBaseLayer(), buildMarker(campgroundMarkers), buildMarker(trailheadMarkers), buildMarker(trailLineLayers));
                }
            }

            var waitForMarkerData = window.setInterval(findCampgroundsAndTrails,1000);
        }
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = [ '$state', '$stateParams', 'TrailandCampgroundService' ];

    function TrailandCampgroundController($state, $stateParams, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.transCoords;
        vm.trails = null;
        vm.campground = null;
        vm.getTrails = TrailandCampgroundService.findTrails(vm.coordinates)
            .then(function transformData(data) {
                console.log(data);
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                $state.go('trails-and-campgrounds', {centerCoords: $stateParams.centerCoords, trails: vm.trails, campgrounds: vm.campgrounds });
                $stateParams.trails = vm.trails;
                $stateParams.campgrounds = vm.campgrounds;
            })
            .catch(function errHandler(err) {
                console.log(err);
            });

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
            console.log('service', coordinates);
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
                console.log('callBack', response);
                var trails = response.data.trails;
                var campgrounds = response.data.campgrounds;
                return { trails: trails, campgrounds: campgrounds};
            });
        }

    }

}());
