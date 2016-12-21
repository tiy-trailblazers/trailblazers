(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('MapService', MapService);

    MapService.$inject = [ '$http' ];

    /**
     * Constructs angular service for trail and campground http requests
     * @param {Service} $http core angular service for http requests
     */
    function MapService($http){

        return {
            findTrails: findTrails
        };

        /**
         * executes http request to app backend for trail and campground data
         * @param  {Array} coordinates location data based off radius rectangle
         * @return {Promise} angular promise functions            [description]
         */
        function findTrails(coordinates){
            console.log(coordinates);
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
            .then( function resovledResonse(response) {
                console.log(response);
            })
            .catch( function rejectedResponse(xhr) {
                console.log(xhr);
            });
        }

    }

}());
