### An AngularJS directive for draggable, sortable lists using the HTML5 drag and drop and touch APIs.

This directive has no dependencies other than AngularJS. The aim is to make this as backwards compatable as possible, whilst only using native APIs and raw Javascript/Angular. It is still under development, so use at your own risk.

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
