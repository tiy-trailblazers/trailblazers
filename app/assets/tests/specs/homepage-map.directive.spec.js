(function() {
    'use strict';

    var expect = chai.expect;

    describe('homepage map directive', function() {
        var $compile, $rootScope, $httpBackend,  map;

        beforeEach(module('trailblazer'));

        beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('templates/home.template.html')
                .respond('Received homepage template');

            map = angular.element('<map id="map"></map>');
            $compile(map)($rootScope);
            $rootScope.$digest();
        }));

        it('should create map element', function() {
            var element = map;
            console.log(element);
            expect(element.length).to.equal(1);
        });

    });
}());
