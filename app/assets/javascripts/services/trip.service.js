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
                        start_date: trip.start_date || null,
                        end_date: trip.end_date || null,
                        trip_type: trip.type || null,
                        camping_type: trip.camping_type || null,
                        trails: tripTrails,
                        campgrounds: tripCampgrounds,
                        parks: null,
                    }
                },
                headers: {
                    Authorization: JSON.parse(sessionStorage.getItem('userToken'))
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
