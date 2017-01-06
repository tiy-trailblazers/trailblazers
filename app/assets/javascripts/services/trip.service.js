(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TripService', TripService);

    TripService.$inject = [ '$http' ];

    function TripService($http) {
        var tsORcs = [];

        return {
            tsORcs: tsORcs,
            addTorCtoTrip: addTorCtoTrip,
            postTrip: postTrip,
            patchTrip: patchTrip,
        };

        function addTorCtoTrip (tORc) {
            tsORcs.push(tORc);
            console.log('array', tsORcs);
        }

        function postTrip(trip) {
            var tripTrails = [];
            var tripCampgrounds = [];
            var parks = [];
            tsORcs.forEach(function gettORcID(tORc) {
                if (tORc.toilets) {
                    tripCampgrounds.push(tORc.id);
                } else {
                    tripTrails.push(tORc.id);
                }
                console.log('trails', tripTrails);
                console.log('campgrounds', tripCampgrounds);
            });
            console.log(trip);
            return $http({
                url: '/trips',
                method: 'POST',
                data: {
                    trip: {
                        start_date: trip.start_date,
                        end_date: trip.end_date,
                        trip_type: trip.type,
                        camping_type: trip.camping_type,
                        trails: tripTrails,
                        campgrounds: tripCampgrounds,
                        parks: parks,
                    }
                },
                headers: {
                    Authorization: JSON.parse(sessionStorage.getItem('user')).token
                }
            })
            .then(function success(response) {
                console.log(response);
            })
            .catch(function error(err) {
                console.log(err);
            });
        }

        function patchTrip() {

        }
    }
}());
