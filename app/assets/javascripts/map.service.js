(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('MapService', MapService);

    MapService.$inject = [ '$http' ];

    function MapService($http){

        return {
            findTrails: findTrails
        };

        function findTrails(coordinates){
            console.log(coordinates);
            var north = coordinates[0];
            var west = coordinates[1];
            var south = coordinates[2];
            var east = coordinates[3];

            return $http({
                url: '/trails',
                params: {
                    north: north,
                    south: south,
                    west: west,
                    east: east
                }
            })
            .then( function resovledResonse(response) {
                console.log(response);
            })
            .catch( function rejectedResponse(xhr) {
                console.log(xhr);
            });
        }

    }

}());
