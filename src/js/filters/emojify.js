angular.module('ngEmojiPicker').filter('emojify', [
  'vkEmojiTransforms', function (vkEmojiTransforms) {
    return vkEmojiTransforms.emojify;
  }
]);
