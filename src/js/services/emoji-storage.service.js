angular.module('ngEmojiPicker').factory('ngEmojiStorage', [
    '$window', 'ngEmojiLocalStorage', function ($window, emojiStorage) {
        var factory = {};
        var storage = $window.localStorage || emojiStorage;

        factory.store = function (value) {
            var emojiString = storage.getItem('emojiPicker');

            if (emojiString == null) {
                var emojiArray = [];
            } else {
                var emojiArray = JSON.parse(emojiString);
                var emojiIndex = emojiArray.findIndex(function(emoji) {
                    return emoji.name === value.name;
                });

                if (emojiIndex >= 0) {
                    emojiArray.splice(emojiIndex, 1);
                }
            }

            emojiArray.unshift(value);
            storage.setItem('emojiPicker', JSON.stringify(emojiArray));
        };

        factory.getFirst = function (count) {
            var count = count || 1;
            var emojiString = storage.getItem('emojiPicker');

            if (emojiString == null) {
                return [];
            }

            var emojiArray = JSON.parse(emojiString);

            return emojiArray.slice(0, count);
        };

        factory.clear = function () {
            storage.clear();
        };

        return factory;
    }
]);
