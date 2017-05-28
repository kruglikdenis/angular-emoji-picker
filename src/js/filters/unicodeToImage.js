angular.module('ngEmojiPicker').filter('unicodeToImage', [
    'vkEmojiTransforms', function (vkEmojiTransforms) {
        return vkEmojiTransforms.unicodeToImage;
    }
]);

