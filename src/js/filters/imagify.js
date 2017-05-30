angular.module('ngEmojiPicker').filter('imagify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.imagify;
  }
]);
