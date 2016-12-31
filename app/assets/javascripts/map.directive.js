(function() {
    'use strict';

    angular.module('trailblazer')
    .directive('map', MapDirective);

    MapDirective.$inject = [ 'MapService' ];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function MapDirective(MapService) {
        return {
            templateUrl: 'templates/map.template.html',
            restrict: 'E',
            scope: {
                dataTitle: '='
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap() {
            var element = 'map';

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

                var vector = new ol.layer.Vector({
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
                        src: 'images/204712-200.png'
                    })
                })
            });

            map.getView().on('change:resolution', function setRaduisBox() {
                //e.preventDefault();
                //console.log(map.getView().getZoom());
                if (map.getView().getZoom() > 7) {
                        map.addInteraction(draw);
                    }
            });

            draw.on('drawend',function(e){
                var coordArray = e.feature.getGeometry().v;
                var transCoordOne = ol.proj.transform([ coordArray[0], coordArray[1]], 'EPSG:3857', 'EPSG:4326');
                var transCoordTwo = ol.proj.transform([ coordArray[2], coordArray[3]], 'EPSG:3857', 'EPSG:4326');
                var coordinates = transCoordOne.concat(transCoordTwo);
                console.log('coord', coordinates);
                MapService.findTrails(coordinates);
                map.removeInteraction(draw);
                map.removeLayer(buildBaseLayer());

            });

        }
    }

}());