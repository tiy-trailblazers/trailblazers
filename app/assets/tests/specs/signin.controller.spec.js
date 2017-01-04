(function() {
    'use strict';

    var expect = chai.expect;

    describe('sign in controller', function() {
        var SigninController, $httpBackend;
        var mockUserService = {};

        beforeEach(module('trailblazer'));

        beforeEach(module(function($provide) {
            $provide.value('UserService', mockUserService);
        }));

        beforeEach(inject(function($controller, _$httpBackend_, $q) {
            $httpBackend = _$httpBackend_;
            SigninController = $controller('SigninController');

            $httpBackend.whenGET('templates/signin.template.html')
                .respond('Recieved signin template');

            $httpBackend.whenGET('templates/profile.template.html')
                .respond('Recieved profile template');

            mockUserService.signinUser = function() {
                return $q.resolve({
                    id: 1,
                    first_name: 'nick',
                    last_name: 'galant'
                });
            };

            mockUserService.createUser = function() {
                return $q.resolve({
                    id: 2,
                    first_name: 'nicholas',
                    last_name: 'galantowicz'
                });
            };
        }));

        it('should contain scope variables', function() {
            expect(SigninController.user).to.be.an('object');
            expect(SigninController.userCreate).to.equal(false);
        });

        it('should recieve data back from user service when user creates an account', function(dc) {

            SigninController.userAccount({
                fristname: 'nick',
                lastname: 'galantowicz',
                email: 'ngalantowicz@gmail.com',
                password: 'nick',
                passwordConf: 'nick'
            });
            expect(SigninController.user).to.be.an('object');
            expect(SigninController.userCreate).to.equal(false);
            var result = mockUserService.createUser();
            expect(result).to.be.an('object');
            expect(result.then).to.be.a('function');
            result
                .then(function(data) {
                    expect(data.first_name).to.equal('nicholas');
                    expect(data.id).to.equal(2);
                    dc();
                })
                .catch(function(err) {
                    console.log(err);
                    dc('failed');
                });

            $httpBackend.flush();
        });

        it('should recieve data back from user service when user signs in', function(dc) {

            SigninController.userAccount({
                email: 'ngalantowicz@gmail.com',
                password: 'nick',
            });
            var result = mockUserService.signinUser();
            expect(result).to.be.an('object');
            expect(result.then).to.be.a('function');
            result
                .then(function(data) {
                    expect(data.first_name).to.equal('nick');
                    expect(data.id).to.equal(1);
                    dc();
                })
                .catch(function(err) {
                    console.log(err);
                    dc('failed');
                });

            $httpBackend.flush();
        });

    });
}());
