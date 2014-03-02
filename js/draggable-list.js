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
          e.dataTransfer.setData('text/plain', 'Firefox wont drag without this???');
          dragData.from_index = scope.$parent.$index;
          dragData.elem = e.target || e.srcElement;
          dragData.origin = angular.copy(scope.draggableList); // clone the original array - used to reset scope later
        });

        elem.bind('dragenter', function (e) {
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) { // contain events to list origin
            if ((e.target || e.srcElement) !== dragData.elem) { // reduces flickering
              e.preventDefault();

              scope.$apply(function () {
                scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
              });
            }
          }
        });

        elem.bind('dragover', function (e) {
          e.preventDefault();
        });

        elem.bind('dragleave', function (e) {
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) {
            angular.copy(dragData.origin, scope.draggableList);
          }
        });

        elem.bind('drop', function (e) {
          e.preventDefault(); // important! stop firefox redirecting
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) {
            scope.$apply(function () {
              scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
            });
          }
        });

        elem.bind('dragend', function (e) {
          dragData = {};
        });
      }
    };
  });
