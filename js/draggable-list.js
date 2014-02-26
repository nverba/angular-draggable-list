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
          e.dataTransfer.setData('from_index', scope.$parent.$index);
          dragData.elem = e.target.parentNode || e.srcElement.parentNode;

        });

        elem.bind('dragenter', function (e) {
        });

        elem.bind('dragover', function (e) {
          // prevent draggable from interacting with other draggable lists
          if ((e.target.parentNode || e.srcElement.parentNode) === dragData.elem) {

            e.preventDefault();

            scope.$apply(function () {
              scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(e.dataTransfer.getData('from_index'), 1)[0]);
            });
          }
        });

        elem.bind('dragleave', function (e) {
        });

        elem.bind('drop', function (e) {
          e.preventDefault();
          scope.$apply(function () {
            scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(e.dataTransfer.getData('from_index'), 1)[0]);
          });
        });

        elem.bind('dragend', function (e) {
          dragData = {};
        });
      }
    };
  });
