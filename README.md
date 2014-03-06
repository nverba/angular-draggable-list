### An alpha implementation of a draggable lists directive for AngularJS using the HTML5 Drag and Drop API.

This is currently early in development, it has been tested in most modern browsers and works in IE10, there is also a shim for IE9, but use with caution.
I intend to develop a number of pluggable themes with css animations and effects to make things a bit nicer.

### Basic usage (no CSS)

Include the `draggableList` module as a dependency.

```
app = angular.module('DemoApp', ['draggableList']);
```

Pass the named scope to the `draggable-list` attribute, and set the element's `draggable` attribute to `true`.

```
<ul>
  <li ng-repeat="item in array" draggable-list="array" draggable="true">{{ item }}</li>
</ul>
```

### IE9 support

I've made a shim for IE9 support, it partially pollyfills the HTML5 drag & drop API by creating and dispatching the draggable events, __so watch out for other libraries that use this API or otherwise detect it as a feature__.

```
<!--[if IE 9]>
  <script src="js/draggable-list-ie9-shim.js"></script>
<![endif]-->
```
