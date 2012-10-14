/**
 * Created with PyCharm.
 * User: Edilio
 * Date: 10/14/12
 * Time: 10:46 AM
 * To change this template use File | Settings | File Templates.
 */
var app = angular.module('uitest', []).
    config(function($routeProvider) {
        $routeProvider.
            when('/home', {template:'index.html'}).
            otherwise({redirectTo:'/home'});
    });


function ctrl($scope,  $http) {

    $scope.stories = [];

    $http.get('../js/uidevtest-data.js').success(function(data){
        $scope.stories = data.objects;
    });


}

