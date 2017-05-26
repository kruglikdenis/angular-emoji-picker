angular.module('vkEmojiPicker').filter('aliasify', [
    'vkEmojiTransforms', function (vkEmojiTransforms) {
        return vkEmojiTransforms.aliasify;
    }
]);
