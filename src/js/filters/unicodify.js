angular.module('ngEmojiPicker').filter('unicodify', [
  'vkEmojiTransforms', function (vkEmojiTransforms) {
    return vkEmojiTransforms.unicodify;
  }
]);
