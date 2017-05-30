angular
    .module('ngEmojiPicker')
    .directive('emojiScroll', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    scrollEvent: '&'
                },
                link: function ($scope, element, attrs) {
                    element.bind('scroll', function (event) {
                        var scrollTop = angular.element(element).prop('scrollTop');
                        var children = element.children();
                        for (var i = 0; i < children.length ; i++) {
                            var currentChild = angular.element(children[i]);
                            var nextChild = angular.element(children[i + 1]);
                            var nextOffsetTop = nextChild.prop('offsetTop');
                            if (scrollTop + 40< nextOffsetTop) {
                                $scope.scrollEvent({group: currentChild.attr('data-group') || nextChild.attr('data-group')});
                                return;
                            }
                        }

                        $scope.scrollEvent({group: angular.element(children[children.length - 1]).attr('data-group')});
                    });
                }
            }
        }
    ]);