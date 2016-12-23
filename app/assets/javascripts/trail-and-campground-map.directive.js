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
            var vector;
            //var source;
            var baseLayer;
            var iconFeature;

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
            function buildMarker(icon) {
                var vectorSource = new ol.source.Vector({
                    features: [icon]
                });

                vector = new ol.layer.Vector({
                    source: vectorSource
                });
                // source = new ol.source.Vector({wrapX: false});
                //
                // vector = new ol.layer.Vector({
                //     source: source
                // });
                return vector;
            }

            function addCampgroundMarkers() {
               iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(centerMap($stateParams.centerCoords)),
                    name: 'Camping',
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'images/tent-icon.png',
                        scale: 0.05
                    }))
                });

                iconFeature.setStyle(iconStyle);

            }

            addCampgroundMarkers();

            /**
             * Constructs openLayers Map
             * @param  {Object} baseLayer MapBox tiles
             * @param  {Object} vector    Rectangle radius vector object
             * @return {Object}           OpenLayers Map and configuration
             */
            function buildMap(baseLayer, vector) {
                map = new ol.Map({
                    target: element,
                    controls: ol.control.defaults(),
                    renderer: 'canvas',
                    layers: [baseLayer, vector],
                    view: new ol.View({
                        center: centerMap($stateParams.centerCoords),
                        zoom: 12,
                        maxZoom: 18,
                        minZoom: 2
                    })
                });
                return map;
            }

            buildMap(buildBaseLayer(), buildMarker(iconFeature));

            function centerMap(coordinates) {
                if (!coordinates) {
                    return [ -10853463.910959221, 4789639.227729736 ];
                }
                var coordArray = coordinates;
                var eastWest = (coordArray[0]-((coordArray[0]-coordArray[2])/2));
                var northSouth = (coordArray[1]-((coordArray[1]-coordArray[3])/2));
                var center = [ eastWest, northSouth ];
                return center;
            }

        }
    }
}());
