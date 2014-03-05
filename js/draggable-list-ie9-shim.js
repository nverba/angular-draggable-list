'use strict';

/*
This shim partially pollyfills the HTML5 drag & drop API in IE9,
to work with the angular-draggable-list directive,

include it conditionally for IE9 only...

<!--[if IE 9]>
  <script src="js/draggable-list-ie9-shim.js"></script>
<![endif]-->

Copyright © 2014 Michael Murray | MIT license | https://github.com/nverba/angular-draggable-list
 */



var dragged    = document.createElement('span'),
    draggable  = 'draggable' in dragged;

if (!draggable) {

  // MDN CustomEvent constructor pollyfill
  if (typeof CustomEvent !== 'function') {
    (function () {
      function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
       }
      CustomEvent.prototype = window.CustomEvent.prototype;
      window.CustomEvent = CustomEvent;
    })();
  }

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

  var dragData   = {},
      dragstart  = new CustomEvent("dragstart"),
      dragenter  = new CustomEvent("dragenter"),
      dragover   = new CustomEvent("dragover"),
      dragleave  = new CustomEvent("dragleave"),
      drop       = new CustomEvent("drop"),
      dragend    = new CustomEvent("dragend"),
      element;

  var extendDataTransfer = {
    setData: function (type, string) {
      dragData[type] = string;
    },
    getData: function (type) {
      return dragData[type];
    }
  }

  dragstart.dataTransfer = extendDataTransfer;
  drop.dataTransfer = extendDataTransfer;

  function getElementsByAttribute(attribute) {
    var elements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
      if (allElements[i].getAttribute(attribute)) {
        elements.push(allElements[i]);
      }
    }
    return elements;
  }

  function addCustomEvents(element) {

    element.addEventListener('mousedown', function(e) {
      e.preventDefault();
      dragData.origin = (e.target || e.srcElement); // Refactor after testing
      element.dispatchEvent(dragstart);
      dragged.innerHTML = element.innerHTML;
      dragged.style.display = 'inline';
    });

    element.addEventListener('mouseover', function(e) {
      if (dragData.origin) {
        dragData.target = e;
        element.dispatchEvent(dragenter);
      }
    });

    element.addEventListener('mouseout', function(e) {
      if (dragData.origin) {
        dragData.target = false;
        element.dispatchEvent(dragleave);
      }
    });

    element.addEventListener('mouseup', function(e) {
      dragged.style.display = 'none';
      if (dragData.target) {
        element.dispatchEvent(drop);
      }
      element.dispatchEvent(dragend);
      dragData = {};
    });
  }

  angular.element(window).bind('load', function() {

    var draggables = getElementsByAttribute('draggable');

    for (var i = 0; i < draggables.length; i++) {
      addCustomEvents(draggables[i]);
    }

  });
}
