(function() {
    'use strict';

    var expect = window.chai.expect;

    describe('map service', function() {
        var $httpBackend;
        var MapService;

        beforeEach(module('trailblazer'));

        beforeEach(inject(function(_$httpBackend_, _MapService_) {
            $httpBackend = _$httpBackend_;
            MapService = _MapService_;

            $httpBackend.whenGET('/trails')
                .respond({
                    data: [
                        {
                            campgrounds: [
                                {
                                    name: 'Miguels',
                                    lat: '12.3456789',
                                    long: '98.7654321',
                                    description: 'Best Pizza in WV. Best campground for Red River Gorge!'
                                }
                            ],
                            trails: [
                                {
                                    name: 'Slab City Trail',
                                    lat: '13.5792468',
                                    long: '97.5318642',
                                    description: 'Entrance to slab city'
                                }
                            ]

                        }
                    ]
                });
        }));

        it('should resolve ajax call with trail and campground data', function(dc) {
            var result = MapService.findTrails([12.345, 67.891, 98.765, 43.219]);
            expect(result).to.be.an('object');
            expect(result.then).to.be.a('function');
            expect(result.catch).to.be.a('function');

            result
                .then(function(data) {
                    expect(data).to.be.an('object');
                    expect(data.campgrounds[0]).to.be.an('object');
                    expect(data.trails[0]).to.be.an('object');
                    expect(data.campgrounds[0] && data.trails[0]).to.include.keys('name', 'lat', 'long', 'description');
                    dc();
                })
                .catch(function() {
                    dc('failed findTrails test');
                });

                $httpBackend.flush();
        });
    });



}());
