(function() {
    'use strict';

    var expect = window.chai.expect;

    describe('TandC Controller', function() {
        var TandCController, stateParams, $httpBackend;

        beforeEach(module('trailblazer'));

        beforeEach(inject(function($controller, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            stateParams =  {
                trails: [
                    {
                        name: 'Big Trail',
                        length: 12.34,
                        line : [
                            {
                                lat: 12.34,
                                lon: 43.21
                            },
                            {
                                lat: 43.21,
                                lon: 12.34
                            }
                        ],
                        start_lat: 56.78,
                        start_lon: 87.65
                    },
                    {
                        name: 'Little Trail',
                        length: 1.234,
                        line : [
                            {
                                lat: 12.34,
                                lon: 43.21
                            },
                            {
                                lat: 43.21,
                                lon: 12.34
                            }
                        ],
                        start_lat: 56.78,
                        start_lon: 87.65
                    }
                ],
                campgrounds: [
                    {
                        name: 'Big Campground',
                        lat: 56.78,
                        lon: 87.65
                    },
                    {
                        name: 'Little Campground',
                        lat: 56.78,
                        lon: 87.65
                    }
                ]
            };

            $httpBackend.whenGET('templates/trails-and-campgrounds.template.html')
                .respond(
                    TandCController = $controller('TrailandCampgroundController', {$stateParams:stateParams})
                );
        }));

        it('should contain scope variables', function(){
            expect(TandCController.trails).to.be.an('array');
            expect(TandCController.trails.length).to.equal(2);
            expect(TandCController.trails[1]).to.include.keys('name', 'length', 'line', 'start_lon', 'start_lat');
            expect(TandCController.campgrounds).to.be.an('array');
            expect(TandCController.campgrounds.length).to.equal(2);
            expect(TandCController.campgrounds[1]).to.include.keys('name', 'lon', 'lat');
            expect(TandCController.element = null);
        });

        it('should set element scope variable to trail passed in "trailPopup" FN', function() {
            var result = TandCController.trailPopup(TandCController.trails[1]);
            expect(result).to.be.an('object');
            expect(result).to.include.keys('name', 'length', 'line', 'start_lon', 'start_lat');
        });

        it('should set this.element to null in "trailPopup" FN if this.element is truthy', function() {
            TandCController.trailPopup(TandCController.trails[1]);
            var result = TandCController.trailPopup(TandCController.trails[1]);
            expect(result).to.equal(undefined);
            expect(TandCController.element).to.equal(null);
        });

    });
}());
