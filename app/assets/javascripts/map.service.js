(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('MapService', MapService);

    MapService.$inject = [ '$htpp' ];

    function MapService($http){

        return {
            findTrails: findTrails
        };

        function findTrails(coordinates){
            return $http({
                url: '/trails',
                params: {
                    coordinates: coordinates
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
