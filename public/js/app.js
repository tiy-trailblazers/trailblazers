(function() {
    'use strict';

    angular.module('trailblazer', [  'openlayers-directive', 'ngSanitize', 'ui.router'])
        .config(viewConfig);

    viewConfig.$inject = [ '$stateProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');

       $stateProvider
       .state({
           name: 'home',
           url: '/',
           templateUrl: 'templates/home.template.html',
       })
       .state({
           name: 'trails-and-campgrounds',
           url: '/trails-and-campgrounds',
           templateUrl: 'templates/trails-and-campgrounds.template.html',
           controller: 'TrailandCampgroundController',
           controllerAs: 'TandC',
           params: {
               user_token: null,
               centerCoords: checkSessionStorage('center'),
               trails: checkSessionStorage('trails'),
               campgrounds: checkSessionStorage('campgrounds')
           }
       })
       .state({
           name: 'buffer',
           url: '/buffering',
           templateUrl: 'templates/buffering.template.html',
           controller: 'RadiusSearchController',
           controllerAs: 'buffer',
           params: {
               transCoords: null,
               centerCoords: null
           }
       })
       .state({
           name: 'signin',
           url: '/signin',
           templateUrl: 'templates/signin.template.html',
           controller: 'SigninController',
           controllerAs: 'signin'
       })
       .state({
           name: 'profile',
           url: '/profile/:id',
           templateUrl: 'templates/profile.template.html',
           controller: 'UserProfileController',
           controllerAs: 'user',
           params: {
               id: null,
               user_name: null
           }
       });

       function checkSessionStorage(param) {
           if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'center') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords;
           } else if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'trails') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).trails;
           } else if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'campgrounds') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
           } else {
               return null;
           }
       }

    }



}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('RadiusSearchController', RadiusSearchController);

    RadiusSearchController.$inject = [ '$state', '$stateParams', 'TrailandCampgroundService' ];

    function RadiusSearchController($state, $stateParams, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.transCoords || JSON.parse(sessionStorage.getItem('TsandCs')).transCoords;
        vm.trails = null;
        vm.campground = null;
        vm.getTandC = TrailandCampgroundService.findTsandCs(vm.coordinates)
            .then(function transformData(data) {
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                window.sessionStorage.setItem('TsandCs', angular.toJson({trails: data.trails, campgrounds: data.campgrounds, centerCoords: $stateParams.centerCoords || JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords, transCoords: $stateParams.transCoords || JSON.parse(sessionStorage.getItem('TsandCs')).transCoords}));
            })
            .catch(function errHandler(err) {
                console.log(err);
            });

        vm.noSignin = function noSignin() {
            $state.go('trails-and-campgrounds', {centerCoords: $stateParams.centerCoords, trails: vm.trails, campgrounds: vm.campgrounds });
        };

        vm.signin = function signin() {
            $state.go('signin');
        };

    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ 'UserService', '$state' ];

    function SigninController(UserService, $state){
        var vm = this;
        vm.user = {};
        vm.userCreate = false;
        vm.message = null;

        vm.userAccount = function userAccount(user) {
            if (Object.keys(user).length === 2) {
            UserService.signinUser(user)
                .then( function success(data) {
                    console.log(data);
                    if(data.error){
                        vm.message = data.error;
                        return;
                    }
                    sessionStorage.setItem('userToken', angular.toJson(data.token));
                    $state.go('trails-and-campgrounds', {
                        user_token: data.token,
                        centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                        trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                        campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
                    });
                })
                .catch( function error(err) {
                    console.log(err);
                });
                vm.user = {};
                vm.userCreate = false;
            } else {
                UserService.createUser(user)
                    .then( function success(data) {
                        sessionStorage.setItem('userToken', angular.toJson(data.token));
                        $state.go('trails-and-campgrounds', {
                            user_token: data.token,
                            centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                            trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                            campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
                        });
                    })
                    .catch( function error(err) {
                        console.log(err);
                    });
            }
            vm.user = {};
            vm.userCreate = false;
        };

        vm.userCreateSwitch = function userCreateSwitch() {
            vm.userCreate = !vm.userCreate;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$stateParams', 'TripService'];

    function TrailandCampgroundController($stateParams, TripService) {
        var vm = this;

        vm.trails = $stateParams.trails || JSON.parse(sessionStorage.getItem('TsandCs')).trails;
        vm.campgrounds = $stateParams.campgrounds || JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
        vm.element = null;

        vm.trailPopup = function trailPopup(element){
            vm.element = element;
        };

        vm.addTrip = function addTrip(tripItem) {
            console.log(tripItem);
            TripService.addTorCtoTrip(tripItem);
        };
    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ 'TripService' ];

    function TripController(TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.signedIn = JSON.parse(sessionStorage.getItem('userToken')) || null;


        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [ '$stateParams' ];

    function UserProfileController($stateParams) {
        var vm = this;
        console.log($stateParams);
        vm.user = $stateParams.user_name;
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
    .directive('map', MapDirective);

    MapDirective.$inject = [ '$state' ];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function MapDirective($state) {
        return {
            restrict: 'EA',
            scope: {
                dataTitle: '=',
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap() {
            var element = 'map';
            var vector = buildRectangle();

            var map = buildMap(buildBaseLayer(), vector, element);

            var draw = new ol.interaction.Draw({
                source: new ol.source.Vector({wrapX: false}),
                type: 'Circle',
                geometryFunction: ol.interaction.Draw.createBox(),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ffdd55',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 290, 0, 0.4)'
                    }),
                    image: new ol.style.Icon({
                        scale: 0.15,
                        src: 'images/trailhead.png'
                    })
                })
            });

            map.getView().on('change:resolution', function setRaduisBox() {
                if (map.getView().getZoom() > 7.5) {
                        $('map').css('cursor','none');
                        map.addInteraction(draw);
                    }
            });

            draw.on('drawend',function(e){
                var coordArray = e.feature.getGeometry().v;
                var transCoordOne = ol.proj.transform([ coordArray[0], coordArray[1]], 'EPSG:3857', 'EPSG:4326');
                var transCoordTwo = ol.proj.transform([ coordArray[2], coordArray[3]], 'EPSG:3857', 'EPSG:4326');
                var coordinates = transCoordOne.concat(transCoordTwo);
                $state.go('buffer', {transCoords: coordinates, centerCoords: coordArray});
            });

            $('nav').removeClass('tandc');
        }

        /**
         * Configs base Map layer with tiles sourced from MapBox
         * @return {Object} Vector layer used for map tileing
         */
        function buildBaseLayer() {
            var baseLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg'
                })
            });
            return baseLayer;
        }

        /**
         * Builds rectangle layer for user select-radius functionality
         * @return {Object} rectangle vector layer compatible with map
         */
        function buildRectangle() {
            var vector;
            var source = new ol.source.Vector({wrapX: false});

            vector = new ol.layer.Vector({
                source: source
            });
            return vector;
        }

        /**
         * Constructs openLayers Map
         * @param  {Object} baseLayer MapBox tiles
         * @param  {Object} vector    Rectangle radius vector object
         * @return {Object}           OpenLayers Map and configuration
         */
        function buildMap(baseLayer, vector, element) {
            var map = new ol.Map({
                target: element,
                controls: ol.control.defaults(),
                renderer: 'canvas',
                layers: [baseLayer, vector],
                view: new ol.View({
                    center: [ -10853463.910959221, 4789639.227729736 ],
                    zoom: 4,
                    maxZoom: 18,
                    minZoom: 2
                })
            });
            return map;
        }

    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('tandcmap', TrailandCampgroundMapDirective);

    TrailandCampgroundMapDirective.$inject = ['$stateParams'];

    /**
     * Creates Directive for OpenLayers Map Element
     * @param {Service} MapService Angular Service used for http request from map data
     * @return {Object} Directive config and map setup and event functionality
     */
    function TrailandCampgroundMapDirective($stateParams) {
        var campgroundMarkers = [];
        var trailheadMarkers = [];
        var trailLineLayers = [];
        console.log(JSON.parse(sessionStorage.getItem('TsandCs')));

        return {
            restrict: 'EA',
            scope: {
                popupelm: '@',
            },
            link: setupMap
        };

        /**
         * Creates and runs event handling for OpenLayers map
         * @return {void}
         */
        function setupMap($scope) {
            var element = 'map';
            var map;
            var popupOverlay = new ol.Overlay({
               element: document.getElementById('popup'),
               autoPan: true,
               autoPanAutomation: {
                   duration: 1000
               }
            });

            /**
             * Constructs openLayers Map
             * @param  {Object} baseLayer MapBox tiles
             * @param  {Object} campgroundVectors campground markers as openlayers vector layers
             * @param  {Object} trailheadVectors trailhead markers as openlayers vector layers
             * @param  {Object} trailLineVectors openlayers line vector layers representing trails
             * @return {Object}           OpenLayers Map and configuration
             */
            function buildMap(baseLayer, campgroundVectors, trailheadVectors, trailLineVectors) {
                trailheadVectors.unshift(baseLayer);
                var vectorLayers = trailheadVectors.concat(trailLineVectors, campgroundVectors);
                map = new ol.Map({
                    target: element,
                    controls: ol.control.defaults(),
                    renderer: 'canvas',
                    layers: vectorLayers,
                    overlays: [popupOverlay],
                    view: new ol.View({
                        center: centerLayers($stateParams.centerCoords),
                        zoom: 12,
                        maxZoom: 20,
                        minZoom: 2
                    })
                });
                return map;
            }

            /**
             * transforms resolved ajaxed data passed via StateParams to pass into
             * configuration functions.  Used by setInterval to wait for stateParams data
             * @return {void}
             */
            function findCampgroundsAndTrails() {
                if (!$stateParams.campgrounds || !JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds) {
                    return;
                }
                else {
                    console.log($stateParams);
                    var campgrounds = $stateParams.campgrounds || JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
                    campgrounds.forEach(function markAndPlotCampgrounds(campground) {
                        var campgroundCoord = [campground.longitude, campground.latitude];
                        addCampgroundMarkers(centerLayers(campgroundCoord));
                    });

                    var trails = $stateParams.trails || JSON.parse(sessionStorage.getItem('TsandCs')).trails;
                    trails.forEach( function markAndPlottrails(trail){
                        var trailCoordinates = [];
                        var trailheadCoord = ([ Number(trail.head_lon), Number(trail.head_lat) ]);
                        addTrailheadMarkers(centerLayers(trailheadCoord));
                        trail.line.forEach(function plotTrail(trailNode){
                            var transformTrailNode = ol.proj.fromLonLat([ Number(trailNode.lon), Number(trailNode.lat) ]);
                            trailCoordinates.push(transformTrailNode);
                            //console.log(trailCoordinates);
                        });
                        createTrailLayers(trailCoordinates);
                    });
                    window.clearInterval(waitForMarkerData);
                    buildMap(buildBaseLayer(), buildMarker(campgroundMarkers), buildMarker(trailheadMarkers), buildMarker(trailLineLayers));
                }
            }

            var waitForMarkerData = window.setInterval(findCampgroundsAndTrails,100);
            $('nav').addClass('tandc');

            $scope.$watch('popupelm', function(){
                if ($scope.popupelm === '') {
                    return;
                } else {
                    var tORcObj = JSON.parse($scope.popupelm);
                    var trailCoordinates = ol.proj.fromLonLat([tORcObj.longitude, tORcObj.latitude]);
                    $('.popup-content').html(
                        '<p>' + tORcObj.name + '<p>' +
                        '<p>Length: ' + Math.round((Number(tORcObj.length)*100)/100) + '<p>'
                    );
                    popupOverlay.setPosition(trailCoordinates);
                }
            });
        }

        /**
         * Configs base Map layer with tiles sourced from MapBox
         * @return {Object} Vector layer used for map tileing
         */
        function buildBaseLayer() {
            var baseLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmdhbGFudG93aWN6IiwiYSI6ImNpd3dsNmhyZjAxNWUydHFyNnhjbzZwc3QifQ._xkfHwZJ1FsueAu0K6oQeg'
                })
            });
            return baseLayer;
        }

        /**
         * Builds rectangle layer for user select-radius functionality
         * @param {Object} icons OpenLayers Feature used to build map vector layer
         * @return {Object} rectangle vector layer compatible with map
         */
        function buildMarker(icons) {
            var vectorArray = [];
            icons.forEach(function buildVector(icon) {
                //console.log(icon);
                var vectorSource = new ol.source.Vector({
                    features: [icon]
                });
                var vector = new ol.layer.Vector({
                    source: vectorSource,
                    zIndex: setZIndex(icon)
                    });

            vectorArray.push(vector);
            });
            return vectorArray;
        }

        /**
         * sets Zindex for map layers based off marker type
         * @param {Object} icon OpenLayers Feature used to build map vector layer
         */
        function setZIndex(icon) {
            if (icon.H.name === 'Trailhead' || icon.H.name === 'Camping') {
                return 2;
            } else {
                return 0;
            }
        }

        /**
         * creates campground markers as open layer feautures
         * @param {coordinates} coordinates geo coordinates for placement of
         * markers on map
         */
        function addCampgroundMarkers(coordinates) {
           var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: 'Camping'
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'images/tent-icon.png',
                    scale: 0.075
                })
            });

            iconFeature.setStyle(iconStyle);
            campgroundMarkers.push(iconFeature);
        }

        /**
         * creates trailhead markers as open layer feautures
         * @param {coordinates} coordinates geo coordinates for placement of
         * markers on map
         */
        function addTrailheadMarkers(coordinates) {
           var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinates),
                name: 'Trailhead'
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'images/trailhead.png',
                    scale: 0.175
                }),
            });

            iconFeature.setStyle(iconStyle);
            trailheadMarkers.push(iconFeature);
        }

        /**
         * creates trail markers as open layer line feautures
         * @param {trails} trails array of geo coordinates for placement of
         * trails on map
         */
        function createTrailLayers(trails) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.LineString(trails),
                name: 'Trail'
            });

            var iconStyle = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [255, 255, 0, 0.6],
                  width: 12.5
              })
            });

            iconFeature.setStyle(iconStyle);
            trailLineLayers.push(iconFeature);
        }

        /**
         * creates center point for map on page load
         * @param {coordinates} coordinates geo coordinates for placement of
         * center on map
         */
        function centerLayers(coordinates) {
            if (!coordinates) {
                return;
            } else if (coordinates.length === 2) {
                var transformCoordOne = ol.proj.fromLonLat([ coordinates[0], coordinates[1]]);
                var transformCoordTwo = ol.proj.fromLonLat([( coordinates[0] + 0.005), ( coordinates[1] + 0.005 )]);
                var markCoordinates = transformCoordOne.concat(transformCoordTwo);
                return markCoordinates;
            }
            var coordArray = coordinates;
            var eastWest = (coordArray[0]-((coordArray[0]-coordArray[2])/2));
            var northSouth = (coordArray[1]-((coordArray[1]-coordArray[3])/2));
            var center = [ eastWest, northSouth ];

            return center;
        }
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .filter('class', ClassFilter);

    function ClassFilter() {

        return function classFilter(trail) {
            if (trail.name === null) {
                return;
            }
            var className = trail.name.split(' ');
            className = className.join('-');
            return className;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .filter('length', LengthFilter);

    function LengthFilter() {

        return function length(trails) {
            var trailSort = trails.sort(function sortLength(a, b) {
                if (a.length > b.length) {
                    return -1;
                } else {
                    return 1;
                }
            });
            return trailSort;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('TrailandCampgroundService', TrailandCampgroundService);

    TrailandCampgroundService.$inject = [ '$http' ];

    /**
     * Constructs angular service for trail and campground http requests
     * @param {Service} $http core angular service for http requests
     */
    function TrailandCampgroundService($http){

        return {
            findTsandCs: findTsandCs
        };
        /**
         * executes http request to app backend for trail and campground data
         * @param  {Array} coordinates location data based off radius rectangle
         * @return {Promise} angular promise functions            [description]
         */
        function findTsandCs(coordinates){
            var west = coordinates[0];
            var south = coordinates[1];
            var east = coordinates[2];
            var north = coordinates[3];

            return $http({
                url: '/trails',
                params: {
                    north: north,
                    south: south,
                    west: west,
                    east: east,
                    limit: 10,
                    min_length: 0.2,
                    max_length: 2,
                }
            })
            .then( function transformResponse(response) {
                var trails = response.data.trails;
                var campgrounds = response.data.campgrounds;
                return { trails: trails, campgrounds: campgrounds};
            });
        }

    }

}());

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

(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http', '$state' ];

    function UserService($http) {

        return {
            createUser: createUser,
            signinUser: signinUser
        };

        function createUser(user) {
            return $http({
                url: '/users',
                method: 'POST',
                data: {
                    user: {
                        first_name: user.firstname,
                        last_name: user.lastname,
                        email: user.email,
                        password: user.password,
                        password_confirmation: user.passwordConf
                    }
                }
            })
            .then(function success(response) {
                window.sessionStorage.setItem('userToken', angular.toJson(response.data.token));
                return response.data;
            });
        }

        function signinUser(user) {
            return $http({
                url: '/session',
                method: 'POST',
                data: {
                    email: user.username,
                    password: user.password,
                }
            })
            .then(function success(response) {
                window.sessionStorage.setItem('userToken', angular.toJson(response.data.token));
                return response.data;
            });
        }
    }
}());
