(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('map', ['MapService', mapDirective]);

    function mapDirective(MapService) {
        return {
            templateUrl: 'templates/map.template.html',
            restrict: 'E',
            scope: {
                title: '='
            },

            link: function () {
                var element = 'map';

                var baseLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg' })
                });

                var source = new ol.source.Vector({wrapX: false});


                var vector = new ol.layer.Vector({
                    source: source,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 255, 0, 0.5)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                            color: '#ffcc33'
                            })
                        })
                    })
                });

                var map = new ol.Map({
                    target: element,
                    controls: ol.control.defaults().extend([
                        new ol.control.ZoomSlider()
                    ]),
                    renderer: 'canvas',
                    layers: [baseLayer, vector],
                    view: new ol.View({
                        center: [ -10853463.910959221, 4789639.227729736 ],
                        zoom: 4,
                        maxZoom: 18,
                        minZoom: 2
                    })
                });

                map.on('singleclick', function(evt) {
                      console.log(evt);
                    MapService.findTrails(evt.coordinate);
                    map.removeInteraction(draw);
                  });

                  var draw; // global so we can remove it later
                  function addInteraction() {

                      draw = new ol.interaction.Draw({
                          source: source,
                          type: 'Circle',
                          geometryFunction: ol.interaction.Draw.createBox()
                      });

                      map.addInteraction(draw);
                      }

                  addInteraction();

                  draw.on('drawend',function(e){
                      console.log('drawned', e.feature.getGeometry().getExtent());
                      map.removeInteraction(draw);
                  });

             }
         };
     }

}());
