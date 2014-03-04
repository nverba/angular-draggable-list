'use strict';

angular.module('draggableList', [])
  .directive('draggableList', function () {
    var dragged = document.createElement('span'),
        draggable = 'draggable' in dragged,
        dragData = {};

        if (!draggable) {
          // manage drag text for fallback ie-9 support
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

        function handleDragstart(e, scope, elem){
          elem.addClass('adl-dragstart');
          dragData.from_index = scope.$parent.$index;
          dragData.elem = e.target || e.srcElement;
          dragData.origin = angular.copy(scope.draggableList); // clone the original array - used to reset scope later
        }

        function handleDragenter(e, scope) {
          e.preventDefault();
          if (isDropTarget(e)) { list(scope).reset().update(); }
        }

        function handleDragLeave(e) {
          //placeholder
        }

        function handleDrop (e, scope) {
          if (isDropTarget(e)) { list(scope).reset().update(); }
        }

        function handleEnd(elem) {
          elem.removeClass('adl-dragstart');
          dragData = {};
        }

    return {
      restrict: 'A',
      scope: {
        draggableList: '=',
      },
      link: function (scope, elem, attrs) {

        if (draggable) {

          elem.bind('dragstart', function (e) {
            e.dataTransfer.setData('Text', 'Firefox wont drag without this???'); // Firefox needs this to be enable HTML5 draggable, det to Text for ie compatability
            handleDragstart(e, scope, elem)
          });

          elem.bind('dragenter', function (e) {
            handleDragenter(e, scope);
          });

          elem.bind('dragover', function (e) {
            e.preventDefault();
          });

          elem.bind('dragleave', function (e) {
            // handleDragLeave(e);
          });

          elem.bind('drop', function (e) {
            e.preventDefault(); // important! stop firefox redirecting
            handleDrop(e, scope);
          });

          elem.bind('dragend', function (e) {
            handleEnd(elem);
          });

        } else { // if (!draggable) -- fallback support for browsers that don't support HTML5 drag & drop API

          elem.bind('mousedown', function(e) {
            e.preventDefault();
            handleDragstart(e, scope, elem)
            dragged.style.display = 'inline';
            dragged.innerHTML = elem.html();
          });

          elem.bind('mouseenter', function(e) {
            if (dragData.elem) {
              dragData.target = e;
              handleDragenter(e, scope);
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
              handleDrop(dragData.target, scope);
            }
            handleEnd(elem);
          });
        }
      }
    };
  });
