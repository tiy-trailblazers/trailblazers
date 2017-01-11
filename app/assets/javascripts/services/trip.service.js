(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TripService', TripService);

    TripService.$inject = [ '$http' ];

    function TripService($http) {
        var tsORcs = [];
        var markerTorC = null;

        return {
            tsORcs: tsORcs,
            addTorCtoTrip: addTorCtoTrip,
            postTrip: postTrip,
            patchTrip: patchTrip,
            mapClickedpopup: mapClickedpopup,
            addMapClickedPopup: addMapClickedPopup
        };

        function addTorCtoTrip (tORc) {
            tsORcs.push(tORc);
        }

        function mapClickedpopup (tORc) {
            markerTorC = tORc;
        }

        function addMapClickedPopup() {
            tsORcs.push(markerTorC);
        }

        function postTrip(trip) {
            var tripTrails = [];
            var tripCampgrounds = [];
            var parks = [];
            tsORcs.forEach(function gettORcID(tORc) {
                if (tORc.line) {
                    tripTrails.push(tORc.id);
                } else {
                    tripCampgrounds.push(tORc.id);
                }
            });
            return $http({
                url: '/trips',
                method: 'POST',
                data: {
                    trip: {
                        name: trip.name,
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
                tsORcs = [];
                sessionStorage.setItem('trip', angular.toJson(response.data));
                return response.data;
            })
            .catch(function error(err) {
                console.log(err);
            });
        }

        function patchTrip() {

        }
    }
}());
