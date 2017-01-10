(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('trip', TripSummaryDirective);

    TripSummaryDirective.$inject = [];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function TripSummaryDirective() {
        var campgroundMarkers = [];
        var trailheadMarkers = [];
        var trailLineLayers = [];

        return {
            restrict: 'E',
            scope: {
                tripData: '@',
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap($scope) {
            var element = 'map';
            var map;
            var popupOverlay = new ol.Overlay({
                element: $('#popup')[0]
            });
            console.log($('#trailpopup'));
            var summary = new ol.Overlay({
                element: $('#trailpopup')[0],
            });

            // console.log('trip data', $scope.tripData);

            /**
             * Constructs openLayers Map
             * @param  {Object} baseLayer MapBox tiles
             * @param  {Object} campgroundVectors campground markers as openlayers vector layers
             * @param  {Object} trailheadVectors trailhead markers as openlayers vector layers
             * @param  {Object} trailLineVectors openlayers line vector layers representing trails
             * @return {Object}           OpenLayers Map and configuration
             */
            function buildMap(baseLayer, campgroundVectors, trailheadVectors, trailLineVectors) {
                trailheadVectors.unshift(baseLayer);
                var vectorLayers = trailheadVectors.concat(trailLineVectors, campgroundVectors);
                var builtMap = new ol.Map({
                    target: element,
                    controls: ol.control.defaults(),
                    renderer: 'canvas',
                    layers: vectorLayers,
                    overlays: [popupOverlay, summary],
                    view: new ol.View({
                        center: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                        zoom: 11,
                        maxZoom: 20,
                        minZoom: 2
                    })
                });
                return builtMap;
            }

            var campgrounds = JSON.parse($scope.tripData).trip.campgrounds ||  JSON.parse(sessionStorage.getItem('trip')).trip.campgrounds;
            campgrounds.forEach(function markAndPlotCampgrounds(campground) {
                var campgroundCoord = [campground.longitude, campground.latitude];
                addCampgroundMarkers(centerLayers(campgroundCoord), campground.name, 'campground');
            });

            var trails = JSON.parse($scope.tripData).trails ||  JSON.parse(sessionStorage.getItem('trip')).trails;
            trails.forEach( function markAndPlottrails(trail){
                var trailCoordinates = [];
                var trailheadCoord = ([ Number(trail.head_lon), Number(trail.head_lat) ]);
                addTrailheadMarkers(centerLayers(trailheadCoord), trail.name, 'trail');
                trail.line.forEach(function plotTrail(trailNode){
                    var transformTrailNode = ol.proj.fromLonLat([ Number(trailNode.lon), Number(trailNode.lat) ]);
                    trailCoordinates.push(transformTrailNode);
                });
                createTrailLayers(trailCoordinates);
            });
            map = buildMap(buildBaseLayer(), buildMarker(campgroundMarkers), buildMarker(trailheadMarkers), buildMarker(trailLineLayers));
            $('#trailpopup .popup-content').html(
                '<h4>Your "' + JSON.parse($scope.tripData).trip.name + '" Adventure</h4>' +
                '<p>Begins on ' + JSON.parse($scope.tripData).trip.start_date + '.</p>' +
                '<section><h5>Staying At</h5>' +
                '<p>-'+ JSON.parse($scope.tripData).trip.campgrounds[0].name +'</p></section>' +
                '<section><h5>Exploring</h5>' +
                '<p>'+  JSON.parse($scope.tripData).trails[0].name + '</p></section>' +
                '<h5>There is no place like outside!</h5>'
            );
            summary.setPosition(JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords);
            // $scope.$watch('popupelm', function(){
            //     if ($scope.popupelm === '') {
            //         return;
            //     } else {
            //         var tORcObj = JSON.parse($scope.popupelm);
            //         console.log(tORcObj);
            //         var trailCoordinates = ol.proj.fromLonLat([tORcObj.longitude, tORcObj.latitude]);
            //         if (tORcObj.campground_type) {
            //             $('.popup-content').html(
            //                 '<p>' + tORcObj.name + '<p>'
            //             );
            //         } else {
            //             $('.popup-content').html(
            //                 '<p>' + tORcObj.name + '<p>' +
            //                 '<p>Length: ' + Math.round(Number(tORcObj.length)*10)/10 + ' miles<p>'
            //             );
            //         }
            //         map.getView().animate({zoom: 12}, {center: trailCoordinates});
            //         popupOverlay.setPosition(trailCoordinates);
            //     }
            // });


            map.on('click', function(evt) {
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function(feature) {
                        return feature;
                    });
                    if (feature) {
                        if (feature.get('name') === 'TrailLine') {
                            return;
                        }
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();
                        $('#popup .popup-content').html(
                            '<p>' + feature.get('name') + '</p>'
                        );
                        map.getView().animate({zoom: 12}, {center: coord});
                        popupOverlay.setPosition(coord);
                    }
            });

        }

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
         * @param {Object} icons OpenLayers Feature used to build map vector layer
         * @return {Object} rectangle vector layer compatible with map
         */
        function buildMarker(icons) {
            var vectorArray = [];
            icons.forEach(function buildVector(icon) {
                var vectorSource = new ol.source.Vector({
                    features: [icon]
                });
                var vector = new ol.layer.Vector({
                    source: vectorSource,
                    zIndex: setZIndex(icon)
                    });

            vectorArray.push(vector);
            });
            return vectorArray;
        }

        /**
         * sets Zindex for map layers based off marker type
         * @param {Object} icon OpenLayers Feature used to build map vector layer
         */
        function setZIndex(icon) {
            if (icon.H.type === 'trail' || icon.H.type === 'campground') {
                return 2;
            } else {
                return 0;
            }
        }

        /**
         * creates campground markers as open layer feautures
         * @param {coordinates} coordinates geo coordinates for placement of
         * markers on map
         */
        function addCampgroundMarkers(coordinates, name, type) {
           var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: name,
                type: type
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'images/tent-icon.png',
                    scale: 0.075
                })
            });

            iconFeature.setStyle(iconStyle);
            campgroundMarkers.push(iconFeature);
        }

        /**
         * creates trailhead markers as open layer feautures
         * @param {coordinates} coordinates geo coordinates for placement of
         * markers on map
         */
        function addTrailheadMarkers(coordinates, name, type) {
           var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: name,
                type: type
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'images/trailhead.png',
                    scale: 0.175
                }),
            });

            iconFeature.setStyle(iconStyle);
            trailheadMarkers.push(iconFeature);
        }

        /**
         * creates trail markers as open layer line feautures
         * @param {trails} trails array of geo coordinates for placement of
         * trails on map
         */
        function createTrailLayers(trails) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.LineString(trails),
                name: 'TrailLine'
            });

            var iconStyle = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [255, 255, 0, 0.6],
                  width: 12.5
              })
            });

            iconFeature.setStyle(iconStyle);
            trailLineLayers.push(iconFeature);
        }

        /**
         * creates center point for map on page load
         * @param {coordinates} coordinates geo coordinates for placement of
         * center on map
         */
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
    }
}());
