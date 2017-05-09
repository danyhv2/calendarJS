import angular from 'angular';
import moment from 'moment';
import './node_modules/font-awesome/css/font-awesome.css';
import './css/style.css';
import template from './directive/calendar.tpl.html'


var app = angular.module("app", []);

  app.service('holidayService', ['$http', function($http){
    this.get = function (month, year, country) {
        return $http({
            method: 'get',
            url:    'https://holidayapi.com/v1/holidays?key=bac3b42f-ff7d-44ad-8334-4445a9029d54&country='+country+'&year='+year+'&month='+month,
            cache:  true
        });
      };

    }
  ]);


  app.controller('calendarCtrl', ['$scope', 'holidayService', function ($scope, holidayService) {
  
    $scope.getDate = function () {
      $scope.date = $scope.start;
      $scope.days = $scope.amount;
      $scope.day = moment($scope.date);
      $scope.show = true;

      holidayService.get(($scope.day.month()+1), $scope.day.year(), $scope.country).then(function(response){
        console.log('data',response);
      }, function(error){
      	//handle error response
      });
    }

  }
]);


app.directive("calendar", ['$interval', function($interval) {
  return {
    restrict: "E",
    templateUrl: template,
    scope: {
      selected: "=",
      date: '=',
      days: '='
    },
    controller: 'calendarCtrl',
    controllerAs: 'calendar',
    link: function(scope, element, attrs, controller) {

      scope.$watchGroup(['date', 'days'], function(newValues, oldValues) {
        scope.start = moment(newValues[0]);
        scope.days = newValues[1];
        scope.month = scope.start.clone();
        scope.start.date(2);
      
        _removeTime(scope.start.day(0));
        //set the amount of days
        scope.end = moment(scope.start._i).add(scope.days, 'd');
        _buildMonth(scope, scope.start, scope.end);
        
        });

      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month() + 1).date(1));
        scope.month.month(scope.month.month() + 1);
        _buildMonth(scope, next, scope.month);
      };

      scope.previous = function() {
        var previous = scope.month.clone();
        _removeTime(previous.month(previous.month() - 1).date(1));
        scope.month.month(scope.month.month() - 1);
        _buildMonth(scope, previous, scope.month);
      };
    }
  };

  function _removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  function _buildMonth(scope, start, month) {
    scope.weeks = [];
    var done = false,
      date = start.clone(),
      monthIndex = date.month(),
      count = 0;
    while (!done) {
      scope.weeks.push({
        days: _buildWeek(scope, date.clone(), month),
        position: count
      });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  function _buildWeek(scope, date, month) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date,
        valid: (scope.end >= date && !(date < scope.month._i))
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
}]);


