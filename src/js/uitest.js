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


app.factory('ui_data', ['$http',function($http) {
    var stories = [];

    var insertIndex = function (storyList){
        var injectIndex = function (item) {
            item["index"] = 'sto0' + (storyList.indexOf(item)+1).toString(10);
            return item;
        };

        return storyList.map(injectIndex);
    };

    return {
        currentStory : {},
        stories : stories,
        getStoryByIndex : function(index){
            var i = parseInt(index[index.length-1]) - 1;
            return stories[i];
        },
        insertIndex : insertIndex,
        setStories : function (scopeStories){
            stories = scopeStories;
        }
    };
}]);



function ctrl($scope,  $http, ui_data) {

    $scope.currentStory = ui_data.currentStory;

    $scope.stories = ui_data.stories;

    $scope.formatDate = function(value){
        var d = new Date(value);
        return d.toString('hh:mm tt dddd, MMM. d, yyyy');
    };

    var search = window.location.search;

    if ((search === undefined) ||(search === "")){
        $scope.showList = true;
        $scope.currentStory = undefined;
    }
    else{
        $scope.showList = false;
        $scope.storyIndex = parseInt(search[search.length-1]) - 1;
        $scope.currentStory = $scope.stories[$scope.storyIndex];
    }

    $scope.showDetail = function (story){
        $scope.showList = false;
        $scope.currentStory = story;
        data.currentStory = story;
    };

    if ($scope.stories.length === 0)
        $http.get('../js/uidevtest-data.js').success(function(data){
            $scope.stories = ui_data.insertIndex(data.objects);
            ui_data.setStories($scope.stories);

            $scope.currentStory = ui_data.getStoryByIndex(search);
            $('#currentStory').html($scope.currentStory.story);
        });
}

