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
            var latitude = coordinates[0];
            var longitude = coordinates[1];

            return $http({
                url: '/trails',
                params: {
                    north: latitude + 1,
                    south: latitude ,
                    west: longitude,
                    east: longitude + 1
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
