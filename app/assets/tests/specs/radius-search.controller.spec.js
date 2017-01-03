(function() {
    'use strict';

    var expect = window.chai.expect;

    describe('radius-search controller', function() {
        var RadiusSearchController, stateParams, $httpBackend;
        var mockTrailandCampgroundService = {};

        beforeEach(module('trailblazer'));

        beforeEach(module(function($provide){
            $provide.value('TrailandCampgroundService', mockTrailandCampgroundService);
        }));

        beforeEach(inject(function($controller, _$httpBackend_, $q){
            $httpBackend = _$httpBackend_;
            stateParams = {
                transCoords: [ 12.34, 56.78, 87.65, 43.21 ],
                centerCoords: [ 12.34, 56.78 ]
            };

            mockTrailandCampgroundService.findTsandCs = function(){
                return $q.resolve({
                    trails: [
                        {
                            name: 'Big Trail',
                            length: 12.34,
                            start_lat: 43.21,
                            start_lon: 87.65
                        },
                        {
                            name: 'Little Trail',
                            length: 1.234,
                            start_lat: 87.65,
                            start_lon: 43.21
                        }
                    ],
                    campgrounds: [
                        {
                            name: 'Big Campground',
                            lat: 43.21,
                            lon: 87.65
                        },
                        {
                            name: 'Little Campground',
                            lat: 87.65,
                            lon: 43.21
                        }
                    ]
                });
            };

            $httpBackend.whenGET('templates/buffering.template.html')
                .respond(
                    RadiusSearchController = $controller('RadiusSearchController', {$stateParams:stateParams})
                );
        }));

        it('should contain scope variables', function() {
            expect(RadiusSearchController.coordinates).to.be.an('array');
            expect(RadiusSearchController.coordinates.length).to.equal(4);
            expect(RadiusSearchController.coordinates[0]).to.equal(12.34);
            expect(RadiusSearchController.trails).to.equal(null);
            expect(RadiusSearchController.campground).to.equal(null);
        });

        it('should set trail and campground variables', function(dc) {
            var result = mockTrailandCampgroundService.findTsandCs();

            result
                .then(function(){
                    expect(RadiusSearchController.trails).to.be.an('array');
                    expect(RadiusSearchController.trails[1]).to.include.keys('name', 'length', 'start_lat', 'start_lon');
                    expect(RadiusSearchController.campgrounds).to.be.an('array');
                    expect(RadiusSearchController.campgrounds[1]).to.include.keys('name', 'lon', 'lat');
                    dc();
                })
                .catch(function(){
                    dc('failed');
                });

            $httpBackend.flush();
        });
    });
}());
