angular.module('ngEmojiPicker').filter('emojify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.emojify;
  }
]);
