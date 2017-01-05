(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TripService', TripService);

    function TripService() {
        var tsORcs = [];

        return {
            tsORcs: tsORcs,
            addTorCtoTrip: addTorCtoTrip,
            postTrip: postTrip,
            patchTrip: patchTrip,
        };

        function addTorCtoTrip (tORc) {
            console.log(tORc);
            tsORcs.push(tORc);
            console.log('array', tsORcs);
        }

        function postTrip() {

        }

        function patchTrip() {

        }
    }
}());
