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

    var getMiddle = function (text){
        var found = false,
            len = text.length,
            i = Math.floor(len / 2);

        while ((!found) && (i > 0)){
            //<p>
            found = (text.substring(i,i+4) === "</p>");
            if (!found){
                i -= 1;
            }
        }
        return i;
    };

    var insertProperties = function (storyList){
        var injectProperties = function (item) {
            var story = item["story"],
                middle = getMiddle(story);
            item["index"] = 'sto0' + (storyList.indexOf(item)+1).toString(10);
            item["leftColumn"] = story.substring(0,middle);
            item["rightColumn"] = story.substring(middle, story.length);
            return item;
        };

        return storyList.map(injectProperties);
    };

    return {
        currentStory : {},
        stories : stories,
        getStoryByIndex : function(index){
            var i = parseInt(index[index.length-1]) - 1;
            return stories[i];
        },
        insertProperties : insertProperties,
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

    if ((search === undefined) || (search === "")){
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
        ui_data.currentStory = story;
    };

    if ($scope.stories.length === 0){
        $http.get('../js/uidevtest-data.js').success(function(data){
            $scope.stories = ui_data.insertProperties(data.objects);
            ui_data.setStories($scope.stories);

            $scope.currentStory = ui_data.getStoryByIndex(search);
            $('#currentStory').html($scope.currentStory.story);
            $('#leftColumn').html($scope.currentStory.leftColumn);
            $('#rightColumn').html($scope.currentStory.rightColumn);
        });
    }
}

