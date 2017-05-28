angular.module('ngEmojiPicker').filter('aliasify', [
    'vkEmojiTransforms', function (vkEmojiTransforms) {
        return vkEmojiTransforms.aliasify;
    }
]);
