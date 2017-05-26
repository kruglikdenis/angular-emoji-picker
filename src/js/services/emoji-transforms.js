angular.module('vkEmojiPicker').factory('vkEmojiTransforms', [
  'EmojiHex', 'EmojiGroups', 'EmojiRegexp', function (EmojiHex, EmojiGroups, EmojiRegexp) {
    var transforms = {
      hexify: hexify,
      imagify: imagify,
      unicodify: unicodify,
      emojify: emojify,
      aliasify: aliasify,
      unicodeToImage: unicodeToImage
    };

    var regex = new RegExp(':(' + EmojiGroups.all.join('|') + '):', 'g');
    var regexHex = new RegExp('(' + getUnicodes().join('|') + ')', 'g');
    var emojiRegexp = EmojiRegexp;

    function getUnicodes() {
      var swappedHex = {};
      var unicodes = [];

      angular.forEach(EmojiHex.emoji, function (value, key) {
        swappedHex[value] = key;
        unicodes.push(value);
      });

      return unicodes.reverse();
    }

    function hexify(text) {
      if (text == null) {
        return '';
      }

      var emojiRegex = /\:([a-z0-9_+-]+)(?:\[((?:[^\]]|\][^:])*\]?)\])?\:/g;
      var matches = text.match(emojiRegex);

      if (matches === null) {
        return text;
      }

      for (var i = 0; i < matches.length; i++) {
        var emojiString = matches[i];
        var property = emojiString.replace(/\:/g, '');

        if (EmojiHex.emoji.hasOwnProperty(property)) {
          text = text.replace(emojiString, EmojiHex.emoji[property]);
        }
      }

      return text;
    }

    function imagify(input) {
      if (input == null) {
        return '';
      }

      return input.replace(regex, function (match, text) {
        var className = text.replace(/_/g, '-');
        var output = ['<i contenteditable="false" class="cm-emoji-picker cm-emoji-', className, '" alt="', text, '" title=":', text, ':">&zwnj;</i>'];

        return output.join('');
      });
    }

    function unicodify(text) {
        if (text == null) {
            return '';
        }

        var matches = text.match(regexHex);

        if (matches === null) {
            return text;
        }

        for (var i = 0, len = matches.length; i < len; i++) {
            var hexString = matches[i];

            if (hexString.indexOf('-') > -1) {
                var codePoints = hexString.split('-');
                var unicode = eval('String.fromCodePoint(0x' + codePoints.join(', 0x') + ')');
            } else {
                var codePoint = ['0x', hexString].join('');
                var unicode = String.fromCodePoint(codePoint);
            }

            text = text.replace(hexString, unicode);
        }

        return text;
    }

    function aliasify(text) {
        if (text == null) {
            return '';
        }

        return text.replace(emojiRegexp, function (match) {
            var hex = match.codePointAt(0).toString(16);
            return (EmojiHex.codes[hex]) ? ':' + EmojiHex.codes[hex] + ':' : '';
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
