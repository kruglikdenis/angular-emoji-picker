angular
    .module('ngEmojiPicker')
    .directive('emojiPicker', [
        '$anchorScroll',
        '$location',
        'EmojiGroups',
        'vkEmojiStorage',
        'ngEmojiTransforms',
        'Emoji',
        function ($anchorScroll, $location, emojiGroups, storage, ngEmojiTransforms, Emoji) {
            var RECENT_LIMIT = 54;
            var DEFAULT_OUTPUT_FORMAT = '';

            return {
                restrict: 'A',
                templateUrl: 'templates/emoji-button-picker.html',
                scope: {
                    placement: '@',
                    title: '@',
                    trigger: '@',
                    appendToBody: '<?',
                    popoverIsOpen: '<?',
                    selectorClass: '@',

                    onSelectEmoji: '&?'
                },
                link: function ($scope, element, attrs) {
                    var recentLimit = parseInt(attrs.recentLimit, 10) || RECENT_LIMIT;
                    var outputFormat = attrs.outputFormat || DEFAULT_OUTPUT_FORMAT;

                    $scope.groups = [getRecentGroup()].concat(Emoji);
                    $scope.groupPrefix = 'emoji-group';
                    $scope.selectedGroup = Emoji[0];

                    $scope.append = function (emoji) {
                        var emojiByFormat = formatSelectedEmoji(emoji, outputFormat);
                        if ($scope.onSelectEmoji) {
                            $scope.onSelectEmoji({emoji: emojiByFormat});
                        }

                        storage.store(emoji);
                        $scope.groups[0].emoji = storage.getFirst(recentLimit);
                    };

                    $scope.toClassName = function (emoji) {
                        return 'cm-emoji-' + emoji.short_name.replace(/_/g, '-');
                    };

                    $scope.onScroll = function (groupName) {
                        if ($scope.selectedGroup.short_name !== groupName) {
                            $scope.selectedGroup = $scope.groups.find(function (group) {
                                return group.short_name === groupName;
                            });
                            $scope.$apply();
                        }
                    };

                    $scope.changeGroup = function (group) {
                        var newHash = $scope.groupPrefix + '-' + group.short_name;
                        $scope.selectedGroup = group;
                        if ($location.hash() !== newHash) {
                            $location.hash(newHash);
                        } else {
                            $anchorScroll();
                        }
                    };

                    $scope.$on('$destroy', function () {
                        element.remove();
                    });

                    function formatSelectedEmoji(emoji, type) {
                        emoji = [':', emoji.short_name, ':'].join('');
                        if (type == 'unicode') {

                            return ngEmojiTransforms.emojify(emoji);
                        }

                        return emoji;
                    }

                    function getRecentGroup() {
                        var emoji = storage.getFirst(recentLimit);
                        return {
                            name: 'Recent',
                            short_name: 'Recent',
                            order: 0,
                            emoji: emoji,
                            class: 'cm-emoji-stopwatch'
                        }
                    }
                }
            };
        }
]);
