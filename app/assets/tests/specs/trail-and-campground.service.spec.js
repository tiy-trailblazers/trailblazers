(function() {
    'use strict';

    var expect = window.chai.expect;

    describe('trailandcampground service', function() {
        var $httpBackend;
        var TrailandCampgroundService;

        beforeEach(module('trailblazer'));

        beforeEach(inject(function(_$httpBackend_, _TrailandCampgroundService_) {
            $httpBackend = _$httpBackend_;
            TrailandCampgroundService = _TrailandCampgroundService_;

            $httpBackend.whenGET('templates/home.template.html')
                .respond('recieved home template');

            $httpBackend.whenGET('/trails?west=12.345&south=67.891&east=98.765&north=43.219')
                .respond({
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

                    });
        }));

        it('should resolve ajax call with trail and campground data', function(dc) {
            var result = TrailandCampgroundService.findTrails([12.345, 67.891, 98.765, 43.219]);
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
                .catch(function(err) {
                    console.log('errMessage', err.message);
                    dc('failed findTrails test');
                });

                $httpBackend.flush();
        });
    });



}());
