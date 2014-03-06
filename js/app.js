app = angular.module('DraggableListDemo', ['ngAnimate', 'draggableList'])
  .controller('Ctrl', function($scope) {

    $scope.array = [
      "Array item #1",
      "Array item #2",
      "Array item #3",
      "Array item #4",
      "Array item #5",
      "Array item #6",
    ];

  });
