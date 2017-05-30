angular.module('ngEmojiPicker').filter('unicodeToImage', [
    'ngEmojiTransforms', function (ngEmojiTransforms) {
        return ngEmojiTransforms.unicodeToImage;
    }
]);

