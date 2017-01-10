(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TrailandCampgroundService', TrailandCampgroundService);

    TrailandCampgroundService.$inject = [ '$http', '$rootScope' ];

    /**
     * Constructs angular service for trail and campground http requests
     * @param {Service} $http core angular service for http requests
     */
    function TrailandCampgroundService($http, $rootScope){

        return {
            findTsandCs: findTsandCs,
            findTsandCsSearchForm: findTsandCsSearchForm
        };
        /**
         * executes http request to app backend for trail and campground data
         * @param  {Array} coordinates location data based off radius rectangle
         * @return {Promise} angular promise functions            [description]
         */
        function findTsandCs(coordinates){
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
                    east: east,
                    min_length: 0.2,
                    max_length: 20
                }
            })
            .then( function transformResponse(response) {
                var trails = response.data.trails;
                var campgrounds = response.data.campgrounds;
                $rootScope.searched = true;
                return { trails: trails, campgrounds: campgrounds};
            });
        }

        function findTsandCsSearchForm(searchValues) {
            console.log(searchValues);
            var trail = searchValues.trail;
            var campground = searchValues.campground;
            var park = searchValues.park;
            return $http({
                url: 'map_items/search',
                method: 'POST',
                data: {
                    name: trail || campground,
                    park_name: park
                }
            })
            .then(function success(response){
                console.log(response);
                var trails = response.data[0].trails;
                var campgrounds = response.data[0].campgrounds;
                $rootScope.searched = true;
                return { trails: trails, campgrounds: campgrounds};
            })
            .catch(function error(err) {
                console.log(err);
            });
        }

    }

}());
