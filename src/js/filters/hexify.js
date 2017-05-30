angular.module('ngEmojiPicker').filter('hexify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.hexify;
  }
]);
