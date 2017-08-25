angular
    .module('ngEmojiPicker')
    .directive('emojiPicker', [
        '$anchorScroll',
        '$location',
        'ngEmojiStorage',
        'ngEmojiTransforms',
        'Emoji',
        function ($anchorScroll, $location, storage, ngEmojiTransforms, Emoji) {
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
                    $scope.filtredGroups = $scope.groups;
                    $scope.search = '';
                    $scope.groupPrefix = 'emoji-group';
                    $scope.selectedGroup = Emoji[0];

                    $scope.append = function (emoji) {
                        var emojiByFormat = formatSelectedEmoji(emoji, outputFormat);
                        if ($scope.onSelectEmoji) {
                            $scope.onSelectEmoji({emoji: emojiByFormat});
                        }

                        storage.store(emoji);
                        $scope.groups[0].emoji = storage.getFirst(recentLimit);
                        $scope.filtredGroups[0].emoji = storage.getFirst(recentLimit);
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

                    $scope.onSearchEmoji = function (search) {
                        var groups = $scope.groups;
                        if (search) {
                            groups = groups.map(function (group) {
                                var result = {name: group.name};
                                result.emoji = group.emoji.filter(function (emoji) {
                                    if (emoji.name === null) {
                                        emoji.name = '';
                                    }

                                    return emoji.name.toLowerCase().indexOf(search.toLowerCase(), 0) >= 0;
                                });

                                return result;
                            });
                        }

                        $scope.filtredGroups = groups;
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
