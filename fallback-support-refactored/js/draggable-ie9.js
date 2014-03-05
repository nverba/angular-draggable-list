'use strict';

var dragged    = document.createElement('span'),
    draggable  = 'draggable' in dragged;

if (!draggable) {

  var dragData   = {},
      dragstart  = new CustomEvent("dragstart"),
      dragenter  = new CustomEvent("dragenter"),
      dragover   = new CustomEvent("dragover"),
      dragleave  = new CustomEvent("dragleave"),
      drop       = new CustomEvent("drop"),
      dragend    = new CustomEvent("dragend"),
      element;

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
      if (dragData.target) {
        element.dispatchEvent(drop);
      }
      element.dispatchEvent(dragend);
      dragData = {};
    });
  }

  setTimeout(function() {

    var draggables = getElementsByAttribute('draggable');

    for (var i = 0; i < draggables.length; i++) {
      addCustomEvents(draggables[i]);
    }

  }, 100);
}
