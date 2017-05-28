angular.module('ngEmojiPicker').filter('hexify', [
  'vkEmojiTransforms', function (vkEmojiTransforms) {
    return vkEmojiTransforms.hexify;
  }
]);
