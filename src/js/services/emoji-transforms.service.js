angular.module('ngEmojiPicker').factory('ngEmojiTransforms', [
    'EmojiRegexp', 'Emoji', 'EmojiHex', function (EmojiRegexp, Emoji, EmojiHex) {
        var transforms = {
            hexify: hexify,
            imagify: imagify,
            unicodify: unicodify,
            emojify: emojify,
            aliasify: aliasify,
            unicodeToImage: unicodeToImage
        };

        var swappedHex = getSwappedHex();
        var regex = new RegExp(':(' + Object.keys(swappedHex).join('|') + '):', 'g');
        var regexHex = new RegExp('(' + _getObjectValues(swappedHex).join('|') + ')', 'g');
        var emojiRegexp = EmojiRegexp;
        
        function getSwappedHex() {
            var swappedHex = {};

            angular.forEach(Emoji, function (group) {
                angular.forEach(group.emoji, function (emoji) {
                    var alias = emoji.short_name.replace(/\+/g, '\\+');
                    swappedHex[alias] = emoji.hex;
                })
            });

            return swappedHex;
        }

        function _getObjectValues(object) {
            return Object.keys(object).map(function(key) {
                return object[key];
            }).reverse();
        }

        function hexify(text) {
            if (!text) return '';

            var emojiRegex = /\:([a-z0-9_+-]+)(?:\[((?:[^\]]|\][^:])*\]?)\])?\:/g;
            var matches = text.match(emojiRegex);
            if (matches === null) return text;
            for (var i = 0; i < matches.length; i++) {
                var emojiString = matches[i];
                var property = emojiString.replace(/\:/g, '');
                if (swappedHex.hasOwnProperty(property)) {
                    text = text.replace(emojiString, swappedHex[property]);
                }
            }
            return text;
        }

        function imagify(input) {
            if (!input) return '';

            return input.replace(regex, function (match, text) {
                var className = text.replace(/_/g, '-');
                var output = [
                    '<i contenteditable="false" class="cm-emoji-picker cm-emoji-',
                    className,
                    '" alt="', text, '" title=":', text, ':">&zwnj;</i>'
                ];
                return output.join('');
            });
        }

        function unicodify(text) {
            if (!text) return '';

            var matches = text.match(regexHex);
            if (matches === null) return text;

            for (var i = 0, len = matches.length; i < len; i++) {
                var hexString = matches[i];
                var unicode;
                if (hexString.indexOf('-') > -1) {
                    var codePoints = hexString.split('-');
                    unicode = eval('String.fromCodePoint(0x' + codePoints.join(', 0x') + ')');
                } else {
                    var codePoint = ['0x', hexString].join('');
                    unicode = String.fromCodePoint(codePoint);
                }

                text = text.replace(hexString, unicode);
            }

            return text;
        }

        function aliasify(text) {
            if (!text) return '';

            return text.replace(emojiRegexp, function (match) {
                var hex = null;
                Object.keys(EmojiHex).forEach(function (key) {
                   if (match == EmojiHex[key]) {
                       hex = key;
                       return;
                   }
                });

                var result = null;
                if (hex) {
                    angular.forEach(swappedHex, function (value, key) {
                        if (value.toLowerCase() === hex.toLowerCase()) {
                            result = ':' + key + ':';
                            return;
                        }
                    });
                }

                return (result) ? result : match;
            });
        }

        function unicodeToImage(text) {
            return imagify(aliasify(text));
        }

        function emojify(input) {
            return unicodify(hexify(input));
        }

        return transforms;
    }
]);
