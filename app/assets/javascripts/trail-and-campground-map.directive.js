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
