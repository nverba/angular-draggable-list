'use strict';

// angular-draggable-list
// ----------------------
// Copyright © 2014 Michael Murray | MIT license | https://github.com/nverba/angular-draggable-list

angular.module('draggableList', [])
  .directive('draggableList', function () {

    var isTouchDevice = !!('ontouchstart' in window),
        dragData = {};

    function isDropTarget(element) {
      return element.parentElement === dragData.elem.parentElement;
    }

    function isNewTarget(scope) {
      return dragData.from_index !== scope.$parent.$index;
    }

    function isTouchTarget(element) {
      return element !== dragData.elem;
    }

    function update(scope, newIndex) {
      scope.$apply(function () {
        scope.draggableList.splice(newIndex, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
        dragData.from_index = newIndex;
      });
    }

    function getElement(e) {
      return document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    }

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
        });

        elem.bind('dragenter', function (e) {
          if (isDropTarget(e.target || e.srcElement) && isNewTarget(scope)) { update(scope, scope.$parent.$index); }
        });

        elem.bind('dragover', function (e) {
          e.preventDefault();
        });

        elem.bind('dragleave', function (e) {
          // place holder
        });

        elem.bind('drop', function (e) {
          e.preventDefault(); // important! stop firefox redirecting
        });

        elem.bind('dragend', function (e) {
          dragData = {};
        });

        if (isTouchDevice) {

          elem.bind('touchstart', function (e) {
            dragData.from_index = scope.$parent.$index;
            dragData.elem = e.target || e.srcElement;
          });

          elem.bind('touchmove', function (e) {
            e.preventDefault();

            var element = getElement(e),
                newIndex;

            if (isTouchTarget(element) && isDropTarget(element)) {
              newIndex = Array.prototype.indexOf.call(element.parentElement.children, element);
              update(scope, newIndex);
              dragData.elem = element;
            }
          });

          elem.bind('touchend', function (e) {
            dragData = {};
          });
        }
      }
    };
  });
