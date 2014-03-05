'use strict';

angular.module('draggableList', [])
  .directive('draggableList', function () {

    function isDropTarget(e) {
      return (e.target || e.srcElement).parentElement === dragData.elem.parentElement;
    }

    function list(scope) {

      var methods = {
        reset: function () {
          angular.copy(dragData.origin, scope.draggableList);
          return methods;
        },
        update: function () {
          scope.$apply(function () {
            scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
          });
        }
      };
      return methods;
    }

    var dragData = {};
    return {
      restrict: 'A',
      scope: {
        draggableList: '=',
      },
      link: function (scope, elem, attrs) {

        elem.bind('dragstart', function (e) {
          // Firefox needs this to be enable HTML5 draggable, set to Text for ie compatability
          e.dataTransfer.setData('Text', 'Firefox wont drag without this???');
          dragData.from_index = scope.$parent.$index;
          dragData.elem = e.target || e.srcElement;
          dragData.origin = angular.copy(scope.draggableList); // clone the original array - used to reset scope later
        });

        elem.bind('dragenter', function (e) {
          if (isDropTarget(e)) { list(scope).reset().update(); }
        });

        elem.bind('dragover', function (e) {
          e.preventDefault();
        });

        elem.bind('dragleave', function (e) {
          // place holder
        });

        elem.bind('drop', function (e) {
          e.preventDefault(); // important! stop firefox redirecting
          if (isDropTarget(e)) { list(scope).reset().update(); }
        });

        elem.bind('dragend', function (e) {
          dragData = {};
        });
      }
    };
  });
