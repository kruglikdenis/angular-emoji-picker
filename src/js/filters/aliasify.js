angular.module('ngEmojiPicker').filter('aliasify', [
    'ngEmojiTransforms', function (ngEmojiTransforms) {
        return ngEmojiTransforms.aliasify;
    }
]);
