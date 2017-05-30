angular.module('ngEmojiPicker').filter('unicodify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.unicodify;
  }
]);
