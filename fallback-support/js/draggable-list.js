'use strict';

angular.module('draggableList', [])
  .directive('draggableList', function () {
    var dragged = document.createElement('span'),
        draggable = 'draggable' in dragged,
        dragData = {};

        if (!draggable) {
          // this holds hover text for fallback
          dragged.style.position = 'absolute';
          dragged.style.display = 'none';
          document.body.appendChild(dragged);

          window.onmousemove = function (e) {
            e.preventDefault();
            var x = e.clientX,
                y = e.clientY;
            dragged.style.left = x + 10 + 'px';
            dragged.style.top = (document.getElementsByTagName("html")[0].scrollTop + y - 10) + 'px';
          };
        }

    return {
      restrict: 'A',
      scope: {
        draggableList: '=',
      },
      link: function (scope, elem, attrs) {

        function handleDragstart(e){
          elem.addClass('adl-dragstart');
          dragData.from_index = scope.$parent.$index;
          dragData.elem = e.target || e.srcElement;
          dragData.origin = angular.copy(scope.draggableList); // clone the original array - used to reset scope later
        }

        function handleDragenter(e) {
          e.preventDefault();
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) { // contain events to list origin
            if ((e.target || e.srcElement) !== dragData.elem) { // reduces flickering
              scope.$apply(function () {
                scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
              });
            }
          }
        }

        function handleDragLeave(e) {
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) {
            angular.copy(dragData.origin, scope.draggableList); //reset array
          }
        }

        function handleDrop (e) {
          e.preventDefault(); // important! stop firefox redirecting
          if ((e.target || e.srcElement).parentElement === dragData.elem.parentElement) {
            scope.$apply(function () {
              scope.draggableList.splice(scope.$parent.$index, 0, scope.draggableList.splice(dragData.from_index, 1)[0]);
            });
          }
        }

        function handleEnd(e) {
          elem.removeClass('adl-dragstart');
          dragData = {};
        }

        if (draggable) {

          elem.bind('dragstart', function (e) {
            e.dataTransfer.setData('Text', 'Firefox wont drag without this???');
            handleDragstart(e)
          });

          elem.bind('dragenter', function (e) {
            handleDragenter(e);
          });

          elem.bind('dragover', function (e) {
            e.preventDefault();
          });

          elem.bind('dragleave', function (e) {
            handleDragLeave(e);
          });

          elem.bind('drop', function (e) {
            handleDrop(e);
          });

          elem.bind('dragend', function (e) {
            handleEnd(e);
          });

        } else { // if (!draggable) -- fallback support for browsers that don't support HTML5 drag & drop API

          elem.bind('mousedown', function(e) {
            e.preventDefault();
            handleDragstart(e)
            dragged.style.display = 'inline';
            dragged.innerHTML = elem.html();
          });

          elem.bind('mouseenter', function(e) {
            if (dragData.elem) {
              dragData.target = e;
              handleDragenter(e);
            }
          });

          elem.bind('mouseout', function(e) {
            if (dragData.elem) {
              dragData.target = false;
              handleDragLeave(e);
            }
          });

          elem.bind('mouseup', function(e) {
            dragged.style.display = 'none';
            if (dragData.target) {
              handleDrop(dragData.target);
            }
            handleEnd(e);
          });
        }
      }
    };
  });
