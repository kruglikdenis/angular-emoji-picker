angular.module('vkEmojiPicker').filter('unicodeToImage', [
    'vkEmojiTransforms', function (vkEmojiTransforms) {
        return vkEmojiTransforms.unicodeToImage;
    }
]);

