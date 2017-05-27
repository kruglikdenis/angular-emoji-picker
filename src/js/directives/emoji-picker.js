angular.module('vkEmojiPicker').directive('emojiPicker', [
    '$anchorScroll', '$location', 'EmojiGroups', 'vkEmojiStorage', 'vkEmojiTransforms', 'Emoji', function ($anchorScroll, $location, emojiGroups, storage, vkEmojiTransforms, Emoji) {
        var RECENT_LIMIT = 54;
        var DEFAULT_OUTPUT_FORMAT = '';
        var templateUrl = 'templates/emoji-button-bootstrap.html';

        return {
            restrict: 'A',
            templateUrl: templateUrl,
            scope: {
                model: '=emojiPicker',
                placement: '@',
                sheet: '<?',
                title: '@',
                trigger: '@',
                appendToBody: '<?',
                popoverIsOpen: '<?',
                selectorClass: '@',
                onChangeFunc: '=',
                onChangeFuncParams: "=",
                onSelectEmoji: '&?'
            },
            link: function ($scope, element, attrs) {
                var sheetSize = 41;
                var sheet = $scope.sheet || 'images/emoji/sheet_google_64.png';

                var recentLimit = parseInt(attrs.recentLimit, 10) || RECENT_LIMIT;
                var outputFormat = attrs.outputFormat || DEFAULT_OUTPUT_FORMAT;

                $scope.groups = Emoji;
                $scope.groupPrefix = 'emoji-group';
                $scope.selectedGroup = emojiGroups.groups[1];   // Selecting the smiley face group by default
                // This next line is only if the recent group is selected by default
                //$scope.selectedGroup.emoji = storage.getFirst(recentLimit);

                $scope.append = function (emoji) {
                    if ($scope.model == null) {
                        $scope.model = '';
                    }

                    var emojiByFormat = formatSelectedEmoji(emoji, outputFormat);
                    if ($scope.onSelectEmoji) {
                        $scope.onSelectEmoji({emoji: emojiByFormat.trim()});
                    }
                    $scope.model += emojiByFormat;
                    $scope.model = $scope.model.trim();
                    storage.store(emoji);

                    fireOnChangeFunc();
                };

                $scope.remove = function () {
                    if (angular.isDefined($scope.model)) {
                        var words = $scope.model.split(' ');
                        words.pop();
                        $scope.model = words.join(' ').trim();

                        fireOnChangeFunc();
                    }
                };

                $scope.getEmojiStyle = function (emoji) {
                    var mul = 100 / (sheetSize - 1);
                    return {
                        background: 'url(' + sheet + ')',
                        'background-position': (mul * emoji.sheet_x) + '% ' + (mul * emoji.sheet_y) + '%',
                        'background-size': sheetSize + '00%'
                    };
                };

                $scope.changeGroup = function (group) {
                    console.log(String.fromCodePoint(0x23F0).codePointAt(0).toString(16))
                    console.log(String.fromCharCode(parseInt('23F0', 16)))
                    console.log(String.fromCodePoint(0x23F0))
                    var newHash = $scope.groupPrefix + '-' + group.short_name;
                    $scope.selectedGroup = group;
                    if ($location.hash() !== newHash) {
                        $location.hash(newHash);
                    } else {
                        $anchorScroll();

                    }
                    // // Don't let the user pick non-unicode emoji (there are 7) when output format is unicode
                    // if (outputFormat == 'unicode') {
                    //     group.emoji = group.emoji.filter(function (value) {
                    //         return emojiHex.emoji.hasOwnProperty(value);
                    //     });
                    // }
                    // $scope.selectedGroup = group;
                    //
                    // if ($scope.selectedGroup.name === 'recent') {
                    //     $scope.selectedGroup.emoji = storage.getFirst(recentLimit);
                    // }
                };

                $scope.$on('$destroy', function () {
                    element.remove();
                });


                function formatSelectedEmoji(emoji, type) {
                    emoji = [' :', emoji, ':'].join('');
                    if (type == 'unicode') {
                        return vkEmojiTransforms.emojify(emoji);
                    } else {
                        return emoji;
                    }
                }

                function fireOnChangeFunc() {
                    if ($scope.onChangeFunc && typeof $scope.onChangeFunc === 'function') {
                        setTimeout($scope.onChangeFunc($scope.onChangeFuncParams));
                    }
                }
            }
        };
    }
]);
