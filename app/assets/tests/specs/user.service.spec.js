(function() {
    'use strict';

    var expect = chai.expect;

    describe('user service', function() {
        var $httpBackend, UserService;

        beforeEach(module('trailblazer'));

        beforeEach(inject(function(_$httpBackend_, _UserService_) {
            $httpBackend = _$httpBackend_;
            UserService = _UserService_;

            $httpBackend.whenPOST('/users')
                .respond({
                    first_name: 'nick',
                    last_name: 'galantowicz',
                    email: 'ngalantowicz@gmail.com',
                    password: 'nick',
                });

            $httpBackend.whenPOST('/session')
                .respond({
                    email: 'ngalantowicz@gmail.com',
                    password: 'nick',
                });

            $httpBackend.whenGET('templates/home.template.html')
                .respond('Recieved home template');
        }));

        it('sign in fn should resolve ajax call with user data', function(dc) {
            var result = UserService.signinUser({
                email: 'ngalantowicz@gmail.com',
                password: 'nick',
            });

            result
                .then(function(data){
                    expect(data).to.be.an('object');
                    expect(data).to.include.keys('email', 'password');
                    expect(data).to.not.include.keys('first_name', 'last_name');
                    dc();
                })
                .catch(function(err) {
                    console.log('error', err);
                    dc('failed');
                });

            $httpBackend.flush();
        });

        it('sign in fn should resolve ajax call with user data', function(dc) {
            var result = UserService.createUser({
                fristname: 'nick',
                lastname: 'galantowicz',
                email: 'ngalantowicz@gmail.com',
                password: 'nick',
                passwordConf: 'nick'
            });

            result
                .then(function(data){
                    expect(data).to.be.an('object');
                    expect(data).to.include.keys('first_name', 'last_name', 'email', 'password');
                    dc();
                })
                .catch(function(err) {
                    console.log('error', err);
                    dc('failed');
                });

            $httpBackend.flush();
        });
    });
}());
