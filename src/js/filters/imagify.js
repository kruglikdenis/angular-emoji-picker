angular.module('ngEmojiPicker').filter('imagify', [
  'vkEmojiTransforms', function (vkEmojiTransforms) {
    return vkEmojiTransforms.imagify;
  }
]);
