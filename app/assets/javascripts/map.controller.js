(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('MapController', MapController);

    function MapController(){

        var vm = this;
        vm.baseLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg' })
        });

        vm.map = new ol.Map({
            target: 'map',
            controls: ol.control.defaults().extend([
                new ol.control.ZoomSlider()
            ]),
            renderer: 'canvas',
            layers: [vm.baseLayer],
            view: new ol.View({
                center: [ -10853463.910959221, 4789639.227729736 ],
                zoom: 4,
                maxZoom: 18,
                minZoom: 2
            })
        });

        vm.popup = new ol.Overlay({
            element: document.getElementById('popup')
          });
        vm.map.addOverlay(vm.popup);

        vm.map.on('click', function(evt) {
              console.log(evt);
            var element = vm.popup.getElement();
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinate, 'EPSG:3857', 'EPSG:4326'));
            console.log(hdms);

            $(element).popover('destroy');
            vm.popup.setPosition(coordinate);
            $(element).popover({
              'placement': 'top',
              'animation': false,
              'html': true,
              'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
            });
            $(element).popover('show');
          });

      }
}());
