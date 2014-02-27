'use strict';

angular.module('draggableList', [])
  .directive('draggableList', function () {
    var dragData = {};
    return {
      restrict: 'A',
      scope: {
        draggableList: '=',
      },
      link: function (scope, elem, attrs) {

        elem.bind('dragstart', function (e) {
          dragData.from_index = scope.$parent.$index;
          dragData.elem = e.target || e.srcElement;
          // clone the original array - used to reset scope later
          dragData.origin = angular.copy(scope.draggableList);
        });

        elem.bind('dragenter', function (e) {
          if ((e.target || e.srcElement) !== dragData.elem) { // reduces flickering

            scope.$apply(function () {
              scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
            });
          }
        });

        elem.bind('dragover', function (e) {
          // only prevent default on siblings - stops interaction between separate lists
          if ((e.target.parentNode || e.srcElement.parentNode) === dragData.elem.parentNode) { e.preventDefault(); }
        });

        elem.bind('dragleave', function (e) {
          // reset scope to origin after every leave event
          angular.copy(dragData.origin, scope.draggableList);
        });

        elem.bind('drop', function (e) {
          e.preventDefault();
          scope.$apply(function () {
            scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
          });
        });

        elem.bind('dragend', function (e) {
          dragData = {};
        });
      }
    };
  });
