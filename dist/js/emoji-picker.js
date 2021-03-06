angular.module('templates-dist', ['templates/emoji-button-picker.html', 'templates/emoji-picker.html']);

angular.module("templates/emoji-button-picker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/emoji-button-picker.html",
    "<i ng-class=\"selectorClass ? selectorClass : 'cm-emoji-picker cm-emoji-smile'\"\n" +
    "   class=\"emoji-button\"\n" +
    "   uib-popover-template=\"'templates/emoji-picker.html'\"\n" +
    "   popover-class=\"popover-emoji\"\n" +
    "   popover-placement=\"{{ !placement && 'left' || placement }}\"\n" +
    "   popover-title=\"{{ title }}\"\n" +
    "   popover-trigger=\"{{ !trigger && 'click' || trigger }}\"\n" +
    "   popover-append-to-body=\"appendToBody || false\"\n" +
    "   popover-is-open=\"popoverIsOpen || false\"\n" +
    ">\n" +
    "</i>\n" +
    "");
}]);

angular.module("templates/emoji-picker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/emoji-picker.html",
    "<div class=\"emoji-groups\">\n" +
    "    <i class=\"cm-emoji-picker\"\n" +
    "       ng-class=\"{'{{group.class}}': true, 'active-group': (group.short_name === selectedGroup.short_name)}\"\n" +
    "       ng-repeat=\"group in ::groups\"\n" +
    "       ng-click=\"changeGroup(group)\">\n" +
    "    </i>\n" +
    "</div>\n" +
    "<div class=\"emoji-container\" emoji-scroll scroll-event=\"::onScroll(group)\">\n" +
    "    <input class=\"emoji-search\"\n" +
    "           ng-model=\"search\"\n" +
    "           placeholder=\"Search...\"\n" +
    "           ng-change=\"onSearchEmoji(search)\"\n" +
    "           ng-model-options=\"{\n" +
    "                'debounce': {\n" +
    "                    'default': 200,\n" +
    "                    'blur': 0\n" +
    "                }\n" +
    "            }\"\n" +
    "    />\n" +
    "    <div id=\"{{::groupPrefix}}-{{group.short_name}}\"\n" +
    "         class=\"emoji-groups\"\n" +
    "         data-group=\"{{group.short_name}}\"\n" +
    "         ng-repeat=\"group in filtredGroups\"\n" +
    "    >\n" +
    "        <div class=\"emoji-group-label\" ng-bind=\"group.name\" ng-show=\"group.emoji.length > 0\">\n" +
    "        </div>\n" +
    "        <i ng-repeat=\"emoji in group.emoji track by $index\"\n" +
    "           class=\"cm-emoji-picker\"\n" +
    "           ng-class=\"toClassName(emoji)\"\n" +
    "           ng-click=\"append(emoji)\">\n" +
    "        </i>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

'use strict';

angular.module('ngEmojiPicker', ['ngSanitize', 'templates-dist']).config(function () {
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    if (!String.fromCodePoint) {
        (function () {
            var defineProperty = (function () {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch (error) {
                }
                return result;
            }());

            var stringFromCharCode = String.fromCharCode;
            var floor = Math.floor;

            var fromCodePoint = function () {
                var MAX_SIZE = 0x4000;
                var codeUnits = [];
                var highSurrogate;
                var lowSurrogate;
                var index = -1;
                var length = arguments.length;

                if (!length) {
                    return '';
                }

                var result = '';

                while (++index < length) {
                    var codePoint = Number(arguments[index]);
                    if (
                        !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
                        codePoint < 0 ||              // not a valid Unicode code point
                        codePoint > 0x10FFFF ||       // not a valid Unicode code point
                        floor(codePoint) != codePoint // not an integer
                    ) {
                        throw RangeError('Invalid code point: ' + codePoint);
                    }
                    if (codePoint <= 0xFFFF) { // BMP code point
                        codeUnits.push(codePoint);
                    } else { // Astral code point; split in surrogate halves
                        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                        codePoint -= 0x10000;
                        highSurrogate = (codePoint >> 10) + 0xD800;
                        lowSurrogate = (codePoint % 0x400) + 0xDC00;
                        codeUnits.push(highSurrogate, lowSurrogate);
                    }
                    if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                        result += stringFromCharCode.apply(null, codeUnits);
                        codeUnits.length = 0;
                    }
                }
                return result;
            };

            if (defineProperty) {
                defineProperty(String, 'fromCodePoint', {
                    value: fromCodePoint,
                    configurable: true,
                    writable: true
                });
            } else {
                String.fromCodePoint = fromCodePoint;
            }
        }());
    }
});

angular.module('ngEmojiPicker').constant('EmojiGroups', (function () {
  var faces = ['smile', 'laughing', 'blush', 'smiley', 'relaxed',
    'smirk', 'heart_eyes', 'kissing_heart', 'kissing_closed_eyes', 'flushed',
    'relieved', 'satisfied', 'grin', 'wink', 'stuck_out_tongue_winking_eye',
    'stuck_out_tongue_closed_eyes', 'grinning', 'kissing', 'winky_face',
    'kissing_smiling_eyes', 'stuck_out_tongue', 'sleeping', 'worried',
    'frowning', 'anguished', 'open_mouth', 'grimacing', 'confused', 'hushed',
    'expressionless', 'unamused', 'sweat_smile', 'sweat', 'wow',
    'disappointed_relieved', 'weary', 'pensive', 'disappointed', 'confounded',
    'fearful', 'cold_sweat', 'persevere', 'cry', 'sob', 'joy', 'astonished',
    'scream', 'neckbeard', 'tired_face', 'angry', 'rage', 'triumph', 'sleepy',
    'yum', 'mask', 'sunglasses', 'dizzy_face', 'imp', 'smiling_imp',
    'neutral_face', 'no_mouth', 'innocent', 'alien', 'yellow_heart',
    'blue_heart', 'purple_heart', 'heart', 'green_heart', 'broken_heart',
    'heartbeat', 'heartpulse', 'two_hearts', 'revolving_hearts', 'cupid',
    'sparkling_heart', 'sparkles', 'star', 'star2', 'dizzy', 'boom',
    'collision', 'anger', 'exclamation', 'question', 'grey_exclamation',
    'grey_question', 'zzz', 'dash', 'sweat_drops', 'notes', 'musical_note',
    'fire', 'hankey', 'thumbsup', 'thumbsdown',
    'ok_hand', 'punch', 'fist', 'v', 'wave', 'hand', 'raised_hand',
    'open_hands', 'point_up', 'point_down', 'point_left', 'point_right',
    'raised_hands', 'pray', 'point_up_2', 'clap', 'muscle', 'metal', 'fu',
    'walking', 'runner', 'couple', 'family', 'two_men_holding_hands',
    'two_women_holding_hands', 'dancer', 'dancers', 'ok_woman', 'no_good',
    'information_desk_person', 'raising_hand', 'bride_with_veil',
    'person_with_pouting_face', 'person_frowning', 'bow', 'couplekiss',
    'couple_with_heart', 'massage', 'haircut', 'nail_care', 'boy', 'girl',
    'woman', 'man', 'baby', 'older_woman', 'older_man',
    'person_with_blond_hair', 'man_with_gua_pi_mao', 'man_with_turban',
    'construction_worker', 'cop', 'angel', 'princess', 'smiley_cat',
    'smile_cat', 'heart_eyes_cat', 'kissing_cat', 'smirk_cat', 'scream_cat',
    'crying_cat_face', 'joy_cat', 'pouting_cat', 'japanese_ogre',
    'japanese_goblin', 'see_no_evil', 'hear_no_evil', 'speak_no_evil',
    'guardsman', 'skull', 'feet', 'lips', 'kiss', 'droplet', 'ear', 'eyes',
    'nose', 'tongue', 'love_letter', 'bust_in_silhouette',
    'busts_in_silhouette', 'speech_balloon', 'thought_balloon'];

  var nature = ['sunny', 'umbrella', 'cloud',
    'snowflake', 'snowman', 'zap', 'cyclone', 'foggy', 'ocean', 'cat', 'dog',
    'mouse', 'hamster', 'rabbit', 'wolf', 'frog', 'tiger', 'koala', 'bear',
    'pig', 'pig_nose', 'cow', 'boar', 'monkey_face', 'monkey', 'horse',
    'racehorse', 'camel', 'sheep', 'elephant', 'panda_face', 'snake', 'bird',
    'baby_chick', 'hatched_chick', 'hatching_chick', 'chicken', 'penguin',
    'turtle', 'bug', 'honeybee', 'ant', 'beetle', 'snail', 'octopus',
    'tropical_fish', 'fish', 'whale', 'whale2', 'dolphin', 'cow2', 'ram', 'rat',
    'water_buffalo', 'tiger2', 'rabbit2', 'dragon', 'goat', 'rooster', 'dog2',
    'pig2', 'mouse2', 'ox', 'dragon_face', 'blowfish', 'crocodile',
    'dromedary_camel', 'leopard', 'cat2', 'poodle', 'paw_prints', 'bouquet',
    'cherry_blossom', 'tulip', 'four_leaf_clover', 'rose', 'sunflower',
    'hibiscus', 'maple_leaf', 'leaves', 'fallen_leaf', 'herb', 'mushroom',
    'cactus', 'palm_tree', 'evergreen_tree', 'deciduous_tree', 'chestnut',
    'seedling', 'blossom', 'ear_of_rice', 'shell', 'globe_with_meridians',
    'sun_with_face', 'full_moon_with_face', 'new_moon_with_face', 'new_moon',
    'waxing_crescent_moon', 'first_quarter_moon', 'waxing_gibbous_moon',
    'full_moon', 'waning_gibbous_moon', 'last_quarter_moon',
    'waning_crescent_moon', 'last_quarter_moon_with_face',
    'first_quarter_moon_with_face', 'moon', 'earth_africa', 'earth_americas',
    'earth_asia', 'volcano', 'milky_way', 'partly_sunny'];

  var life = ['bamboo', 'gift_heart', 'dolls', 'school_satchel', 'mortar_board', 'flags',
    'fireworks', 'sparkler', 'wind_chime', 'rice_scene', 'jack_o_lantern',
    'ghost', 'santa', 'christmas_tree', 'gift', 'bell', 'no_bell',
    'tanabata_tree', 'tada', 'confetti_ball', 'balloon', 'crystal_ball', 'cd',
    'dvd', 'floppy_disk', 'camera', 'video_camera', 'movie_camera', 'computer',
    'tv', 'iphone', 'phone', 'telephone', 'telephone_receiver', 'pager', 'fax',
    'minidisc', 'vhs', 'sound', 'speaker', 'mute', 'loudspeaker', 'mega',
    'hourglass', 'hourglass_flowing_sand', 'alarm_clock', 'watch', 'radio',
    'satellite', 'loop', 'mag', 'mag_right', 'unlock', 'lock',
    'lock_with_ink_pen', 'closed_lock_with_key', 'key', 'bulb', 'flashlight',
    'high_brightness', 'low_brightness', 'electric_plug', 'battery', 'calling',
    'email', 'mailbox', 'postbox', 'bath', 'bathtub', 'shower', 'toilet',
    'wrench', 'nut_and_bolt', 'hammer', 'seat', 'moneybag', 'yen', 'dollar',
    'pound', 'euro', 'credit_card', 'money_with_wings', 'e-mail', 'inbox_tray',
    'outbox_tray', 'envelope', 'incoming_envelope', 'postal_horn',
    'mailbox_closed', 'mailbox_with_mail', 'mailbox_with_no_mail', 'door',
    'smoking', 'bomb', 'gun', 'hocho', 'pill', 'syringe', 'page_facing_up',
    'page_with_curl', 'bookmark_tabs', 'bar_chart', 'chart_with_upwards_trend',
    'chart_with_downwards_trend', 'scroll', 'clipboard', 'calendar', 'date',
    'card_index', 'file_folder', 'open_file_folder', 'scissors', 'pushpin',
    'paperclip', 'black_nib', 'pencil2', 'straight_ruler', 'triangular_ruler',
    'closed_book', 'green_book', 'blue_book', 'orange_book', 'notebook',
    'notebook_with_decorative_cover', 'ledger', 'books', 'bookmark',
    'name_badge', 'microscope', 'telescope', 'newspaper', 'football',
    'basketball', 'soccer', 'baseball', 'tennis', '8ball', 'rugby_football',
    'bowling', 'golf', 'mountain_bicyclist', 'bicyclist', 'horse_racing',
    'snowboarder', 'swimmer', 'surfer', 'ski', 'spades', 'hearts', 'clubs',
    'diamonds', 'gem', 'ring', 'trophy', 'musical_score', 'musical_keyboard',
    'violin', 'space_invader', 'video_game', 'black_joker',
    'flower_playing_cards', 'game_die', 'dart', 'mahjong', 'clapper', 'memo',
    'book', 'art', 'microphone', 'headphones', 'trumpet', 'saxophone',
    'guitar', 'shoe', 'sandal', 'high_heel', 'lipstick', 'boot', 'shirt',
    'necktie', 'womans_clothes', 'dress', 'running_shirt_with_sash',
    'jeans', 'kimono', 'bikini', 'ribbon', 'tophat', 'crown', 'womans_hat',
    'mans_shoe', 'closed_umbrella', 'briefcase', 'handbag', 'pouch', 'purse',
    'eyeglasses', 'fishing_pole_and_fish', 'coffee', 'tea', 'sake',
    'baby_bottle', 'beer', 'beers', 'cocktail', 'tropical_drink', 'wine_glass',
    'fork_and_knife', 'pizza', 'hamburger', 'fries', 'poultry_leg',
    'meat_on_bone', 'spaghetti', 'curry', 'fried_shrimp', 'bento', 'sushi',
    'fish_cake', 'rice_ball', 'rice_cracker', 'rice', 'ramen', 'stew', 'oden',
    'dango', 'egg', 'bread', 'doughnut', 'custard', 'icecream', 'ice_cream',
    'shaved_ice', 'birthday', 'cake', 'cookie', 'chocolate_bar', 'candy',
    'lollipop', 'honey_pot', 'apple', 'green_apple', 'tangerine', 'lemon',
    'cherries', 'grapes', 'watermelon', 'strawberry', 'peach', 'melon',
    'banana', 'pear', 'pineapple', 'sweet_potato', 'eggplant', 'tomato', 'corn'];

  var travel = ['house', 'house_with_garden', 'school', 'office', 'post_office', 'hospital',
    'bank', 'convenience_store', 'love_hotel', 'hotel', 'wedding', 'church',
    'department_store', 'european_post_office', 'city_sunrise', 'city_sunset',
    'japanese_castle', 'european_castle', 'tent', 'factory', 'tokyo_tower',
    'japan', 'mount_fuji', 'sunrise_over_mountains', 'sunrise', 'stars',
    'statue_of_liberty', 'bridge_at_night', 'carousel_horse', 'rainbow',
    'ferris_wheel', 'fountain', 'roller_coaster', 'ship', 'speedboat', 'boat',
    'rowboat', 'anchor', 'rocket', 'airplane', 'helicopter',
    'steam_locomotive', 'tram', 'mountain_railway', 'bike', 'aerial_tramway',
    'suspension_railway', 'mountain_cableway', 'tractor', 'blue_car',
    'oncoming_automobile', 'car', 'taxi', 'oncoming_taxi',
    'articulated_lorry', 'bus', 'oncoming_bus', 'rotating_light', 'police_car',
    'oncoming_police_car', 'fire_engine', 'ambulance', 'minibus', 'truck',
    'train', 'station', 'bullettrain_front', 'bullettrain_side',
    'light_rail', 'monorail', 'railway_car', 'trolleybus', 'ticket', 'fuelpump',
    'vertical_traffic_light', 'traffic_light', 'warning', 'construction',
    'beginner', 'atm', 'slot_machine', 'busstop', 'barber', 'hotsprings',
    'checkered_flag', 'crossed_flags', 'izakaya_lantern', 'moyai',
    'circus_tent', 'performing_arts', 'round_pushpin',
    'triangular_flag_on_post', 'jp', 'kr', 'cn', 'us', 'fr', 'es', 'it', 'ru', 'uk', 'de'];

  var signs = ['one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'keycap_ten', '1234', 'zero', 'hash', 'symbols',
    'arrow_backward', 'arrow_down', 'arrow_forward', 'arrow_left',
    'capital_abcd', 'abcd', 'abc', 'arrow_lower_left', 'arrow_lower_right',
    'arrow_right', 'arrow_up', 'arrow_upper_left', 'arrow_upper_right',
    'arrow_double_down', 'arrow_double_up', 'arrow_down_small',
    'arrow_heading_down', 'arrow_heading_up', 'leftwards_arrow_with_hook',
    'arrow_right_hook', 'left_right_arrow', 'arrow_up_down', 'arrow_up_small',
    'arrows_clockwise', 'arrows_counterclockwise', 'rewind', 'fast_forward',
    'information_source', 'ok', 'twisted_rightwards_arrows', 'repeat',
    'repeat_one', 'new', 'top', 'up', 'cool', 'free', 'ng', 'cinema', 'koko',
    'signal_strength', 'u5272', 'u5408', 'u55b6', 'u6307', 'u6708', 'u6709',
    'u6e80', 'u7121', 'u7533', 'u7a7a', 'u7981', 'sa', 'restroom', 'mens',
    'womens', 'baby_symbol', 'no_smoking', 'parking', 'wheelchair', 'metro',
    'baggage_claim', 'accept', 'wc', 'potable_water', 'put_litter_in_its_place',
    'secret', 'congratulations', 'm', 'passport_control', 'left_luggage',
    'customs', 'ideograph_advantage', 'cl', 'sos', 'id', 'no_entry_sign',
    'underage', 'no_mobile_phones', 'do_not_litter', 'non-potable_water',
    'no_bicycles', 'no_pedestrians', 'children_crossing', 'no_entry',
    'eight_spoked_asterisk', 'eight_pointed_black_star', 'heart_decoration',
    'vs', 'vibration_mode', 'mobile_phone_off', 'chart', 'currency_exchange',
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpius',
    'sagittarius', 'capricorn', 'aquarius', 'pisces', 'ophiuchus',
    'six_pointed_star', 'negative_squared_cross_mark', 'a', 'b', 'ab', 'o2',
    'diamond_shape_with_a_dot_inside', 'recycle', 'end', 'on', 'soon', 'clock1',
    'clock130', 'clock10', 'clock1030', 'clock11', 'clock1130', 'clock12',
    'clock1230', 'clock2', 'clock230', 'clock3', 'clock330', 'clock4',
    'clock430', 'clock5', 'clock530', 'clock6', 'clock630', 'clock7',
    'clock730', 'clock8', 'clock830', 'clock9', 'clock930', 'heavy_dollar_sign',
    'copyright', 'registered', 'tm', 'x', 'heavy_exclamation_mark', 'bangbang',
    'interrobang', 'o', 'heavy_multiplication_x', 'heavy_plus_sign',
    'heavy_minus_sign', 'heavy_division_sign', 'white_flower', '100',
    'heavy_check_mark', 'ballot_box_with_check', 'radio_button', 'link',
    'curly_loop', 'wavy_dash', 'part_alternation_mark', 'trident',
    'black_square', 'white_square', 'white_check_mark', 'black_square_button',
    'white_square_button', 'black_circle', 'white_circle', 'red_circle',
    'large_blue_circle', 'large_blue_diamond', 'large_orange_diamond',
    'small_blue_diamond', 'small_orange_diamond', 'small_red_triangle',
    'small_red_triangle_down'];

  var all = faces.concat(nature, life, travel, signs);

  return {
    groups: [
      {
        name: 'recent',
        icon: {
          name: 'icon-recent',
          selected: 'icon-recent-selected'
        },
        emoji: []
      }, {
        name: 'smile',
        icon: {
          name: 'icon-smile',
          selected: 'icon-smile-selected'
        },
        emoji: faces
      }, {
        name: 'flower',
        icon: {
          name: 'icon-flower',
          selected: 'icon-flower-selected'
        },
        emoji: nature
      }, {
        name: 'bell',
        icon: {
          name: 'icon-bell',
          selected: 'icon-bell-selected'
        },
        emoji: life
      }, {
        name: 'car',
        icon: {
          name: 'icon-car',
          selected: 'icon-car-selected'
        },
        emoji: travel
      }, {
        name: 'grid',
        icon: {
          name: 'icon-grid',
          selected: 'icon-grid-selected'
        },
        emoji: signs
      }
    ],
    all: all
  };
})());

angular.module('ngEmojiPicker').constant('EmojiHex', (function () {
 return {
  "00a9"  : "\u00A9\uFE0F", 
  "00ae"  : "\u00AE\uFE0F", 
  "203c"  : "\u203C\uFE0F", 
  "2049"  : "\u2049\uFE0F", 
  "2122"  : "\u2122\uFE0F", 
  "2139"  : "\u2139\uFE0F", 
  "2194"  : "\u2194\uFE0F", 
  "2195"  : "\u2195\uFE0F", 
  "2196"  : "\u2196\uFE0F", 
  "2197"  : "\u2197\uFE0F", 
  "2198"  : "\u2198\uFE0F", 
  "2199"  : "\u2199\uFE0F", 
  "21a9"  : "\u21A9\uFE0F", 
  "21aa"  : "\u21AA\uFE0F", 
  "231a"  : "\u231A\uFE0F", 
  "231b"  : "\u231B\uFE0F", 
  "2328"  : "\u2328\uFE0F", 
  "23cf"  : "\u23CF"  , 
  "23e9"  : "\u23E9" ,  
  "23ea"  : "\u23EA" ,  
  "23eb"  : "\u23EB" ,  
  "23ec"  : "\u23EC" ,  
  "23ed"  : "\u23ED" ,  
  "23ee"  : "\u23EE" ,  
  "23ef"  : "\u23EF" ,  
  "23f0"  : "\u23F0" ,  
  "23f1"  : "\u23F1" ,  
  "23f2"  : "\u23F2" ,  
  "23f3"  : "\u23F3" ,  
  "23f8"  : "\u23F8" ,  
  "23f9"  : "\u23F9" ,  
  "23fa"  : "\u23FA" ,  
  "24c2"  : "\u24C2\uFE0F", 
  "25aa"  : "\u25AA\uFE0F", 
  "25ab"  : "\u25AB\uFE0F", 
  "25b6"  : "\u25B6\uFE0F", 
  "25c0"  : "\u25C0\uFE0F", 
  "25fb"  : "\u25FB\uFE0F", 
  "25fc"  : "\u25FC\uFE0F", 
  "25fd"  : "\u25FD\uFE0F", 
  "25fe"  : "\u25FE\uFE0F", 
  "2600"  : "\u2600\uFE0F", 
  "2601"  : "\u2601\uFE0F", 
  "2602"  : "\u2602\uFE0F", 
  "2603"  : "\u2603\uFE0F", 
  "2604"  : "\u2604\uFE0F", 
  "260e"  : "\u260E\uFE0F", 
  "2611"  : "\u2611\uFE0F", 
  "2614"  : "\u2614\uFE0F", 
  "2615"  : "\u2615\uFE0F", 
  "2618"  : "\u2618" ,  
  "261d"  : "\u261D\uFE0F", 
  "2620"  : "\u2620\uFE0F", 
  "2622"  : "\u2622\uFE0F", 
  "2623"  : "\u2623\uFE0F", 
  "2626"  : "\u2626\uFE0F", 
  "262a"  : "\u262A\uFE0F", 
  "262e"  : "\u262E\uFE0F", 
  "262f"  : "\u262F\uFE0F", 
  "2638"  : "\u2638\uFE0F", 
  "2639"  : "\u2639\uFE0F", 
  "263a"  : "\u263A\uFE0F", 
  "2648"  : "\u2648\uFE0F", 
  "2649"  : "\u2649\uFE0F", 
  "264a"  : "\u264A\uFE0F", 
  "264b"  : "\u264B\uFE0F", 
  "264c"  : "\u264C\uFE0F", 
  "264d"  : "\u264D\uFE0F", 
  "264e"  : "\u264E\uFE0F", 
  "264f"  : "\u264F\uFE0F", 
  "2650"  : "\u2650\uFE0F", 
  "2651"  : "\u2651\uFE0F", 
  "2652"  : "\u2652\uFE0F", 
  "2653"  : "\u2653\uFE0F", 
  "2660"  : "\u2660\uFE0F", 
  "2663"  : "\u2663\uFE0F", 
  "2665"  : "\u2665\uFE0F", 
  "2666"  : "\u2666\uFE0F", 
  "2668"  : "\u2668\uFE0F", 
  "267b"  : "\u267B\uFE0F", 
  "267f"  : "\u267F\uFE0F", 
  "2692"  : "\u2692" ,  
  "2693"  : "\u2693\uFE0F", 
  "2694"  : "\u2694" ,  
  "2696"  : "\u2696" ,  
  "2697"  : "\u2697" ,  
  "2699"  : "\u2699" ,  
  "269b"  : "\u269B" ,  
  "269c"  : "\u269C" ,  
  "26a0"  : "\u26A0\uFE0F", 
  "26a1"  : "\u26A1\uFE0F", 
  "26aa"  : "\u26AA\uFE0F", 
  "26ab"  : "\u26AB\uFE0F", 
  "26b0"  : "\u26B0" ,  
  "26b1"  : "\u26B1" ,  
  "26bd"  : "\u26BD\uFE0F", 
  "26be"  : "\u26BE\uFE0F", 
  "26c4"  : "\u26C4\uFE0F", 
  "26c5"  : "\u26C5\uFE0F", 
  "26c8"  : "\u26C8" ,  
  "26ce"  : "\u26CE" ,  
  "26cf"  : "\u26CF" ,  
  "26d1"  : "\u26D1" ,  
  "26d3"  : "\u26D3" ,  
  "26d4"  : "\u26D4\uFE0F", 
  "26e9"  : "\u26E9" ,  
  "26ea"  : "\u26EA\uFE0F", 
  "26f0"  : "\u26F0" ,  
  "26f1"  : "\u26F1" ,  
  "26f2"  : "\u26F2\uFE0F", 
  "26f3"  : "\u26F3\uFE0F", 
  "26f4"  : "\u26F4" ,  
  "26f5"  : "\u26F5\uFE0F", 
  "26f7"  : "\u26F7" ,  
  "26f8"  : "\u26F8" ,  
  "26f9"  : "\u26F9" ,  
  "26fa"  : "\u26FA\uFE0F", 
  "26fd"  : "\u26FD\uFE0F", 
  "2702"  : "\u2702\uFE0F", 
  "2705"  : "\u2705" ,  
  "2708"  : "\u2708\uFE0F", 
  "2709"  : "\u2709\uFE0F", 
  "270a"  : "\u270A" , 
  "270b"  : "\u270B" , 
  "270c"  : "\u270C\uFE0F", 
  "270d"  : "\u270D\uFE0F", 
  "270f"  : "\u270F\uFE0F", 
  "2712"  : "\u2712\uFE0F", 
  "2714"  : "\u2714\uFE0F", 
  "2716"  : "\u2716\uFE0F", 
  "271d"  : "\u271D\uFE0F", 
  "2721"  : "\u2721\uFE0F", 
  "2728"  : "\u2728" , 
  "2733"  : "\u2733\uFE0F", 
  "2734"  : "\u2734\uFE0F", 
  "2744"  : "\u2744\uFE0F", 
  "2747"  : "\u2747\uFE0F", 
  "274c"  : "\u274C" , 
  "274e"  : "\u274E" , 
  "2753"  : "\u2753" , 
  "2754"  : "\u2754" , 
  "2755"  : "\u2755" , 
  "2757"  : "\u2757\uFE0F", 
  "2763"  : "\u2763\uFE0F", 
  "2764"  : "\u2764\uFE0F", 
  "2795"  : "\u2795" , 
  "2796"  : "\u2796" , 
  "2797"  : "\u2797" , 
  "27a1"  : "\u27A1\uFE0F", 
  "27b0"  : "\u27B0" , 
  "27bf"  : "\u27BF" , 
  "2934"  : "\u2934\uFE0F", 
  "2935"  : "\u2935\uFE0F", 
  "2b05"  : "\u2B05\uFE0F", 
  "2b06"  : "\u2B06\uFE0F", 
  "2b07"  : "\u2B07\uFE0F", 
  "2b1b"  : "\u2B1B\uFE0F", 
  "2b1c"  : "\u2B1C\uFE0F", 
  "2b50"  : "\u2B50\uFE0F", 
  "2b55"  : "\u2B55\uFE0F", 
  "3030"  : "\u3030\uFE0F", 
  "303d"  : "\u303D\uFE0F", 
  "3297"  : "\u3297\uFE0F", 
  "3299"  : "\u3299\uFE0F", 
  "1f004"  : "\uD83C\uDC04\uFE0F",  
  "1f0cf"  : "\uD83C\uDCCF" , 
  "1f170"  : "\uD83C\uDD70\uFE0F",  
  "1f171"  : "\uD83C\uDD71\uFE0F",  
  "1f17e"  : "\uD83C\uDD7E\uFE0F",  
  "1f17f"  : "\uD83C\uDD7F\uFE0F",  
  "1f18e"  : "\uD83C\uDD8E" , 
  "1f191"  : "\uD83C\uDD91" , 
  "1f192"  : "\uD83C\uDD92" , 
  "1f193"  : "\uD83C\uDD93" , 
  "1f194"  : "\uD83C\uDD94" , 
  "1f195"  : "\uD83C\uDD95" , 
  "1f196"  : "\uD83C\uDD96" , 
  "1f197"  : "\uD83C\uDD97" , 
  "1f198"  : "\uD83C\uDD98" , 
  "1f199"  : "\uD83C\uDD99" , 
  "1f19a"  : "\uD83C\uDD9A" , 
  "1f201"  : "\uD83C\uDE01" , 
  "1f202"  : "\uD83C\uDE02\uFE0F",  
  "1f21a"  : "\uD83C\uDE1A\uFE0F",  
  "1f22f"  : "\uD83C\uDE2F\uFE0F",  
  "1f232"  : "\uD83C\uDE32" , 
  "1f233"  : "\uD83C\uDE33" , 
  "1f234"  : "\uD83C\uDE34" , 
  "1f235"  : "\uD83C\uDE35" , 
  "1f236"  : "\uD83C\uDE36" , 
  "1f237"  : "\uD83C\uDE37\uFE0F",  
  "1f238"  : "\uD83C\uDE38" , 
  "1f239"  : "\uD83C\uDE39" , 
  "1f23a"  : "\uD83C\uDE3A" , 
  "1f250"  : "\uD83C\uDE50" , 
  "1f251"  : "\uD83C\uDE51" , 
  "1f300"  : "\uD83C\uDF00" , 
  "1f301"  : "\uD83C\uDF01" , 
  "1f302"  : "\uD83C\uDF02" , 
  "1f303"  : "\uD83C\uDF03" , 
  "1f304"  : "\uD83C\uDF04" , 
  "1f305"  : "\uD83C\uDF05" , 
  "1f306"  : "\uD83C\uDF06" , 
  "1f307"  : "\uD83C\uDF07" , 
  "1f308"  : "\uD83C\uDF08" , 
  "1f309"  : "\uD83C\uDF09" , 
  "1f30a"  : "\uD83C\uDF0A" , 
  "1f30b"  : "\uD83C\uDF0B" , 
  "1f30c"  : "\uD83C\uDF0C" , 
  "1f30d"  : "\uD83C\uDF0D" , 
  "1f30e"  : "\uD83C\uDF0E" , 
  "1f30f"  : "\uD83C\uDF0F" , 
  "1f310"  : "\uD83C\uDF10" , 
  "1f311"  : "\uD83C\uDF11" , 
  "1f312"  : "\uD83C\uDF12" , 
  "1f313"  : "\uD83C\uDF13" , 
  "1f314"  : "\uD83C\uDF14" , 
  "1f315"  : "\uD83C\uDF15" , 
  "1f316"  : "\uD83C\uDF16" , 
  "1f317"  : "\uD83C\uDF17" , 
  "1f318"  : "\uD83C\uDF18" , 
  "1f319"  : "\uD83C\uDF19" , 
  "1f31a"  : "\uD83C\uDF1A" , 
  "1f31b"  : "\uD83C\uDF1B" , 
  "1f31c"  : "\uD83C\uDF1C" , 
  "1f31d"  : "\uD83C\uDF1D" , 
  "1f31e"  : "\uD83C\uDF1E" , 
  "1f31f"  : "\uD83C\uDF1F" , 
  "1f320"  : "\uD83C\uDF20" , 
  "1f321"  : "\uD83C\uDF21" , 
  "1f324"  : "\uD83C\uDF24" , 
  "1f325"  : "\uD83C\uDF25" , 
  "1f326"  : "\uD83C\uDF26" , 
  "1f327"  : "\uD83C\uDF27" , 
  "1f328"  : "\uD83C\uDF28" , 
  "1f329"  : "\uD83C\uDF29" , 
  "1f32a"  : "\uD83C\uDF2A" , 
  "1f32b"  : "\uD83C\uDF2B" , 
  "1f32c"  : "\uD83C\uDF2C" , 
  "1f32d"  : "\uD83C\uDF2D" , 
  "1f32e"  : "\uD83C\uDF2E" , 
  "1f32f"  : "\uD83C\uDF2F" , 
  "1f330"  : "\uD83C\uDF30" , 
  "1f331"  : "\uD83C\uDF31" , 
  "1f332"  : "\uD83C\uDF32" , 
  "1f333"  : "\uD83C\uDF33" , 
  "1f334"  : "\uD83C\uDF34" , 
  "1f335"  : "\uD83C\uDF35" , 
  "1f336"  : "\uD83C\uDF36" , 
  "1f337"  : "\uD83C\uDF37" , 
  "1f338"  : "\uD83C\uDF38" , 
  "1f339"  : "\uD83C\uDF39" , 
  "1f33a"  : "\uD83C\uDF3A" , 
  "1f33b"  : "\uD83C\uDF3B" , 
  "1f33c"  : "\uD83C\uDF3C" , 
  "1f33d"  : "\uD83C\uDF3D" , 
  "1f33e"  : "\uD83C\uDF3E" , 
  "1f33f"  : "\uD83C\uDF3F" , 
  "1f340"  : "\uD83C\uDF40" , 
  "1f341"  : "\uD83C\uDF41" , 
  "1f342"  : "\uD83C\uDF42" , 
  "1f343"  : "\uD83C\uDF43" , 
  "1f344"  : "\uD83C\uDF44" , 
  "1f345"  : "\uD83C\uDF45" , 
  "1f346"  : "\uD83C\uDF46" , 
  "1f347"  : "\uD83C\uDF47" , 
  "1f348"  : "\uD83C\uDF48" , 
  "1f349"  : "\uD83C\uDF49" , 
  "1f34a"  : "\uD83C\uDF4A" , 
  "1f34b"  : "\uD83C\uDF4B" , 
  "1f34c"  : "\uD83C\uDF4C" , 
  "1f34d"  : "\uD83C\uDF4D" , 
  "1f34e"  : "\uD83C\uDF4E" , 
  "1f34f"  : "\uD83C\uDF4F" , 
  "1f350"  : "\uD83C\uDF50" , 
  "1f351"  : "\uD83C\uDF51" , 
  "1f352"  : "\uD83C\uDF52" , 
  "1f353"  : "\uD83C\uDF53" , 
  "1f354"  : "\uD83C\uDF54" , 
  "1f355"  : "\uD83C\uDF55" , 
  "1f356"  : "\uD83C\uDF56" , 
  "1f357"  : "\uD83C\uDF57" , 
  "1f358"  : "\uD83C\uDF58" , 
  "1f359"  : "\uD83C\uDF59" , 
  "1f35a"  : "\uD83C\uDF5A" ,
  "1f35b"  : "\uD83C\uDF5B" ,
  "1f35c"  : "\uD83C\uDF5C" ,
  "1f35d"  : "\uD83C\uDF5D" ,
  "1f35e"  : "\uD83C\uDF5E" ,
  "1f35f"  : "\uD83C\uDF5F" ,
  "1f360"  : "\uD83C\uDF60" ,
  "1f361"  : "\uD83C\uDF61" ,
  "1f362"  : "\uD83C\uDF62" ,
  "1f363"  : "\uD83C\uDF63" ,
  "1f364"  : "\uD83C\uDF64" ,
  "1f365"  : "\uD83C\uDF65" ,
  "1f366"  : "\uD83C\uDF66" ,
  "1f367"  : "\uD83C\uDF67" ,
  "1f368"  : "\uD83C\uDF68" ,
  "1f369"  : "\uD83C\uDF69" ,
  "1f36a"  : "\uD83C\uDF6A" ,
  "1f36b"  : "\uD83C\uDF6B" ,
  "1f36c"  : "\uD83C\uDF6C" ,
  "1f36d"  : "\uD83C\uDF6D" ,
  "1f36e"  : "\uD83C\uDF6E" ,
  "1f36f"  : "\uD83C\uDF6F" ,
  "1f370"  : "\uD83C\uDF70" ,
  "1f371"  : "\uD83C\uDF71" ,
  "1f372"  : "\uD83C\uDF72" ,
  "1f373"  : "\uD83C\uDF73" ,
  "1f374"  : "\uD83C\uDF74" ,
  "1f375"  : "\uD83C\uDF75" ,
  "1f376"  : "\uD83C\uDF76" ,
  "1f377"  : "\uD83C\uDF77" ,
  "1f378"  : "\uD83C\uDF78" ,
  "1f379"  : "\uD83C\uDF79" ,
  "1f37a"  : "\uD83C\uDF7A" ,
  "1f37b"  : "\uD83C\uDF7B" ,
  "1f37c"  : "\uD83C\uDF7C" ,
  "1f37d"  : "\uD83C\uDF7D" ,
  "1f37e"  : "\uD83C\uDF7E" ,
  "1f37f"  : "\uD83C\uDF7F" ,
  "1f380"  : "\uD83C\uDF80" ,
  "1f381"  : "\uD83C\uDF81" ,
  "1f382"  : "\uD83C\uDF82" ,
  "1f383"  : "\uD83C\uDF83" ,
  "1f384"  : "\uD83C\uDF84" ,
  "1f385"  : "\uD83C\uDF85" ,
  "1f386"  : "\uD83C\uDF86" ,
  "1f387"  : "\uD83C\uDF87" ,
  "1f388"  : "\uD83C\uDF88" ,
  "1f389"  : "\uD83C\uDF89" ,
  "1f38a"  : "\uD83C\uDF8A" ,
  "1f38b"  : "\uD83C\uDF8B" ,
  "1f38c"  : "\uD83C\uDF8C" ,
  "1f38d"  : "\uD83C\uDF8D" ,
  "1f38e"  : "\uD83C\uDF8E" ,
  "1f38f"  : "\uD83C\uDF8F" ,
  "1f390"  : "\uD83C\uDF90" ,
  "1f391"  : "\uD83C\uDF91" ,
  "1f392"  : "\uD83C\uDF92" ,
  "1f393"  : "\uD83C\uDF93" ,
  "1f396"  : "\uD83C\uDF96" ,
  "1f397"  : "\uD83C\uDF97" ,
  "1f399"  : "\uD83C\uDF99" ,
  "1f39a"  : "\uD83C\uDF9A" ,
  "1f39b"  : "\uD83C\uDF9B" ,
  "1f39e"  : "\uD83C\uDF9E" ,
  "1f39f"  : "\uD83C\uDF9F" ,
  "1f3a0"  : "\uD83C\uDFA0" ,
  "1f3a1"  : "\uD83C\uDFA1" ,
  "1f3a2"  : "\uD83C\uDFA2" ,
  "1f3a3"  : "\uD83C\uDFA3" ,
  "1f3a4"  : "\uD83C\uDFA4" ,
  "1f3a5"  : "\uD83C\uDFA5" ,
  "1f3a6"  : "\uD83C\uDFA6" ,
  "1f3a7"  : "\uD83C\uDFA7" ,
  "1f3a8"  : "\uD83C\uDFA8" ,
  "1f3a9"  : "\uD83C\uDFA9" ,
  "1f3aa"  : "\uD83C\uDFAA" ,
  "1f3ab"  : "\uD83C\uDFAB" ,
  "1f3ac"  : "\uD83C\uDFAC" ,
  "1f3ad"  : "\uD83C\uDFAD" ,
  "1f3ae"  : "\uD83C\uDFAE" ,
  "1f3af"  : "\uD83C\uDFAF" ,
  "1f3b0"  : "\uD83C\uDFB0" ,
  "1f3b1"  : "\uD83C\uDFB1" ,
  "1f3b2"  : "\uD83C\uDFB2" ,
  "1f3b3"  : "\uD83C\uDFB3" ,
  "1f3b4"  : "\uD83C\uDFB4" ,
  "1f3b5"  : "\uD83C\uDFB5" ,
  "1f3b6"  : "\uD83C\uDFB6" ,
  "1f3b7"  : "\uD83C\uDFB7" ,
  "1f3b8"  : "\uD83C\uDFB8" ,
  "1f3b9"  : "\uD83C\uDFB9" ,
  "1f3ba"  : "\uD83C\uDFBA" ,
  "1f3bb"  : "\uD83C\uDFBB" ,
  "1f3bc"  : "\uD83C\uDFBC" ,
  "1f3bd"  : "\uD83C\uDFBD" ,
  "1f3be"  : "\uD83C\uDFBE" ,
  "1f3bf"  : "\uD83C\uDFBF" ,
  "1f3c0"  : "\uD83C\uDFC0" ,
  "1f3c1"  : "\uD83C\uDFC1" ,
  "1f3c2"  : "\uD83C\uDFC2" ,
  "1f3c3"  : "\uD83C\uDFC3" ,
  "1f3c4"  : "\uD83C\uDFC4" ,
  "1f3c5"  : "\uD83C\uDFC5" ,
  "1f3c6"  : "\uD83C\uDFC6" ,
  "1f3c7"  : "\uD83C\uDFC7" ,
  "1f3c8"  : "\uD83C\uDFC8" ,
  "1f3c9"  : "\uD83C\uDFC9" ,
  "1f3ca"  : "\uD83C\uDFCA" ,
  "1f3cb"  : "\uD83C\uDFCB" ,
  "1f3cc"  : "\uD83C\uDFCC" ,
  "1f3cd"  : "\uD83C\uDFCD" ,
  "1f3ce"  : "\uD83C\uDFCE" ,
  "1f3cf"  : "\uD83C\uDFCF" ,
  "1f3d0"  : "\uD83C\uDFD0" ,
  "1f3d1"  : "\uD83C\uDFD1" ,
  "1f3d2"  : "\uD83C\uDFD2" ,
  "1f3d3"  : "\uD83C\uDFD3" ,
  "1f3d4"  : "\uD83C\uDFD4" ,
  "1f3d5"  : "\uD83C\uDFD5" ,
  "1f3d6"  : "\uD83C\uDFD6" ,
  "1f3d7"  : "\uD83C\uDFD7" ,
  "1f3d8"  : "\uD83C\uDFD8" ,
  "1f3d9"  : "\uD83C\uDFD9" ,
  "1f3da"  : "\uD83C\uDFDA" ,
  "1f3db"  : "\uD83C\uDFDB" ,
  "1f3dc"  : "\uD83C\uDFDC" ,
  "1f3dd"  : "\uD83C\uDFDD" ,
  "1f3de"  : "\uD83C\uDFDE" ,
  "1f3df"  : "\uD83C\uDFDF" ,
  "1f3e0"  : "\uD83C\uDFE0" ,
  "1f3e1"  : "\uD83C\uDFE1" ,
  "1f3e2"  : "\uD83C\uDFE2" ,
  "1f3e3"  : "\uD83C\uDFE3" ,
  "1f3e4"  : "\uD83C\uDFE4" ,
  "1f3e5"  : "\uD83C\uDFE5" ,
  "1f3e6"  : "\uD83C\uDFE6" ,
  "1f3e7"  : "\uD83C\uDFE7" ,
  "1f3e8"  : "\uD83C\uDFE8" ,
  "1f3e9"  : "\uD83C\uDFE9" ,
  "1f3ea"  : "\uD83C\uDFEA" ,
  "1f3eb"  : "\uD83C\uDFEB" ,
  "1f3ec"  : "\uD83C\uDFEC" ,
  "1f3ed"  : "\uD83C\uDFED" ,
  "1f3ee"  : "\uD83C\uDFEE" ,
  "1f3ef"  : "\uD83C\uDFEF" ,
  "1f3f0"  : "\uD83C\uDFF0" ,
  "1f3f3"  : "\uD83C\uDFF3" ,
  "1f3f4"  : "\uD83C\uDFF4" ,
  "1f3f5"  : "\uD83C\uDFF5" ,
  "1f3f7"  : "\uD83C\uDFF7" ,
  "1f3f8"  : "\uD83C\uDFF8" ,
  "1f3f9"  : "\uD83C\uDFF9" ,
  "1f3fa"  : "\uD83C\uDFFA" ,
  "1f3fb"  : "\uD83C\uDFFB" ,
  "1f3fc"  : "\uD83C\uDFFC" ,
  "1f3fd"  : "\uD83C\uDFFD" ,
  "1f3fe"  : "\uD83C\uDFFE" ,
  "1f3ff"  : "\uD83C\uDFFF" ,
  "1f400"  : "\uD83D\uDC00" ,
  "1f401"  : "\uD83D\uDC01" ,
  "1f402"  : "\uD83D\uDC02" ,
  "1f403"  : "\uD83D\uDC03" ,
  "1f404"  : "\uD83D\uDC04" ,
  "1f405"  : "\uD83D\uDC05" ,
  "1f406"  : "\uD83D\uDC06" ,
  "1f407"  : "\uD83D\uDC07" ,
  "1f408"  : "\uD83D\uDC08" ,
  "1f409"  : "\uD83D\uDC09" ,
  "1f40a"  : "\uD83D\uDC0A" ,
  "1f40b"  : "\uD83D\uDC0B" ,
  "1f40c"  : "\uD83D\uDC0C" ,
  "1f40d"  : "\uD83D\uDC0D" ,
  "1f40e"  : "\uD83D\uDC0E" ,
  "1f40f"  : "\uD83D\uDC0F" ,
  "1f410"  : "\uD83D\uDC10" ,
  "1f411"  : "\uD83D\uDC11" ,
  "1f412"  : "\uD83D\uDC12" ,
  "1f413"  : "\uD83D\uDC13" ,
  "1f414"  : "\uD83D\uDC14" ,
  "1f415"  : "\uD83D\uDC15" ,
  "1f416"  : "\uD83D\uDC16" ,
  "1f417"  : "\uD83D\uDC17" ,
  "1f418"  : "\uD83D\uDC18" ,
  "1f419"  : "\uD83D\uDC19" ,
  "1f41a"  : "\uD83D\uDC1A" ,
  "1f41b"  : "\uD83D\uDC1B" ,
  "1f41c"  : "\uD83D\uDC1C" ,
  "1f41d"  : "\uD83D\uDC1D" ,
  "1f41e"  : "\uD83D\uDC1E" ,
  "1f41f"  : "\uD83D\uDC1F" ,
  "1f420"  : "\uD83D\uDC20" ,
  "1f421"  : "\uD83D\uDC21" ,
  "1f422"  : "\uD83D\uDC22" ,
  "1f423"  : "\uD83D\uDC23" ,
  "1f424"  : "\uD83D\uDC24" ,
  "1f425"  : "\uD83D\uDC25" ,
  "1f426"  : "\uD83D\uDC26" ,
  "1f427"  : "\uD83D\uDC27" ,
  "1f428"  : "\uD83D\uDC28" ,
  "1f429"  : "\uD83D\uDC29" ,
  "1f42a"  : "\uD83D\uDC2A" ,
  "1f42b"  : "\uD83D\uDC2B" ,
  "1f42c"  : "\uD83D\uDC2C" ,
  "1f42d"  : "\uD83D\uDC2D" ,
  "1f42e"  : "\uD83D\uDC2E" ,
  "1f42f"  : "\uD83D\uDC2F" ,
  "1f430"  : "\uD83D\uDC30" ,
  "1f431"  : "\uD83D\uDC31" ,
  "1f432"  : "\uD83D\uDC32" ,
  "1f433"  : "\uD83D\uDC33" ,
  "1f434"  : "\uD83D\uDC34" ,
  "1f435"  : "\uD83D\uDC35" ,
  "1f436"  : "\uD83D\uDC36" ,
  "1f437"  : "\uD83D\uDC37" ,
  "1f438"  : "\uD83D\uDC38" ,
  "1f439"  : "\uD83D\uDC39" ,
  "1f43a"  : "\uD83D\uDC3A" ,
  "1f43b"  : "\uD83D\uDC3B" ,
  "1f43c"  : "\uD83D\uDC3C" ,
  "1f43d"  : "\uD83D\uDC3D" ,
  "1f43e"  : "\uD83D\uDC3E" ,
  "1f43f"  : "\uD83D\uDC3F" ,
  "1f440"  : "\uD83D\uDC40" ,
  "1f441"  : "\uD83D\uDC41" ,
  "1f442"  : "\uD83D\uDC42" ,
  "1f443"  : "\uD83D\uDC43" ,
  "1f444"  : "\uD83D\uDC44" ,
  "1f445"  : "\uD83D\uDC45" ,
  "1f446"  : "\uD83D\uDC46" ,
  "1f447"  : "\uD83D\uDC47" ,
  "1f448"  : "\uD83D\uDC48" ,
  "1f449"  : "\uD83D\uDC49" ,
  "1f44a"  : "\uD83D\uDC4A" ,
  "1f44b"  : "\uD83D\uDC4B" ,
  "1f44c"  : "\uD83D\uDC4C" ,
  "1f44d"  : "\uD83D\uDC4D" ,
  "1f44e"  : "\uD83D\uDC4E" ,
  "1f44f"  : "\uD83D\uDC4F" ,
  "1f450"  : "\uD83D\uDC50" ,
  "1f451"  : "\uD83D\uDC51" ,
  "1f452"  : "\uD83D\uDC52" ,
  "1f453"  : "\uD83D\uDC53" ,
  "1f454"  : "\uD83D\uDC54" ,
  "1f455"  : "\uD83D\uDC55" ,
  "1f456"  : "\uD83D\uDC56" ,
  "1f457"  : "\uD83D\uDC57" ,
  "1f458"  : "\uD83D\uDC58" ,
  "1f459"  : "\uD83D\uDC59" ,
  "1f45a"  : "\uD83D\uDC5A" ,
  "1f45b"  : "\uD83D\uDC5B" ,
  "1f45c"  : "\uD83D\uDC5C" ,
  "1f45d"  : "\uD83D\uDC5D" ,
  "1f45e"  : "\uD83D\uDC5E" ,
  "1f45f"  : "\uD83D\uDC5F" ,
  "1f460"  : "\uD83D\uDC60" ,
  "1f461"  : "\uD83D\uDC61" ,
  "1f462"  : "\uD83D\uDC62" ,
  "1f463"  : "\uD83D\uDC63" ,
  "1f464"  : "\uD83D\uDC64" ,
  "1f465"  : "\uD83D\uDC65" ,
  "1f466"  : "\uD83D\uDC66" ,
  "1f467"  : "\uD83D\uDC67" ,
  "1f468"  : "\uD83D\uDC68" ,
  "1f469"  : "\uD83D\uDC69" ,
  "1f46a"  : "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66",
  "1f46b"  : "\uD83D\uDC6B" ,
  "1f46c"  : "\uD83D\uDC6C" ,
  "1f46d"  : "\uD83D\uDC6D" ,
  "1f46e"  : "\uD83D\uDC6E" ,
  "1f46f"  : "\uD83D\uDC6F" ,
  "1f470"  : "\uD83D\uDC70" ,
  "1f471"  : "\uD83D\uDC71" ,
  "1f472"  : "\uD83D\uDC72" ,
  "1f473"  : "\uD83D\uDC73" ,
  "1f474"  : "\uD83D\uDC74" ,
  "1f475"  : "\uD83D\uDC75" ,
  "1f476"  : "\uD83D\uDC76" ,
  "1f477"  : "\uD83D\uDC77" ,
  "1f478"  : "\uD83D\uDC78" ,
  "1f479"  : "\uD83D\uDC79" ,
  "1f47a"  : "\uD83D\uDC7A" ,
  "1f47b"  : "\uD83D\uDC7B" ,
  "1f47c"  : "\uD83D\uDC7C" ,
  "1f47d"  : "\uD83D\uDC7D" ,
  "1f47e"  : "\uD83D\uDC7E" ,
  "1f47f"  : "\uD83D\uDC7F" ,
  "1f480"  : "\uD83D\uDC80" ,
  "1f481"  : "\uD83D\uDC81" ,
  "1f482"  : "\uD83D\uDC82" ,
  "1f483"  : "\uD83D\uDC83" ,
  "1f484"  : "\uD83D\uDC84" ,
  "1f485"  : "\uD83D\uDC85" ,
  "1f486"  : "\uD83D\uDC86" ,
  "1f487"  : "\uD83D\uDC87" ,
  "1f488"  : "\uD83D\uDC88" ,
  "1f489"  : "\uD83D\uDC89" ,
  "1f48a"  : "\uD83D\uDC8A" ,
  "1f48b"  : "\uD83D\uDC8B" ,
  "1f48c"  : "\uD83D\uDC8C" ,
  "1f48d"  : "\uD83D\uDC8D" ,
  "1f48e"  : "\uD83D\uDC8E" ,
  "1f48f"  : "\uD83D\uDC8F" ,
  "1f490"  : "\uD83D\uDC90" ,
  "1f491"  : "\uD83D\uDC91" ,
  "1f492"  : "\uD83D\uDC92" ,
  "1f493"  : "\uD83D\uDC93" ,
  "1f494"  : "\uD83D\uDC94" ,
  "1f495"  : "\uD83D\uDC95" ,
  "1f496"  : "\uD83D\uDC96" ,
  "1f497"  : "\uD83D\uDC97" ,
  "1f498"  : "\uD83D\uDC98" ,
  "1f499"  : "\uD83D\uDC99" ,
  "1f49a"  : "\uD83D\uDC9A" ,
  "1f49b"  : "\uD83D\uDC9B" ,
  "1f49c"  : "\uD83D\uDC9C" ,
  "1f49d"  : "\uD83D\uDC9D" ,
  "1f49e"  : "\uD83D\uDC9E" ,
  "1f49f"  : "\uD83D\uDC9F" ,
  "1f4a0"  : "\uD83D\uDCA0" ,
  "1f4a1"  : "\uD83D\uDCA1" ,
  "1f4a2"  : "\uD83D\uDCA2" ,
  "1f4a3"  : "\uD83D\uDCA3" ,
  "1f4a4"  : "\uD83D\uDCA4" ,
  "1f4a5"  : "\uD83D\uDCA5" ,
  "1f4a6"  : "\uD83D\uDCA6" ,
  "1f4a7"  : "\uD83D\uDCA7" ,
  "1f4a8"  : "\uD83D\uDCA8" ,
  "1f4a9"  : "\uD83D\uDCA9" ,
  "1f4aa"  : "\uD83D\uDCAA" ,
  "1f4ab"  : "\uD83D\uDCAB" ,
  "1f4ac"  : "\uD83D\uDCAC" ,
  "1f4ad"  : "\uD83D\uDCAD" ,
  "1f4ae"  : "\uD83D\uDCAE" ,
  "1f4af"  : "\uD83D\uDCAF" ,
  "1f4b0"  : "\uD83D\uDCB0" ,
  "1f4b1"  : "\uD83D\uDCB1" ,
  "1f4b2"  : "\uD83D\uDCB2" ,
  "1f4b3"  : "\uD83D\uDCB3" ,
  "1f4b4"  : "\uD83D\uDCB4" ,
  "1f4b5"  : "\uD83D\uDCB5" ,
  "1f4b6"  : "\uD83D\uDCB6" ,
  "1f4b7"  : "\uD83D\uDCB7" ,
  "1f4b8"  : "\uD83D\uDCB8" ,
  "1f4b9"  : "\uD83D\uDCB9" ,
  "1f4ba"  : "\uD83D\uDCBA" ,
  "1f4bb"  : "\uD83D\uDCBB" ,
  "1f4bc"  : "\uD83D\uDCBC" ,
  "1f4bd"  : "\uD83D\uDCBD" ,
  "1f4be"  : "\uD83D\uDCBE" ,
  "1f4bf"  : "\uD83D\uDCBF" ,
  "1f4c0"  : "\uD83D\uDCC0" ,
  "1f4c1"  : "\uD83D\uDCC1" ,
  "1f4c2"  : "\uD83D\uDCC2" ,
  "1f4c3"  : "\uD83D\uDCC3" ,
  "1f4c4"  : "\uD83D\uDCC4" ,
  "1f4c5"  : "\uD83D\uDCC5" ,
  "1f4c6"  : "\uD83D\uDCC6" ,
  "1f4c7"  : "\uD83D\uDCC7" ,
  "1f4c8"  : "\uD83D\uDCC8" ,
  "1f4c9"  : "\uD83D\uDCC9" ,
  "1f4ca"  : "\uD83D\uDCCA" ,
  "1f4cb"  : "\uD83D\uDCCB" ,
  "1f4cc"  : "\uD83D\uDCCC" ,
  "1f4cd"  : "\uD83D\uDCCD" ,
  "1f4ce"  : "\uD83D\uDCCE" ,
  "1f4cf"  : "\uD83D\uDCCF" ,
  "1f4d0"  : "\uD83D\uDCD0" ,
  "1f4d1"  : "\uD83D\uDCD1" ,
  "1f4d2"  : "\uD83D\uDCD2" ,
  "1f4d3"  : "\uD83D\uDCD3" ,
  "1f4d4"  : "\uD83D\uDCD4" ,
  "1f4d5"  : "\uD83D\uDCD5" ,
  "1f4d6"  : "\uD83D\uDCD6" ,
  "1f4d7"  : "\uD83D\uDCD7" ,
  "1f4d8"  : "\uD83D\uDCD8" ,
  "1f4d9"  : "\uD83D\uDCD9" ,
  "1f4da"  : "\uD83D\uDCDA" ,
  "1f4db"  : "\uD83D\uDCDB" ,
  "1f4dc"  : "\uD83D\uDCDC" ,
  "1f4dd"  : "\uD83D\uDCDD" ,
  "1f4de"  : "\uD83D\uDCDE" ,
  "1f4df"  : "\uD83D\uDCDF" ,
  "1f4e0"  : "\uD83D\uDCE0" ,
  "1f4e1"  : "\uD83D\uDCE1" ,
  "1f4e2"  : "\uD83D\uDCE2" ,
  "1f4e3"  : "\uD83D\uDCE3" ,
  "1f4e4"  : "\uD83D\uDCE4" ,
  "1f4e5"  : "\uD83D\uDCE5" ,
  "1f4e6"  : "\uD83D\uDCE6" ,
  "1f4e7"  : "\uD83D\uDCE7" ,
  "1f4e8"  : "\uD83D\uDCE8" ,
  "1f4e9"  : "\uD83D\uDCE9" ,
  "1f4ea"  : "\uD83D\uDCEA" ,
  "1f4eb"  : "\uD83D\uDCEB" ,
  "1f4ec"  : "\uD83D\uDCEC" ,
  "1f4ed"  : "\uD83D\uDCED" ,
  "1f4ee"  : "\uD83D\uDCEE" ,
  "1f4ef"  : "\uD83D\uDCEF" ,
  "1f4f0"  : "\uD83D\uDCF0" ,
  "1f4f1"  : "\uD83D\uDCF1" ,
  "1f4f2"  : "\uD83D\uDCF2" ,
  "1f4f3"  : "\uD83D\uDCF3" ,
  "1f4f4"  : "\uD83D\uDCF4" ,
  "1f4f5"  : "\uD83D\uDCF5" ,
  "1f4f6"  : "\uD83D\uDCF6" ,
  "1f4f7"  : "\uD83D\uDCF7" ,
  "1f4f8"  : "\uD83D\uDCF8" ,
  "1f4f9"  : "\uD83D\uDCF9" ,
  "1f4fa"  : "\uD83D\uDCFA" ,
  "1f4fb"  : "\uD83D\uDCFB" ,
  "1f4fc"  : "\uD83D\uDCFC" ,
  "1f4fd"  : "\uD83D\uDCFD" ,
  "1f4ff"  : "\uD83D\uDCFF" ,
  "1f500"  : "\uD83D\uDD00" ,
  "1f501"  : "\uD83D\uDD01" ,
  "1f502"  : "\uD83D\uDD02" ,
  "1f503"  : "\uD83D\uDD03" ,
  "1f504"  : "\uD83D\uDD04" ,
  "1f505"  : "\uD83D\uDD05" ,
  "1f506"  : "\uD83D\uDD06" ,
  "1f507"  : "\uD83D\uDD07" ,
  "1f508"  : "\uD83D\uDD08" ,
  "1f509"  : "\uD83D\uDD09" ,
  "1f50a"  : "\uD83D\uDD0A" ,
  "1f50b"  : "\uD83D\uDD0B" ,
  "1f50c"  : "\uD83D\uDD0C" ,
  "1f50d"  : "\uD83D\uDD0D" ,
  "1f50e"  : "\uD83D\uDD0E" ,
  "1f50f"  : "\uD83D\uDD0F" ,
  "1f510"  : "\uD83D\uDD10" ,
  "1f511"  : "\uD83D\uDD11" ,
  "1f512"  : "\uD83D\uDD12" ,
  "1f513"  : "\uD83D\uDD13" ,
  "1f514"  : "\uD83D\uDD14" ,
  "1f515"  : "\uD83D\uDD15" ,
  "1f516"  : "\uD83D\uDD16" ,
  "1f517"  : "\uD83D\uDD17" ,
  "1f518"  : "\uD83D\uDD18" ,
  "1f519"  : "\uD83D\uDD19" ,
  "1f51a"  : "\uD83D\uDD1A" ,
  "1f51b"  : "\uD83D\uDD1B" ,
  "1f51c"  : "\uD83D\uDD1C" ,
  "1f51d"  : "\uD83D\uDD1D" ,
  "1f51e"  : "\uD83D\uDD1E" ,
  "1f51f"  : "\uD83D\uDD1F" ,
  "1f520"  : "\uD83D\uDD20" ,
  "1f521"  : "\uD83D\uDD21" ,
  "1f522"  : "\uD83D\uDD22" ,
  "1f523"  : "\uD83D\uDD23" ,
  "1f524"  : "\uD83D\uDD24" ,
  "1f525"  : "\uD83D\uDD25" ,
  "1f526"  : "\uD83D\uDD26" ,
  "1f527"  : "\uD83D\uDD27" ,
  "1f528"  : "\uD83D\uDD28" ,
  "1f529"  : "\uD83D\uDD29" ,
  "1f52a"  : "\uD83D\uDD2A" ,
  "1f52b"  : "\uD83D\uDD2B" ,
  "1f52c"  : "\uD83D\uDD2C" ,
  "1f52d"  : "\uD83D\uDD2D" ,
  "1f52e"  : "\uD83D\uDD2E" ,
  "1f52f"  : "\uD83D\uDD2F" ,
  "1f530"  : "\uD83D\uDD30" ,
  "1f531"  : "\uD83D\uDD31" ,
  "1f532"  : "\uD83D\uDD32" ,
  "1f533"  : "\uD83D\uDD33" ,
  "1f534"  : "\uD83D\uDD34" ,
  "1f535"  : "\uD83D\uDD35" ,
  "1f536"  : "\uD83D\uDD36" ,
  "1f537"  : "\uD83D\uDD37" ,
  "1f538"  : "\uD83D\uDD38" ,
  "1f539"  : "\uD83D\uDD39" ,
  "1f53a"  : "\uD83D\uDD3A" ,
  "1f53b"  : "\uD83D\uDD3B" ,
  "1f53c"  : "\uD83D\uDD3C" ,
  "1f53d"  : "\uD83D\uDD3D" ,
  "1f549"  : "\uD83D\uDD49" ,
  "1f54a"  : "\uD83D\uDD4A" ,
  "1f54b"  : "\uD83D\uDD4B" ,
  "1f54c"  : "\uD83D\uDD4C" ,
  "1f54d"  : "\uD83D\uDD4D" ,
  "1f54e"  : "\uD83D\uDD4E" ,
  "1f550"  : "\uD83D\uDD50" ,
  "1f551"  : "\uD83D\uDD51" ,
  "1f552"  : "\uD83D\uDD52" ,
  "1f553"  : "\uD83D\uDD53" ,
  "1f554"  : "\uD83D\uDD54" ,
  "1f555"  : "\uD83D\uDD55" ,
  "1f556"  : "\uD83D\uDD56" ,
  "1f557"  : "\uD83D\uDD57" ,
  "1f558"  : "\uD83D\uDD58" ,
  "1f559"  : "\uD83D\uDD59" ,
  "1f55a"  : "\uD83D\uDD5A" ,
  "1f55b"  : "\uD83D\uDD5B" ,
  "1f55c"  : "\uD83D\uDD5C" ,
  "1f55d"  : "\uD83D\uDD5D" ,
  "1f55e"  : "\uD83D\uDD5E" ,
  "1f55f"  : "\uD83D\uDD5F" ,
  "1f560"  : "\uD83D\uDD60" ,
  "1f561"  : "\uD83D\uDD61" ,
  "1f562"  : "\uD83D\uDD62" ,
  "1f563"  : "\uD83D\uDD63" ,
  "1f564"  : "\uD83D\uDD64" ,
  "1f565"  : "\uD83D\uDD65" ,
  "1f566"  : "\uD83D\uDD66" ,
  "1f567"  : "\uD83D\uDD67" ,
  "1f56f"  : "\uD83D\uDD6F" ,
  "1f570"  : "\uD83D\uDD70" ,
  "1f573"  : "\uD83D\uDD73" ,
  "1f574"  : "\uD83D\uDD74" ,
  "1f575"  : "\uD83D\uDD75" ,
  "1f576"  : "\uD83D\uDD76" ,
  "1f577"  : "\uD83D\uDD77" ,
  "1f578"  : "\uD83D\uDD78" ,
  "1f579"  : "\uD83D\uDD79" ,
  "1f587"  : "\uD83D\uDD87" ,
  "1f58a"  : "\uD83D\uDD8A" ,
  "1f58b"  : "\uD83D\uDD8B" ,
  "1f58c"  : "\uD83D\uDD8C" ,
  "1f58d"  : "\uD83D\uDD8D" ,
  "1f590"  : "\uD83D\uDD90" ,
  "1f595"  : "\uD83D\uDD95" ,
  "1f596"  : "\uD83D\uDD96" ,
  "1f5a5"  : "\uD83D\uDDA5" ,
  "1f5a8"  : "\uD83D\uDDA8" ,
  "1f5b1"  : "\uD83D\uDDB1" ,
  "1f5b2"  : "\uD83D\uDDB2" ,
  "1f5bc"  : "\uD83D\uDDBC" ,
  "1f5c2"  : "\uD83D\uDDC2" ,
  "1f5c3"  : "\uD83D\uDDC3" ,
  "1f5c4"  : "\uD83D\uDDC4" ,
  "1f5d1"  : "\uD83D\uDDD1" ,
  "1f5d2"  : "\uD83D\uDDD2" ,
  "1f5d3"  : "\uD83D\uDDD3" ,
  "1f5dc"  : "\uD83D\uDDDC" ,
  "1f5dd"  : "\uD83D\uDDDD" ,
  "1f5de"  : "\uD83D\uDDDE" ,
  "1f5e1"  : "\uD83D\uDDE1" ,
  "1f5e3"  : "\uD83D\uDDE3" ,
  "1f5e8"  : "\uD83D\uDDE8" ,
  "1f5ef"  : "\uD83D\uDDEF" ,
  "1f5f3"  : "\uD83D\uDDF3" ,
  "1f5fa"  : "\uD83D\uDDFA" ,
  "1f5fb"  : "\uD83D\uDDFB" ,
  "1f5fc"  : "\uD83D\uDDFC" ,
  "1f5fd"  : "\uD83D\uDDFD" ,
  "1f5fe"  : "\uD83D\uDDFE" ,
  "1f5ff"  : "\uD83D\uDDFF" ,
  "1f600"  : "\uD83D\uDE00" ,
  "1f601"  : "\uD83D\uDE01" ,
  "1f602"  : "\uD83D\uDE02" ,
  "1f603"  : "\uD83D\uDE03" ,
  "1f604"  : "\uD83D\uDE04" ,
  "1f605"  : "\uD83D\uDE05" ,
  "1f606"  : "\uD83D\uDE06" ,
  "1f607"  : "\uD83D\uDE07" ,
  "1f608"  : "\uD83D\uDE08" ,
  "1f609"  : "\uD83D\uDE09" ,
  "1f60a"  : "\uD83D\uDE0A" ,
  "1f60b"  : "\uD83D\uDE0B" ,
  "1f60c"  : "\uD83D\uDE0C" ,
  "1f60d"  : "\uD83D\uDE0D" ,
  "1f60e"  : "\uD83D\uDE0E" ,
  "1f60f"  : "\uD83D\uDE0F" ,
  "1f610"  : "\uD83D\uDE10" ,
  "1f611"  : "\uD83D\uDE11" ,
  "1f612"  : "\uD83D\uDE12" ,
  "1f613"  : "\uD83D\uDE13" ,
  "1f614"  : "\uD83D\uDE14" ,
  "1f615"  : "\uD83D\uDE15" ,
  "1f616"  : "\uD83D\uDE16" ,
  "1f617"  : "\uD83D\uDE17" ,
  "1f618"  : "\uD83D\uDE18" ,
  "1f619"  : "\uD83D\uDE19" ,
  "1f61a"  : "\uD83D\uDE1A" ,
  "1f61b"  : "\uD83D\uDE1B" ,
  "1f61c"  : "\uD83D\uDE1C" ,
  "1f61d"  : "\uD83D\uDE1D" ,
  "1f61e"  : "\uD83D\uDE1E" ,
  "1f61f"  : "\uD83D\uDE1F" ,
  "1f620"  : "\uD83D\uDE20" ,
  "1f621"  : "\uD83D\uDE21" ,
  "1f622"  : "\uD83D\uDE22" ,
  "1f623"  : "\uD83D\uDE23" ,
  "1f624"  : "\uD83D\uDE24" ,
  "1f625"  : "\uD83D\uDE25" ,
  "1f626"  : "\uD83D\uDE26" ,
  "1f627"  : "\uD83D\uDE27" ,
  "1f628"  : "\uD83D\uDE28" ,
  "1f629"  : "\uD83D\uDE29" ,
  "1f62a"  : "\uD83D\uDE2A" ,
  "1f62b"  : "\uD83D\uDE2B" ,
  "1f62c"  : "\uD83D\uDE2C" ,
  "1f62d"  : "\uD83D\uDE2D" ,
  "1f62e"  : "\uD83D\uDE2E" ,
  "1f62f"  : "\uD83D\uDE2F" ,
  "1f630"  : "\uD83D\uDE30" ,
  "1f631"  : "\uD83D\uDE31" ,
  "1f632"  : "\uD83D\uDE32" ,
  "1f633"  : "\uD83D\uDE33" ,
  "1f634"  : "\uD83D\uDE34" ,
  "1f635"  : "\uD83D\uDE35" ,
  "1f636"  : "\uD83D\uDE36" ,
  "1f637"  : "\uD83D\uDE37" ,
  "1f638"  : "\uD83D\uDE38" ,
  "1f639"  : "\uD83D\uDE39" ,
  "1f63a"  : "\uD83D\uDE3A" ,
  "1f63b"  : "\uD83D\uDE3B" ,
  "1f63c"  : "\uD83D\uDE3C" ,
  "1f63d"  : "\uD83D\uDE3D" ,
  "1f63e"  : "\uD83D\uDE3E" ,
  "1f63f"  : "\uD83D\uDE3F" ,
  "1f640"  : "\uD83D\uDE40" ,
  "1f641"  : "\uD83D\uDE41" ,
  "1f642"  : "\uD83D\uDE42" ,
  "1f643"  : "\uD83D\uDE43" ,
  "1f644"  : "\uD83D\uDE44" ,
  "1f645"  : "\uD83D\uDE45" ,
  "1f646"  : "\uD83D\uDE46" ,
  "1f647"  : "\uD83D\uDE47" ,
  "1f648"  : "\uD83D\uDE48" ,
  "1f649"  : "\uD83D\uDE49" ,
  "1f64a"  : "\uD83D\uDE4A" ,
  "1f64b"  : "\uD83D\uDE4B" ,
  "1f64c"  : "\uD83D\uDE4C" ,
  "1f64d"  : "\uD83D\uDE4D" ,
  "1f64e"  : "\uD83D\uDE4E" ,
  "1f64f"  : "\uD83D\uDE4F" ,
  "1f680"  : "\uD83D\uDE80" ,
  "1f681"  : "\uD83D\uDE81" ,
  "1f682"  : "\uD83D\uDE82" ,
  "1f683"  : "\uD83D\uDE83" ,
  "1f684"  : "\uD83D\uDE84" ,
  "1f685"  : "\uD83D\uDE85" ,
  "1f686"  : "\uD83D\uDE86" ,
  "1f687"  : "\uD83D\uDE87" ,
  "1f688"  : "\uD83D\uDE88" ,
  "1f689"  : "\uD83D\uDE89" ,
  "1f68a"  : "\uD83D\uDE8A" ,
  "1f68b"  : "\uD83D\uDE8B" ,
  "1f68c"  : "\uD83D\uDE8C" ,
  "1f68d"  : "\uD83D\uDE8D" ,
  "1f68e"  : "\uD83D\uDE8E" ,
  "1f68f"  : "\uD83D\uDE8F" ,
  "1f690"  : "\uD83D\uDE90" ,
  "1f691"  : "\uD83D\uDE91" ,
  "1f692"  : "\uD83D\uDE92" ,
  "1f693"  : "\uD83D\uDE93" ,
  "1f694"  : "\uD83D\uDE94" ,
  "1f695"  : "\uD83D\uDE95" ,
  "1f696"  : "\uD83D\uDE96" ,
  "1f697"  : "\uD83D\uDE97" ,
  "1f698"  : "\uD83D\uDE98" ,
  "1f699"  : "\uD83D\uDE99" ,
  "1f69a"  : "\uD83D\uDE9A" ,
  "1f69b"  : "\uD83D\uDE9B" ,
  "1f69c"  : "\uD83D\uDE9C" ,
  "1f69d"  : "\uD83D\uDE9D" ,
  "1f69e"  : "\uD83D\uDE9E" ,
  "1f69f"  : "\uD83D\uDE9F" ,
  "1f6a0"  : "\uD83D\uDEA0" ,
  "1f6a1"  : "\uD83D\uDEA1" ,
  "1f6a2"  : "\uD83D\uDEA2" ,
  "1f6a3"  : "\uD83D\uDEA3" ,
  "1f6a4"  : "\uD83D\uDEA4" ,
  "1f6a5"  : "\uD83D\uDEA5" ,
  "1f6a6"  : "\uD83D\uDEA6" ,
  "1f6a7"  : "\uD83D\uDEA7" ,
  "1f6a8"  : "\uD83D\uDEA8" ,
  "1f6a9"  : "\uD83D\uDEA9" ,
  "1f6aa"  : "\uD83D\uDEAA" ,
  "1f6ab"  : "\uD83D\uDEAB" ,
  "1f6ac"  : "\uD83D\uDEAC" ,
  "1f6ad"  : "\uD83D\uDEAD" ,
  "1f6ae"  : "\uD83D\uDEAE" ,
  "1f6af"  : "\uD83D\uDEAF" ,
  "1f6b0"  : "\uD83D\uDEB0" ,
  "1f6b1"  : "\uD83D\uDEB1" ,
  "1f6b2"  : "\uD83D\uDEB2" ,
  "1f6b3"  : "\uD83D\uDEB3" ,
  "1f6b4"  : "\uD83D\uDEB4" ,
  "1f6b5"  : "\uD83D\uDEB5" ,
  "1f6b6"  : "\uD83D\uDEB6" ,
  "1f6b7"  : "\uD83D\uDEB7" ,
  "1f6b8"  : "\uD83D\uDEB8" ,
  "1f6b9"  : "\uD83D\uDEB9" ,
  "1f6ba"  : "\uD83D\uDEBA" ,
  "1f6bb"  : "\uD83D\uDEBB" ,
  "1f6bc"  : "\uD83D\uDEBC" ,
  "1f6bd"  : "\uD83D\uDEBD" ,
  "1f6be"  : "\uD83D\uDEBE" ,
  "1f6bf"  : "\uD83D\uDEBF" ,
  "1f6c0"  : "\uD83D\uDEC0" ,
  "1f6c1"  : "\uD83D\uDEC1" ,
  "1f6c2"  : "\uD83D\uDEC2" ,
  "1f6c3"  : "\uD83D\uDEC3" ,
  "1f6c4"  : "\uD83D\uDEC4" ,
  "1f6c5"  : "\uD83D\uDEC5" ,
  "1f6cb"  : "\uD83D\uDECB" ,
  "1f6cc"  : "\uD83D\uDECC" ,
  "1f6cd"  : "\uD83D\uDECD" ,
  "1f6ce"  : "\uD83D\uDECE" ,
  "1f6cf"  : "\uD83D\uDECF" ,
  "1f6d0"  : "\uD83D\uDED0" ,
  "1f6e0"  : "\uD83D\uDEE0" ,
  "1f6e1"  : "\uD83D\uDEE1" ,
  "1f6e2"  : "\uD83D\uDEE2" ,
  "1f6e3"  : "\uD83D\uDEE3" ,
  "1f6e4"  : "\uD83D\uDEE4" ,
  "1f6e5"  : "\uD83D\uDEE5" ,
  "1f6e9"  : "\uD83D\uDEE9" ,
  "1f6eb"  : "\uD83D\uDEEB" ,
  "1f6ec"  : "\uD83D\uDEEC" ,
  "1f6f0"  : "\uD83D\uDEF0" ,
  "1f6f3"  : "\uD83D\uDEF3" ,
  "1f910"  : "\uD83E\uDD10" ,
  "1f911"  : "\uD83E\uDD11" ,
  "1f912"  : "\uD83E\uDD12" ,
  "1f913"  : "\uD83E\uDD13" ,
  "1f914"  : "\uD83E\uDD14" ,
  "1f915"  : "\uD83E\uDD15" ,
  "1f916"  : "\uD83E\uDD16" ,
  "1f917"  : "\uD83E\uDD17" ,
  "1f918"  : "\uD83E\uDD18" ,
  "1f980"  : "\uD83E\uDD80" ,
  "1f981"  : "\uD83E\uDD81" ,
  "1f982"  : "\uD83E\uDD82" ,
  "1f983"  : "\uD83E\uDD83" ,
  "1f984"  : "\uD83E\uDD84" ,
  "1f9c0"  : "\uD83E\uDDC0" ,
  "0023-20e3" : "\u0023\uFE0F\u20E3",
  "002a-20e3" : "\u002A\u20E3" ,
  "0030-20e3" : "\u0030\uFE0F\u20E3",
  "0031-20e3" : "\u0031\uFE0F\u20E3",
  "0032-20e3" : "\u0032\uFE0F\u20E3",
  "0033-20e3" : "\u0033\uFE0F\u20E3",
  "0034-20e3" : "\u0034\uFE0F\u20E3",
  "0035-20e3" : "\u0035\uFE0F\u20E3",
  "0036-20e3" : "\u0036\uFE0F\u20E3",
  "0037-20e3" : "\u0037\uFE0F\u20E3",
  "0038-20e3" : "\u0038\uFE0F\u20E3",
  "0039-20e3" : "\u0039\uFE0F\u20E3",
  "1f1e6-1f1e8"  : "\uD83C\uDDE6\uD83C\uDDE8" ,
  "1f1e6-1f1e9"  : "\uD83C\uDDE6\uD83C\uDDE9" ,
  "1f1e6-1f1ea"  : "\uD83C\uDDE6\uD83C\uDDEA" ,
  "1f1e6-1f1eb"  : "\uD83C\uDDE6\uD83C\uDDEB" ,
  "1f1e6-1f1ec"  : "\uD83C\uDDE6\uD83C\uDDEC" ,
  "1f1e6-1f1ee"  : "\uD83C\uDDE6\uD83C\uDDEE" ,
  "1f1e6-1f1f1"  : "\uD83C\uDDE6\uD83C\uDDF1" ,
  "1f1e6-1f1f2"  : "\uD83C\uDDE6\uD83C\uDDF2" ,
  "1f1e6-1f1f4"  : "\uD83C\uDDE6\uD83C\uDDF4" ,
  "1f1e6-1f1f6"  : "\uD83C\uDDE6\uD83C\uDDF6" ,
  "1f1e6-1f1f7"  : "\uD83C\uDDE6\uD83C\uDDF7" ,
  "1f1e6-1f1f8"  : "\uD83C\uDDE6\uD83C\uDDF8" ,
  "1f1e6-1f1f9"  : "\uD83C\uDDE6\uD83C\uDDF9" ,
  "1f1e6-1f1fa"  : "\uD83C\uDDE6\uD83C\uDDFA" ,
  "1f1e6-1f1fc"  : "\uD83C\uDDE6\uD83C\uDDFC" ,
  "1f1e6-1f1fd"  : "\uD83C\uDDE6\uD83C\uDDFD" ,
  "1f1e6-1f1ff"  : "\uD83C\uDDE6\uD83C\uDDFF" ,
  "1f1e7-1f1e6"  : "\uD83C\uDDE7\uD83C\uDDE6" ,
  "1f1e7-1f1e7"  : "\uD83C\uDDE7\uD83C\uDDE7" ,
  "1f1e7-1f1e9"  : "\uD83C\uDDE7\uD83C\uDDE9" ,
  "1f1e7-1f1ea"  : "\uD83C\uDDE7\uD83C\uDDEA" ,
  "1f1e7-1f1eb"  : "\uD83C\uDDE7\uD83C\uDDEB" ,
  "1f1e7-1f1ec"  : "\uD83C\uDDE7\uD83C\uDDEC" ,
  "1f1e7-1f1ed"  : "\uD83C\uDDE7\uD83C\uDDED" ,
  "1f1e7-1f1ee"  : "\uD83C\uDDE7\uD83C\uDDEE" ,
  "1f1e7-1f1ef"  : "\uD83C\uDDE7\uD83C\uDDEF" ,
  "1f1e7-1f1f1"  : "\uD83C\uDDE7\uD83C\uDDF1" ,
  "1f1e7-1f1f2"  : "\uD83C\uDDE7\uD83C\uDDF2" ,
  "1f1e7-1f1f3"  : "\uD83C\uDDE7\uD83C\uDDF3" ,
  "1f1e7-1f1f4"  : "\uD83C\uDDE7\uD83C\uDDF4" ,
  "1f1e7-1f1f6"  : "\uD83C\uDDE7\uD83C\uDDF6" ,
  "1f1e7-1f1f7"  : "\uD83C\uDDE7\uD83C\uDDF7" ,
  "1f1e7-1f1f8"  : "\uD83C\uDDE7\uD83C\uDDF8" ,
  "1f1e7-1f1f9"  : "\uD83C\uDDE7\uD83C\uDDF9" ,
  "1f1e7-1f1fb"  : "\uD83C\uDDE7\uD83C\uDDFB" ,
  "1f1e7-1f1fc"  : "\uD83C\uDDE7\uD83C\uDDFC" ,
  "1f1e7-1f1fe"  : "\uD83C\uDDE7\uD83C\uDDFE" ,
  "1f1e7-1f1ff"  : "\uD83C\uDDE7\uD83C\uDDFF" ,
  "1f1e8-1f1e6"  : "\uD83C\uDDE8\uD83C\uDDE6" ,
  "1f1e8-1f1e8"  : "\uD83C\uDDE8\uD83C\uDDE8" ,
  "1f1e8-1f1e9"  : "\uD83C\uDDE8\uD83C\uDDE9" ,
  "1f1e8-1f1eb"  : "\uD83C\uDDE8\uD83C\uDDEB" ,
  "1f1e8-1f1ec"  : "\uD83C\uDDE8\uD83C\uDDEC" ,
  "1f1e8-1f1ed"  : "\uD83C\uDDE8\uD83C\uDDED" ,
  "1f1e8-1f1ee"  : "\uD83C\uDDE8\uD83C\uDDEE" ,
  "1f1e8-1f1f0"  : "\uD83C\uDDE8\uD83C\uDDF0" ,
  "1f1e8-1f1f1"  : "\uD83C\uDDE8\uD83C\uDDF1" ,
  "1f1e8-1f1f2"  : "\uD83C\uDDE8\uD83C\uDDF2" ,
  "1f1e8-1f1f3"  : "\uD83C\uDDE8\uD83C\uDDF3" ,
  "1f1e8-1f1f4"  : "\uD83C\uDDE8\uD83C\uDDF4" ,
  "1f1e8-1f1f5"  : "\uD83C\uDDE8\uD83C\uDDF5" ,
  "1f1e8-1f1f7"  : "\uD83C\uDDE8\uD83C\uDDF7" ,
  "1f1e8-1f1fa"  : "\uD83C\uDDE8\uD83C\uDDFA" ,
  "1f1e8-1f1fb"  : "\uD83C\uDDE8\uD83C\uDDFB" ,
  "1f1e8-1f1fc"  : "\uD83C\uDDE8\uD83C\uDDFC" ,
  "1f1e8-1f1fd"  : "\uD83C\uDDE8\uD83C\uDDFD" ,
  "1f1e8-1f1fe"  : "\uD83C\uDDE8\uD83C\uDDFE" ,
  "1f1e8-1f1ff"  : "\uD83C\uDDE8\uD83C\uDDFF" ,
  "1f1e9-1f1ea"  : "\uD83C\uDDE9\uD83C\uDDEA" ,
  "1f1e9-1f1ec"  : "\uD83C\uDDE9\uD83C\uDDEC" ,
  "1f1e9-1f1ef"  : "\uD83C\uDDE9\uD83C\uDDEF" ,
  "1f1e9-1f1f0"  : "\uD83C\uDDE9\uD83C\uDDF0" ,
  "1f1e9-1f1f2"  : "\uD83C\uDDE9\uD83C\uDDF2" ,
  "1f1e9-1f1f4"  : "\uD83C\uDDE9\uD83C\uDDF4" ,
  "1f1e9-1f1ff"  : "\uD83C\uDDE9\uD83C\uDDFF" ,
  "1f1ea-1f1e6"  : "\uD83C\uDDEA\uD83C\uDDE6" ,
  "1f1ea-1f1e8"  : "\uD83C\uDDEA\uD83C\uDDE8" ,
  "1f1ea-1f1ea"  : "\uD83C\uDDEA\uD83C\uDDEA" ,
  "1f1ea-1f1ec"  : "\uD83C\uDDEA\uD83C\uDDEC" ,
  "1f1ea-1f1ed"  : "\uD83C\uDDEA\uD83C\uDDED" ,
  "1f1ea-1f1f7"  : "\uD83C\uDDEA\uD83C\uDDF7" ,
  "1f1ea-1f1f8"  : "\uD83C\uDDEA\uD83C\uDDF8" ,
  "1f1ea-1f1f9"  : "\uD83C\uDDEA\uD83C\uDDF9" ,
  "1f1ea-1f1fa"  : "\uD83C\uDDEA\uD83C\uDDFA" ,
  "1f1eb-1f1ee"  : "\uD83C\uDDEB\uD83C\uDDEE" ,
  "1f1eb-1f1ef"  : "\uD83C\uDDEB\uD83C\uDDEF" ,
  "1f1eb-1f1f0"  : "\uD83C\uDDEB\uD83C\uDDF0" ,
  "1f1eb-1f1f2"  : "\uD83C\uDDEB\uD83C\uDDF2" ,
  "1f1eb-1f1f4"  : "\uD83C\uDDEB\uD83C\uDDF4" ,
  "1f1eb-1f1f7"  : "\uD83C\uDDEB\uD83C\uDDF7" ,
  "1f1ec-1f1e6"  : "\uD83C\uDDEC\uD83C\uDDE6" ,
  "1f1ec-1f1e7"  : "\uD83C\uDDEC\uD83C\uDDE7" ,
  "1f1ec-1f1e9"  : "\uD83C\uDDEC\uD83C\uDDE9" ,
  "1f1ec-1f1ea"  : "\uD83C\uDDEC\uD83C\uDDEA" ,
  "1f1ec-1f1eb"  : "\uD83C\uDDEC\uD83C\uDDEB" ,
  "1f1ec-1f1ec"  : "\uD83C\uDDEC\uD83C\uDDEC" ,
  "1f1ec-1f1ed"  : "\uD83C\uDDEC\uD83C\uDDED" ,
  "1f1ec-1f1ee"  : "\uD83C\uDDEC\uD83C\uDDEE" ,
  "1f1ec-1f1f1"  : "\uD83C\uDDEC\uD83C\uDDF1" ,
  "1f1ec-1f1f2"  : "\uD83C\uDDEC\uD83C\uDDF2" ,
  "1f1ec-1f1f3"  : "\uD83C\uDDEC\uD83C\uDDF3" ,
  "1f1ec-1f1f5"  : "\uD83C\uDDEC\uD83C\uDDF5" ,
  "1f1ec-1f1f6"  : "\uD83C\uDDEC\uD83C\uDDF6" ,
  "1f1ec-1f1f7"  : "\uD83C\uDDEC\uD83C\uDDF7" ,
  "1f1ec-1f1f8"  : "\uD83C\uDDEC\uD83C\uDDF8" ,
  "1f1ec-1f1f9"  : "\uD83C\uDDEC\uD83C\uDDF9" ,
  "1f1ec-1f1fa"  : "\uD83C\uDDEC\uD83C\uDDFA" ,
  "1f1ec-1f1fc"  : "\uD83C\uDDEC\uD83C\uDDFC" ,
  "1f1ec-1f1fe"  : "\uD83C\uDDEC\uD83C\uDDFE" ,
  "1f1ed-1f1f0"  : "\uD83C\uDDED\uD83C\uDDF0" ,
  "1f1ed-1f1f2"  : "\uD83C\uDDED\uD83C\uDDF2" ,
  "1f1ed-1f1f3"  : "\uD83C\uDDED\uD83C\uDDF3" ,
  "1f1ed-1f1f7"  : "\uD83C\uDDED\uD83C\uDDF7" ,
  "1f1ed-1f1f9"  : "\uD83C\uDDED\uD83C\uDDF9" ,
  "1f1ed-1f1fa"  : "\uD83C\uDDED\uD83C\uDDFA" ,
  "1f1ee-1f1e8"  : "\uD83C\uDDEE\uD83C\uDDE8" ,
  "1f1ee-1f1e9"  : "\uD83C\uDDEE\uD83C\uDDE9" ,
  "1f1ee-1f1ea"  : "\uD83C\uDDEE\uD83C\uDDEA" ,
  "1f1ee-1f1f1"  : "\uD83C\uDDEE\uD83C\uDDF1" ,
  "1f1ee-1f1f2"  : "\uD83C\uDDEE\uD83C\uDDF2" ,
  "1f1ee-1f1f3"  : "\uD83C\uDDEE\uD83C\uDDF3" ,
  "1f1ee-1f1f4"  : "\uD83C\uDDEE\uD83C\uDDF4" ,
  "1f1ee-1f1f6"  : "\uD83C\uDDEE\uD83C\uDDF6" ,
  "1f1ee-1f1f7"  : "\uD83C\uDDEE\uD83C\uDDF7" ,
  "1f1ee-1f1f8"  : "\uD83C\uDDEE\uD83C\uDDF8" ,
  "1f1ee-1f1f9"  : "\uD83C\uDDEE\uD83C\uDDF9" ,
  "1f1ef-1f1ea"  : "\uD83C\uDDEF\uD83C\uDDEA" ,
  "1f1ef-1f1f2"  : "\uD83C\uDDEF\uD83C\uDDF2" ,
  "1f1ef-1f1f4"  : "\uD83C\uDDEF\uD83C\uDDF4" ,
  "1f1ef-1f1f5"  : "\uD83C\uDDEF\uD83C\uDDF5" ,
  "1f1f0-1f1ea"  : "\uD83C\uDDF0\uD83C\uDDEA" ,
  "1f1f0-1f1ec"  : "\uD83C\uDDF0\uD83C\uDDEC" ,
  "1f1f0-1f1ed"  : "\uD83C\uDDF0\uD83C\uDDED" ,
  "1f1f0-1f1ee"  : "\uD83C\uDDF0\uD83C\uDDEE" ,
  "1f1f0-1f1f2"  : "\uD83C\uDDF0\uD83C\uDDF2" ,
  "1f1f0-1f1f3"  : "\uD83C\uDDF0\uD83C\uDDF3" ,
  "1f1f0-1f1f5"  : "\uD83C\uDDF0\uD83C\uDDF5" ,
  "1f1f0-1f1f7"  : "\uD83C\uDDF0\uD83C\uDDF7" ,
  "1f1f0-1f1fc"  : "\uD83C\uDDF0\uD83C\uDDFC" ,
  "1f1f0-1f1fe"  : "\uD83C\uDDF0\uD83C\uDDFE" ,
  "1f1f0-1f1ff"  : "\uD83C\uDDF0\uD83C\uDDFF" ,
  "1f1f1-1f1e6"  : "\uD83C\uDDF1\uD83C\uDDE6" ,
  "1f1f1-1f1e7"  : "\uD83C\uDDF1\uD83C\uDDE7" ,
  "1f1f1-1f1e8"  : "\uD83C\uDDF1\uD83C\uDDE8" ,
  "1f1f1-1f1ee"  : "\uD83C\uDDF1\uD83C\uDDEE" ,
  "1f1f1-1f1f0"  : "\uD83C\uDDF1\uD83C\uDDF0" ,
  "1f1f1-1f1f7"  : "\uD83C\uDDF1\uD83C\uDDF7" ,
  "1f1f1-1f1f8"  : "\uD83C\uDDF1\uD83C\uDDF8" ,
  "1f1f1-1f1f9"  : "\uD83C\uDDF1\uD83C\uDDF9" ,
  "1f1f1-1f1fa"  : "\uD83C\uDDF1\uD83C\uDDFA" ,
  "1f1f1-1f1fb"  : "\uD83C\uDDF1\uD83C\uDDFB" ,
  "1f1f1-1f1fe"  : "\uD83C\uDDF1\uD83C\uDDFE" ,
  "1f1f2-1f1e6"  : "\uD83C\uDDF2\uD83C\uDDE6" ,
  "1f1f2-1f1e8"  : "\uD83C\uDDF2\uD83C\uDDE8" ,
  "1f1f2-1f1e9"  : "\uD83C\uDDF2\uD83C\uDDE9" ,
  "1f1f2-1f1ea"  : "\uD83C\uDDF2\uD83C\uDDEA" ,
  "1f1f2-1f1eb"  : "\uD83C\uDDF2\uD83C\uDDEB" ,
  "1f1f2-1f1ec"  : "\uD83C\uDDF2\uD83C\uDDEC" ,
  "1f1f2-1f1ed"  : "\uD83C\uDDF2\uD83C\uDDED" ,
  "1f1f2-1f1f0"  : "\uD83C\uDDF2\uD83C\uDDF0" ,
  "1f1f2-1f1f1"  : "\uD83C\uDDF2\uD83C\uDDF1" ,
  "1f1f2-1f1f2"  : "\uD83C\uDDF2\uD83C\uDDF2" ,
  "1f1f2-1f1f3"  : "\uD83C\uDDF2\uD83C\uDDF3" ,
  "1f1f2-1f1f4"  : "\uD83C\uDDF2\uD83C\uDDF4" ,
  "1f1f2-1f1f5"  : "\uD83C\uDDF2\uD83C\uDDF5" ,
  "1f1f2-1f1f6"  : "\uD83C\uDDF2\uD83C\uDDF6" ,
  "1f1f2-1f1f7"  : "\uD83C\uDDF2\uD83C\uDDF7" ,
  "1f1f2-1f1f8"  : "\uD83C\uDDF2\uD83C\uDDF8" ,
  "1f1f2-1f1f9"  : "\uD83C\uDDF2\uD83C\uDDF9" ,
  "1f1f2-1f1fa"  : "\uD83C\uDDF2\uD83C\uDDFA" ,
  "1f1f2-1f1fb"  : "\uD83C\uDDF2\uD83C\uDDFB" ,
  "1f1f2-1f1fc"  : "\uD83C\uDDF2\uD83C\uDDFC" ,
  "1f1f2-1f1fd"  : "\uD83C\uDDF2\uD83C\uDDFD" ,
  "1f1f2-1f1fe"  : "\uD83C\uDDF2\uD83C\uDDFE" ,
  "1f1f2-1f1ff"  : "\uD83C\uDDF2\uD83C\uDDFF" ,
  "1f1f3-1f1e6"  : "\uD83C\uDDF3\uD83C\uDDE6" ,
  "1f1f3-1f1e8"  : "\uD83C\uDDF3\uD83C\uDDE8" ,
  "1f1f3-1f1ea"  : "\uD83C\uDDF3\uD83C\uDDEA" ,
  "1f1f3-1f1eb"  : "\uD83C\uDDF3\uD83C\uDDEB" ,
  "1f1f3-1f1ec"  : "\uD83C\uDDF3\uD83C\uDDEC" ,
  "1f1f3-1f1ee"  : "\uD83C\uDDF3\uD83C\uDDEE" ,
  "1f1f3-1f1f1"  : "\uD83C\uDDF3\uD83C\uDDF1" ,
  "1f1f3-1f1f4"  : "\uD83C\uDDF3\uD83C\uDDF4" ,
  "1f1f3-1f1f5"  : "\uD83C\uDDF3\uD83C\uDDF5" ,
  "1f1f3-1f1f7"  : "\uD83C\uDDF3\uD83C\uDDF7" ,
  "1f1f3-1f1fa"  : "\uD83C\uDDF3\uD83C\uDDFA" ,
  "1f1f3-1f1ff"  : "\uD83C\uDDF3\uD83C\uDDFF" ,
  "1f1f4-1f1f2"  : "\uD83C\uDDF4\uD83C\uDDF2" ,
  "1f1f5-1f1e6"  : "\uD83C\uDDF5\uD83C\uDDE6" ,
  "1f1f5-1f1ea"  : "\uD83C\uDDF5\uD83C\uDDEA" ,
  "1f1f5-1f1eb"  : "\uD83C\uDDF5\uD83C\uDDEB" ,
  "1f1f5-1f1ec"  : "\uD83C\uDDF5\uD83C\uDDEC" ,
  "1f1f5-1f1ed"  : "\uD83C\uDDF5\uD83C\uDDED" ,
  "1f1f5-1f1f0"  : "\uD83C\uDDF5\uD83C\uDDF0" ,
  "1f1f5-1f1f1"  : "\uD83C\uDDF5\uD83C\uDDF1" ,
  "1f1f5-1f1f2"  : "\uD83C\uDDF5\uD83C\uDDF2" ,
  "1f1f5-1f1f3"  : "\uD83C\uDDF5\uD83C\uDDF3" ,
  "1f1f5-1f1f7"  : "\uD83C\uDDF5\uD83C\uDDF7" ,
  "1f1f5-1f1f8"  : "\uD83C\uDDF5\uD83C\uDDF8" ,
  "1f1f5-1f1f9"  : "\uD83C\uDDF5\uD83C\uDDF9" ,
  "1f1f5-1f1fc"  : "\uD83C\uDDF5\uD83C\uDDFC" ,
  "1f1f5-1f1fe"  : "\uD83C\uDDF5\uD83C\uDDFE" ,
  "1f1f6-1f1e6"  : "\uD83C\uDDF6\uD83C\uDDE6" ,
  "1f1f7-1f1ea"  : "\uD83C\uDDF7\uD83C\uDDEA" ,
  "1f1f7-1f1f4"  : "\uD83C\uDDF7\uD83C\uDDF4" ,
  "1f1f7-1f1f8"  : "\uD83C\uDDF7\uD83C\uDDF8" ,
  "1f1f7-1f1fa"  : "\uD83C\uDDF7\uD83C\uDDFA" ,
  "1f1f7-1f1fc"  : "\uD83C\uDDF7\uD83C\uDDFC" ,
  "1f1f8-1f1e6"  : "\uD83C\uDDF8\uD83C\uDDE6" ,
  "1f1f8-1f1e7"  : "\uD83C\uDDF8\uD83C\uDDE7" ,
  "1f1f8-1f1e8"  : "\uD83C\uDDF8\uD83C\uDDE8" ,
  "1f1f8-1f1e9"  : "\uD83C\uDDF8\uD83C\uDDE9" ,
  "1f1f8-1f1ea"  : "\uD83C\uDDF8\uD83C\uDDEA" ,
  "1f1f8-1f1ec"  : "\uD83C\uDDF8\uD83C\uDDEC" ,
  "1f1f8-1f1ed"  : "\uD83C\uDDF8\uD83C\uDDED" ,
  "1f1f8-1f1ee"  : "\uD83C\uDDF8\uD83C\uDDEE" ,
  "1f1f8-1f1ef"  : "\uD83C\uDDF8\uD83C\uDDEF" ,
  "1f1f8-1f1f0"  : "\uD83C\uDDF8\uD83C\uDDF0" ,
  "1f1f8-1f1f1"  : "\uD83C\uDDF8\uD83C\uDDF1" ,
  "1f1f8-1f1f2"  : "\uD83C\uDDF8\uD83C\uDDF2" ,
  "1f1f8-1f1f3"  : "\uD83C\uDDF8\uD83C\uDDF3" ,
  "1f1f8-1f1f4"  : "\uD83C\uDDF8\uD83C\uDDF4" ,
  "1f1f8-1f1f7"  : "\uD83C\uDDF8\uD83C\uDDF7" ,
  "1f1f8-1f1f8"  : "\uD83C\uDDF8\uD83C\uDDF8" ,
  "1f1f8-1f1f9"  : "\uD83C\uDDF8\uD83C\uDDF9" ,
  "1f1f8-1f1fb"  : "\uD83C\uDDF8\uD83C\uDDFB" ,
  "1f1f8-1f1fd"  : "\uD83C\uDDF8\uD83C\uDDFD" ,
  "1f1f8-1f1fe"  : "\uD83C\uDDF8\uD83C\uDDFE" ,
  "1f1f8-1f1ff"  : "\uD83C\uDDF8\uD83C\uDDFF" ,
  "1f1f9-1f1e6"  : "\uD83C\uDDF9\uD83C\uDDE6" ,
  "1f1f9-1f1e8"  : "\uD83C\uDDF9\uD83C\uDDE8" ,
  "1f1f9-1f1e9"  : "\uD83C\uDDF9\uD83C\uDDE9" ,
  "1f1f9-1f1eb"  : "\uD83C\uDDF9\uD83C\uDDEB" ,
  "1f1f9-1f1ec"  : "\uD83C\uDDF9\uD83C\uDDEC" ,
  "1f1f9-1f1ed"  : "\uD83C\uDDF9\uD83C\uDDED" ,
  "1f1f9-1f1ef"  : "\uD83C\uDDF9\uD83C\uDDEF" ,
  "1f1f9-1f1f0"  : "\uD83C\uDDF9\uD83C\uDDF0" ,
  "1f1f9-1f1f1"  : "\uD83C\uDDF9\uD83C\uDDF1" ,
  "1f1f9-1f1f2"  : "\uD83C\uDDF9\uD83C\uDDF2" ,
  "1f1f9-1f1f3"  : "\uD83C\uDDF9\uD83C\uDDF3" ,
  "1f1f9-1f1f4"  : "\uD83C\uDDF9\uD83C\uDDF4" ,
  "1f1f9-1f1f7"  : "\uD83C\uDDF9\uD83C\uDDF7" ,
  "1f1f9-1f1f9"  : "\uD83C\uDDF9\uD83C\uDDF9" ,
  "1f1f9-1f1fb"  : "\uD83C\uDDF9\uD83C\uDDFB" ,
  "1f1f9-1f1fc"  : "\uD83C\uDDF9\uD83C\uDDFC" ,
  "1f1f9-1f1ff"  : "\uD83C\uDDF9\uD83C\uDDFF" ,
  "1f1fa-1f1e6"  : "\uD83C\uDDFA\uD83C\uDDE6" ,
  "1f1fa-1f1ec"  : "\uD83C\uDDFA\uD83C\uDDEC" ,
  "1f1fa-1f1f2"  : "\uD83C\uDDFA\uD83C\uDDF2" ,
  "1f1fa-1f1f8"  : "\uD83C\uDDFA\uD83C\uDDF8" ,
  "1f1fa-1f1fe"  : "\uD83C\uDDFA\uD83C\uDDFE" ,
  "1f1fa-1f1ff"  : "\uD83C\uDDFA\uD83C\uDDFF" ,
  "1f1fb-1f1e6"  : "\uD83C\uDDFB\uD83C\uDDE6" ,
  "1f1fb-1f1e8"  : "\uD83C\uDDFB\uD83C\uDDE8" ,
  "1f1fb-1f1ea"  : "\uD83C\uDDFB\uD83C\uDDEA" ,
  "1f1fb-1f1ec"  : "\uD83C\uDDFB\uD83C\uDDEC" ,
  "1f1fb-1f1ee"  : "\uD83C\uDDFB\uD83C\uDDEE" ,
  "1f1fb-1f1f3"  : "\uD83C\uDDFB\uD83C\uDDF3" ,
  "1f1fb-1f1fa"  : "\uD83C\uDDFB\uD83C\uDDFA" ,
  "1f1fc-1f1eb"  : "\uD83C\uDDFC\uD83C\uDDEB" ,
  "1f1fc-1f1f8"  : "\uD83C\uDDFC\uD83C\uDDF8" ,
  "1f1fd-1f1f0"  : "\uD83C\uDDFD\uD83C\uDDF0" ,
  "1f1fe-1f1ea"  : "\uD83C\uDDFE\uD83C\uDDEA" ,
  "1f1fe-1f1f9"  : "\uD83C\uDDFE\uD83C\uDDF9" ,
  "1f1ff-1f1e6"  : "\uD83C\uDDFF\uD83C\uDDE6" ,
  "1f1ff-1f1f2"  : "\uD83C\uDDFF\uD83C\uDDF2" ,
  "1f1ff-1f1fc"  : "\uD83C\uDDFF\uD83C\uDDFC" ,
  "1f468-200d-1f468-200d-1f466"  : "\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66" ,
  "1f468-200d-1f468-200d-1f466-200d-1f466" : "\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66"  ,
  "1f468-200d-1f468-200d-1f467"  : "\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67" ,
  "1f468-200d-1f468-200d-1f467-200d-1f466" : "\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66"  ,
  "1f468-200d-1f468-200d-1f467-200d-1f467" : "\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67"  ,
  "1f468-200d-1f469-200d-1f466-200d-1f466" : "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66"  ,
  "1f468-200d-1f469-200d-1f467"  : "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67" ,
  "1f468-200d-1f469-200d-1f467-200d-1f466" : "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"  ,
  "1f468-200d-1f469-200d-1f467-200d-1f467" : "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67"  ,
  "1f468-200d-2764-fe0f-200d-1f468" : "\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC68" ,
  "1f468-200d-2764-fe0f-200d-1f48b-200d-1f468": "\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68"  ,
  "1f469-200d-1f469-200d-1f466"  : "\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66" ,
  "1f469-200d-1f469-200d-1f466-200d-1f466" : "\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66"  ,
  "1f469-200d-1f469-200d-1f467"  : "\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67" ,
  "1f469-200d-1f469-200d-1f467-200d-1f466" : "\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"  ,
  "1f469-200d-1f469-200d-1f467-200d-1f467" : "\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67"  ,
  "1f469-200d-2764-fe0f-200d-1f469" : "\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69" ,
  "1f469-200d-2764-fe0f-200d-1f48b-200d-1f469": "\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69"
 };
})());
angular.module('ngEmojiPicker').constant('EmojiRegexp', (function () {
    return /(?:\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69|\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69|\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68|\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC68|\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67|\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66|\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67|\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66|\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67|\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66|[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
})());

angular.module('ngEmojiPicker').constant('Emoji', (function () {
    return [{"emoji":[{"name":"GRINNING FACE","hex":"1F600","short_name":"grinning","sort_order":1,"sheet_x":26,"sheet_y":15},{"name":"GRIMACING FACE","hex":"1F62C","short_name":"grimacing","sort_order":2,"sheet_x":27,"sheet_y":18},{"name":"GRINNING FACE WITH SMILING EYES","hex":"1F601","short_name":"grin","sort_order":3,"sheet_x":26,"sheet_y":16},{"name":"FACE WITH TEARS OF JOY","hex":"1F602","short_name":"joy","sort_order":4,"sheet_x":26,"sheet_y":17},{"name":"SMILING FACE WITH OPEN MOUTH","hex":"1F603","short_name":"smiley","sort_order":5,"sheet_x":26,"sheet_y":18},{"name":"SMILING FACE WITH OPEN MOUTH AND SMILING EYES","hex":"1F604","short_name":"smile","sort_order":6,"sheet_x":26,"sheet_y":19},{"name":"SMILING FACE WITH OPEN MOUTH AND COLD SWEAT","hex":"1F605","short_name":"sweat_smile","sort_order":7,"sheet_x":26,"sheet_y":20},{"name":"SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES","hex":"1F606","short_name":"laughing","sort_order":8,"sheet_x":26,"sheet_y":21},{"name":"SMILING FACE WITH HALO","hex":"1F607","short_name":"innocent","sort_order":9,"sheet_x":26,"sheet_y":22},{"name":"WINKING FACE","hex":"1F609","short_name":"wink","sort_order":10,"sheet_x":26,"sheet_y":24},{"name":"SMILING FACE WITH SMILING EYES","hex":"1F60A","short_name":"blush","sort_order":11,"sheet_x":26,"sheet_y":25},{"name":"SLIGHTLY SMILING FACE","hex":"1F642","short_name":"slightly_smiling_face","sort_order":12,"sheet_x":27,"sheet_y":40},{"name":"UPSIDE-DOWN FACE","hex":"1F643","short_name":"upside_down_face","sort_order":13,"sheet_x":28,"sheet_y":0},{"name":"WHITE SMILING FACE","hex":"263A","short_name":"relaxed","sort_order":14,"sheet_x":1,"sheet_y":25},{"name":"FACE SAVOURING DELICIOUS FOOD","hex":"1F60B","short_name":"yum","sort_order":15,"sheet_x":26,"sheet_y":26},{"name":"RELIEVED FACE","hex":"1F60C","short_name":"relieved","sort_order":16,"sheet_x":26,"sheet_y":27},{"name":"SMILING FACE WITH HEART-SHAPED EYES","hex":"1F60D","short_name":"heart_eyes","sort_order":17,"sheet_x":26,"sheet_y":28},{"name":"FACE THROWING A KISS","hex":"1F618","short_name":"kissing_heart","sort_order":18,"sheet_x":26,"sheet_y":39},{"name":"KISSING FACE","hex":"1F617","short_name":"kissing","sort_order":19,"sheet_x":26,"sheet_y":38},{"name":"KISSING FACE WITH SMILING EYES","hex":"1F619","short_name":"kissing_smiling_eyes","sort_order":20,"sheet_x":26,"sheet_y":40},{"name":"KISSING FACE WITH CLOSED EYES","hex":"1F61A","short_name":"kissing_closed_eyes","sort_order":21,"sheet_x":27,"sheet_y":0},{"name":"FACE WITH STUCK-OUT TONGUE AND WINKING EYE","hex":"1F61C","short_name":"stuck_out_tongue_winking_eye","sort_order":22,"sheet_x":27,"sheet_y":2},{"name":"FACE WITH STUCK-OUT TONGUE AND TIGHTLY-CLOSED EYES","hex":"1F61D","short_name":"stuck_out_tongue_closed_eyes","sort_order":23,"sheet_x":27,"sheet_y":3},{"name":"FACE WITH STUCK-OUT TONGUE","hex":"1F61B","short_name":"stuck_out_tongue","sort_order":24,"sheet_x":27,"sheet_y":1},{"name":"MONEY-MOUTH FACE","hex":"1F911","short_name":"money_mouth_face","sort_order":25,"sheet_x":32,"sheet_y":2},{"name":"NERD FACE","hex":"1F913","short_name":"nerd_face","sort_order":26,"sheet_x":32,"sheet_y":4},{"name":"SMILING FACE WITH SUNGLASSES","hex":"1F60E","short_name":"sunglasses","sort_order":27,"sheet_x":26,"sheet_y":29},{"name":"HUGGING FACE","hex":"1F917","short_name":"hugging_face","sort_order":28,"sheet_x":32,"sheet_y":8},{"name":"SMIRKING FACE","hex":"1F60F","short_name":"smirk","sort_order":29,"sheet_x":26,"sheet_y":30},{"name":"FACE WITHOUT MOUTH","hex":"1F636","short_name":"no_mouth","sort_order":30,"sheet_x":27,"sheet_y":28},{"name":"NEUTRAL FACE","hex":"1F610","short_name":"neutral_face","sort_order":31,"sheet_x":26,"sheet_y":31},{"name":"EXPRESSIONLESS FACE","hex":"1F611","short_name":"expressionless","sort_order":32,"sheet_x":26,"sheet_y":32},{"name":"UNAMUSED FACE","hex":"1F612","short_name":"unamused","sort_order":33,"sheet_x":26,"sheet_y":33},{"name":"FACE WITH ROLLING EYES","hex":"1F644","short_name":"face_with_rolling_eyes","sort_order":34,"sheet_x":28,"sheet_y":1},{"name":"THINKING FACE","hex":"1F914","short_name":"thinking_face","sort_order":35,"sheet_x":32,"sheet_y":5},{"name":"FLUSHED FACE","hex":"1F633","short_name":"flushed","sort_order":36,"sheet_x":27,"sheet_y":25},{"name":"DISAPPOINTED FACE","hex":"1F61E","short_name":"disappointed","sort_order":37,"sheet_x":27,"sheet_y":4},{"name":"WORRIED FACE","hex":"1F61F","short_name":"worried","sort_order":38,"sheet_x":27,"sheet_y":5},{"name":"ANGRY FACE","hex":"1F620","short_name":"angry","sort_order":39,"sheet_x":27,"sheet_y":6},{"name":"POUTING FACE","hex":"1F621","short_name":"rage","sort_order":40,"sheet_x":27,"sheet_y":7},{"name":"PENSIVE FACE","hex":"1F614","short_name":"pensive","sort_order":41,"sheet_x":26,"sheet_y":35},{"name":"CONFUSED FACE","hex":"1F615","short_name":"confused","sort_order":42,"sheet_x":26,"sheet_y":36},{"name":"SLIGHTLY FROWNING FACE","hex":"1F641","short_name":"slightly_frowning_face","sort_order":43,"sheet_x":27,"sheet_y":39},{"name":"WHITE FROWNING FACE","hex":"2639","short_name":"white_frowning_face","sort_order":44,"sheet_x":1,"sheet_y":24},{"name":"PERSEVERING FACE","hex":"1F623","short_name":"persevere","sort_order":45,"sheet_x":27,"sheet_y":9},{"name":"CONFOUNDED FACE","hex":"1F616","short_name":"confounded","sort_order":46,"sheet_x":26,"sheet_y":37},{"name":"TIRED FACE","hex":"1F62B","short_name":"tired_face","sort_order":47,"sheet_x":27,"sheet_y":17},{"name":"WEARY FACE","hex":"1F629","short_name":"weary","sort_order":48,"sheet_x":27,"sheet_y":15},{"name":"FACE WITH LOOK OF TRIUMPH","hex":"1F624","short_name":"triumph","sort_order":49,"sheet_x":27,"sheet_y":10},{"name":"FACE WITH OPEN MOUTH","hex":"1F62E","short_name":"open_mouth","sort_order":50,"sheet_x":27,"sheet_y":20},{"name":"FACE SCREAMING IN FEAR","hex":"1F631","short_name":"scream","sort_order":51,"sheet_x":27,"sheet_y":23},{"name":"FEARFUL FACE","hex":"1F628","short_name":"fearful","sort_order":52,"sheet_x":27,"sheet_y":14},{"name":"FACE WITH OPEN MOUTH AND COLD SWEAT","hex":"1F630","short_name":"cold_sweat","sort_order":53,"sheet_x":27,"sheet_y":22},{"name":"HUSHED FACE","hex":"1F62F","short_name":"hushed","sort_order":54,"sheet_x":27,"sheet_y":21},{"name":"FROWNING FACE WITH OPEN MOUTH","hex":"1F626","short_name":"frowning","sort_order":55,"sheet_x":27,"sheet_y":12},{"name":"ANGUISHED FACE","hex":"1F627","short_name":"anguished","sort_order":56,"sheet_x":27,"sheet_y":13},{"name":"CRYING FACE","hex":"1F622","short_name":"cry","sort_order":57,"sheet_x":27,"sheet_y":8},{"name":"DISAPPOINTED BUT RELIEVED FACE","hex":"1F625","short_name":"disappointed_relieved","sort_order":58,"sheet_x":27,"sheet_y":11},{"name":"SLEEPY FACE","hex":"1F62A","short_name":"sleepy","sort_order":59,"sheet_x":27,"sheet_y":16},{"name":"FACE WITH COLD SWEAT","hex":"1F613","short_name":"sweat","sort_order":60,"sheet_x":26,"sheet_y":34},{"name":"LOUDLY CRYING FACE","hex":"1F62D","short_name":"sob","sort_order":61,"sheet_x":27,"sheet_y":19},{"name":"DIZZY FACE","hex":"1F635","short_name":"dizzy_face","sort_order":62,"sheet_x":27,"sheet_y":27},{"name":"ASTONISHED FACE","hex":"1F632","short_name":"astonished","sort_order":63,"sheet_x":27,"sheet_y":24},{"name":"ZIPPER-MOUTH FACE","hex":"1F910","short_name":"zipper_mouth_face","sort_order":64,"sheet_x":32,"sheet_y":1},{"name":"FACE WITH MEDICAL MASK","hex":"1F637","short_name":"mask","sort_order":65,"sheet_x":27,"sheet_y":29},{"name":"FACE WITH THERMOMETER","hex":"1F912","short_name":"face_with_thermometer","sort_order":66,"sheet_x":32,"sheet_y":3},{"name":"FACE WITH HEAD-BANDAGE","hex":"1F915","short_name":"face_with_head_bandage","sort_order":67,"sheet_x":32,"sheet_y":6},{"name":"SLEEPING FACE","hex":"1F634","short_name":"sleeping","sort_order":68,"sheet_x":27,"sheet_y":26},{"name":"SLEEPING SYMBOL","hex":"1F4A4","short_name":"zzz","sort_order":69,"sheet_x":20,"sheet_y":11},{"name":"PILE OF POO","hex":"1F4A9","short_name":"hankey","sort_order":70,"sheet_x":20,"sheet_y":16},{"name":"SMILING FACE WITH HORNS","hex":"1F608","short_name":"smiling_imp","sort_order":71,"sheet_x":26,"sheet_y":23},{"name":"IMP","hex":"1F47F","short_name":"imp","sort_order":72,"sheet_x":18,"sheet_y":26},{"name":"JAPANESE OGRE","hex":"1F479","short_name":"japanese_ogre","sort_order":73,"sheet_x":18,"sheet_y":15},{"name":"JAPANESE GOBLIN","hex":"1F47A","short_name":"japanese_goblin","sort_order":74,"sheet_x":18,"sheet_y":16},{"name":"SKULL","hex":"1F480","short_name":"skull","sort_order":75,"sheet_x":18,"sheet_y":27},{"name":"GHOST","hex":"1F47B","short_name":"ghost","sort_order":76,"sheet_x":18,"sheet_y":17},{"name":"EXTRATERRESTRIAL ALIEN","hex":"1F47D","short_name":"alien","sort_order":77,"sheet_x":18,"sheet_y":24},{"name":"ROBOT FACE","hex":"1F916","short_name":"robot_face","sort_order":78,"sheet_x":32,"sheet_y":7},{"name":"SMILING CAT FACE WITH OPEN MOUTH","hex":"1F63A","short_name":"smiley_cat","sort_order":79,"sheet_x":27,"sheet_y":32},{"name":"GRINNING CAT FACE WITH SMILING EYES","hex":"1F638","short_name":"smile_cat","sort_order":80,"sheet_x":27,"sheet_y":30},{"name":"CAT FACE WITH TEARS OF JOY","hex":"1F639","short_name":"joy_cat","sort_order":81,"sheet_x":27,"sheet_y":31},{"name":"SMILING CAT FACE WITH HEART-SHAPED EYES","hex":"1F63B","short_name":"heart_eyes_cat","sort_order":82,"sheet_x":27,"sheet_y":33},{"name":"CAT FACE WITH WRY SMILE","hex":"1F63C","short_name":"smirk_cat","sort_order":83,"sheet_x":27,"sheet_y":34},{"name":"KISSING CAT FACE WITH CLOSED EYES","hex":"1F63D","short_name":"kissing_cat","sort_order":84,"sheet_x":27,"sheet_y":35},{"name":"WEARY CAT FACE","hex":"1F640","short_name":"scream_cat","sort_order":85,"sheet_x":27,"sheet_y":38},{"name":"CRYING CAT FACE","hex":"1F63F","short_name":"crying_cat_face","sort_order":86,"sheet_x":27,"sheet_y":37},{"name":"POUTING CAT FACE","hex":"1F63E","short_name":"pouting_cat","sort_order":87,"sheet_x":27,"sheet_y":36},{"name":"PERSON RAISING BOTH HANDS IN CELEBRATION","hex":"1F64C","short_name":"raised_hands","sort_order":88,"sheet_x":28,"sheet_y":29},{"name":"CLAPPING HANDS SIGN","hex":"1F44F","short_name":"clap","sort_order":89,"sheet_x":15,"sheet_y":16},{"name":"WAVING HAND SIGN","hex":"1F44B","short_name":"wave","sort_order":90,"sheet_x":14,"sheet_y":33},{"name":"THUMBS UP SIGN","hex":"1F44D","short_name":"like","sort_order":91,"sheet_x":15,"sheet_y":4},{"name":"THUMBS DOWN SIGN","hex":"1F44E","short_name":"-1","sort_order":92,"sheet_x":15,"sheet_y":10},{"name":"FISTED HAND SIGN","hex":"1F44A","short_name":"facepunch","sort_order":93,"sheet_x":14,"sheet_y":27},{"name":"RAISED FIST","hex":"270A","short_name":"fist","sort_order":94,"sheet_x":3,"sheet_y":9},{"name":"VICTORY HAND","hex":"270C","short_name":"v","sort_order":95,"sheet_x":3,"sheet_y":21},{"name":"OK HAND SIGN","hex":"1F44C","short_name":"ok_hand","sort_order":96,"sheet_x":14,"sheet_y":39},{"name":"RAISED HAND","hex":"270B","short_name":"hand","sort_order":97,"sheet_x":3,"sheet_y":15},{"name":"OPEN HANDS SIGN","hex":"1F450","short_name":"open_hands","sort_order":98,"sheet_x":15,"sheet_y":22},{"name":"FLEXED BICEPS","hex":"1F4AA","short_name":"muscle","sort_order":99,"sheet_x":20,"sheet_y":17},{"name":"PERSON WITH FOLDED HANDS","hex":"1F64F","short_name":"pray","sort_order":100,"sheet_x":29,"sheet_y":6},{"name":"WHITE UP POINTING INDEX","hex":"261D","short_name":"point_up","sort_order":101,"sheet_x":1,"sheet_y":10},{"name":"WHITE UP POINTING BACKHAND INDEX","hex":"1F446","short_name":"point_up_2","sort_order":102,"sheet_x":14,"sheet_y":3},{"name":"WHITE DOWN POINTING BACKHAND INDEX","hex":"1F447","short_name":"point_down","sort_order":103,"sheet_x":14,"sheet_y":9},{"name":"WHITE LEFT POINTING BACKHAND INDEX","hex":"1F448","short_name":"point_left","sort_order":104,"sheet_x":14,"sheet_y":15},{"name":"WHITE RIGHT POINTING BACKHAND INDEX","hex":"1F449","short_name":"point_right","sort_order":105,"sheet_x":14,"sheet_y":21},{"name":"REVERSED HAND WITH MIDDLE FINGER EXTENDED","hex":"1F595","short_name":"middle_finger","sort_order":106,"sheet_x":25,"sheet_y":19},{"name":"RAISED HAND WITH FINGERS SPLAYED","hex":"1F590","short_name":"raised_hand_with_fingers_splayed","sort_order":107,"sheet_x":25,"sheet_y":13},{"name":"SIGN OF THE HORNS","hex":"1F918","short_name":"the_horns","sort_order":108,"sheet_x":32,"sheet_y":9},{"name":"RAISED HAND WITH PART BETWEEN MIDDLE AND RING FINGERS","hex":"1F596","short_name":"spock-hand","sort_order":109,"sheet_x":25,"sheet_y":25},{"name":"WRITING HAND","hex":"270D","short_name":"writing_hand","sort_order":110,"sheet_x":3,"sheet_y":27},{"name":"NAIL POLISH","hex":"1F485","short_name":"nail_care","sort_order":111,"sheet_x":19,"sheet_y":6},{"name":"MOUTH","hex":"1F444","short_name":"lips","sort_order":112,"sheet_x":14,"sheet_y":1},{"name":"TONGUE","hex":"1F445","short_name":"tongue","sort_order":113,"sheet_x":14,"sheet_y":2},{"name":"EAR","hex":"1F442","short_name":"ear","sort_order":114,"sheet_x":13,"sheet_y":30},{"name":"NOSE","hex":"1F443","short_name":"nose","sort_order":115,"sheet_x":13,"sheet_y":36},{"name":"EYE","hex":"1F441","short_name":"eye","sort_order":116,"sheet_x":13,"sheet_y":29},{"name":"EYES","hex":"1F440","short_name":"eyes","sort_order":117,"sheet_x":13,"sheet_y":28},{"name":"BUST IN SILHOUETTE","hex":"1F464","short_name":"bust_in_silhouette","sort_order":118,"sheet_x":16,"sheet_y":6},{"name":"BUSTS IN SILHOUETTE","hex":"1F465","short_name":"busts_in_silhouette","sort_order":119,"sheet_x":16,"sheet_y":7},{"name":"SPEAKING HEAD IN SILHOUETTE","hex":"1F5E3","short_name":"speaking_head_in_silhouette","sort_order":120,"sheet_x":26,"sheet_y":5},{"name":"BABY","hex":"1F476","short_name":"baby","sort_order":121,"sheet_x":17,"sheet_y":38},{"name":"BOY","hex":"1F466","short_name":"boy","sort_order":122,"sheet_x":16,"sheet_y":8},{"name":"GIRL","hex":"1F467","short_name":"girl","sort_order":123,"sheet_x":16,"sheet_y":14},{"name":"MAN","hex":"1F468","short_name":"man","sort_order":124,"sheet_x":16,"sheet_y":20},{"name":"WOMAN","hex":"1F469","short_name":"woman","sort_order":125,"sheet_x":16,"sheet_y":26},{"name":"PERSON WITH BLOND HAIR","hex":"1F471","short_name":"person_with_blond_hair","sort_order":126,"sheet_x":17,"sheet_y":8},{"name":"OLDER MAN","hex":"1F474","short_name":"older_man","sort_order":127,"sheet_x":17,"sheet_y":26},{"name":"OLDER WOMAN","hex":"1F475","short_name":"older_woman","sort_order":128,"sheet_x":17,"sheet_y":32},{"name":"MAN WITH GUA PI MAO","hex":"1F472","short_name":"man_with_gua_pi_mao","sort_order":129,"sheet_x":17,"sheet_y":14},{"name":"MAN WITH TURBAN","hex":"1F473","short_name":"man_with_turban","sort_order":130,"sheet_x":17,"sheet_y":20},{"name":"POLICE OFFICER","hex":"1F46E","short_name":"cop","sort_order":131,"sheet_x":16,"sheet_y":36},{"name":"CONSTRUCTION WORKER","hex":"1F477","short_name":"construction_worker","sort_order":132,"sheet_x":18,"sheet_y":3},{"name":"GUARDSMAN","hex":"1F482","short_name":"guardsman","sort_order":133,"sheet_x":18,"sheet_y":34},{"name":"SLEUTH OR SPY","hex":"1F575","short_name":"sleuth_or_spy","sort_order":134,"sheet_x":24,"sheet_y":39},{"name":"FATHER CHRISTMAS","hex":"1F385","short_name":"santa","sort_order":135,"sheet_x":8,"sheet_y":29},{"name":"BABY ANGEL","hex":"1F47C","short_name":"angel","sort_order":136,"sheet_x":18,"sheet_y":18},{"name":"PRINCESS","hex":"1F478","short_name":"princess","sort_order":137,"sheet_x":18,"sheet_y":9},{"name":"BRIDE WITH VEIL","hex":"1F470","short_name":"bride_with_veil","sort_order":138,"sheet_x":17,"sheet_y":2},{"name":"PEDESTRIAN","hex":"1F6B6","short_name":"walking","sort_order":139,"sheet_x":30,"sheet_y":40},{"name":"RUNNER","hex":"1F3C3","short_name":"runner","sort_order":140,"sheet_x":10,"sheet_y":9},{"name":"DANCER","hex":"1F483","short_name":"dancer","sort_order":141,"sheet_x":18,"sheet_y":40},{"name":"WOMAN WITH BUNNY EARS","hex":"1F46F","short_name":"dancers","sort_order":142,"sheet_x":17,"sheet_y":1},{"name":"MAN AND WOMAN HOLDING HANDS","hex":"1F46B","short_name":"couple","sort_order":143,"sheet_x":16,"sheet_y":33},{"name":"TWO MEN HOLDING HANDS","hex":"1F46C","short_name":"two_men_holding_hands","sort_order":144,"sheet_x":16,"sheet_y":34},{"name":"TWO WOMEN HOLDING HANDS","hex":"1F46D","short_name":"two_women_holding_hands","sort_order":145,"sheet_x":16,"sheet_y":35},{"name":"PERSON BOWING DEEPLY","hex":"1F647","short_name":"bow","sort_order":146,"sheet_x":28,"sheet_y":14},{"name":"INFORMATION DESK PERSON","hex":"1F481","short_name":"information_desk_person","sort_order":147,"sheet_x":18,"sheet_y":28},{"name":"FACE WITH NO GOOD GESTURE","hex":"1F645","short_name":"no_good","sort_order":148,"sheet_x":28,"sheet_y":2},{"name":"FACE WITH OK GESTURE","hex":"1F646","short_name":"ok_woman","sort_order":149,"sheet_x":28,"sheet_y":8},{"name":"HAPPY PERSON RAISING ONE HAND","hex":"1F64B","short_name":"raising_hand","sort_order":150,"sheet_x":28,"sheet_y":23},{"name":"PERSON WITH POUTING FACE","hex":"1F64E","short_name":"person_with_pouting_face","sort_order":151,"sheet_x":29,"sheet_y":0},{"name":"PERSON FROWNING","hex":"1F64D","short_name":"person_frowning","sort_order":152,"sheet_x":28,"sheet_y":35},{"name":"HAIRCUT","hex":"1F487","short_name":"haircut","sort_order":153,"sheet_x":19,"sheet_y":18},{"name":"FACE MASSAGE","hex":"1F486","short_name":"massage","sort_order":154,"sheet_x":19,"sheet_y":12},{"name":"COUPLE WITH HEART","hex":"1F491","short_name":"couple_with_heart","sort_order":155,"sheet_x":19,"sheet_y":33},{"name":null,"hex":"1F469-200D-2764-FE0F-200D-1F469","short_name":"woman-heart-woman","sort_order":156,"sheet_x":39,"sheet_y":19},{"name":null,"hex":"1F468-200D-2764-FE0F-200D-1F468","short_name":"man-heart-man","sort_order":157,"sheet_x":39,"sheet_y":12},{"name":"KISS","hex":"1F48F","short_name":"couplekiss","sort_order":158,"sheet_x":19,"sheet_y":31},{"name":null,"hex":"1F469-200D-2764-FE0F-200D-1F48B-200D-1F469","short_name":"woman-kiss-woman","sort_order":159,"sheet_x":39,"sheet_y":20},{"name":null,"hex":"1F468-200D-2764-FE0F-200D-1F48B-200D-1F468","short_name":"man-kiss-man","sort_order":160,"sheet_x":39,"sheet_y":13},{"name":"FAMILY","hex":"1F46A","short_name":"family","sort_order":161,"sheet_x":16,"sheet_y":32},{"name":null,"hex":"1F468-200D-1F469-200D-1F467","short_name":"man-woman-girl","sort_order":162,"sheet_x":39,"sheet_y":9},{"name":null,"hex":"1F468-200D-1F469-200D-1F467-200D-1F466","short_name":"man-woman-girl-boy","sort_order":163,"sheet_x":39,"sheet_y":10},{"name":null,"hex":"1F468-200D-1F469-200D-1F466-200D-1F466","short_name":"man-woman-boy-boy","sort_order":164,"sheet_x":39,"sheet_y":8},{"name":null,"hex":"1F468-200D-1F469-200D-1F467-200D-1F467","short_name":"man-woman-girl-girl","sort_order":165,"sheet_x":39,"sheet_y":11},{"name":null,"hex":"1F469-200D-1F469-200D-1F466","short_name":"woman-woman-boy","sort_order":166,"sheet_x":39,"sheet_y":14},{"name":null,"hex":"1F469-200D-1F469-200D-1F467","short_name":"woman-woman-girl","sort_order":167,"sheet_x":39,"sheet_y":16},{"name":null,"hex":"1F469-200D-1F469-200D-1F467-200D-1F466","short_name":"woman-woman-girl-boy","sort_order":168,"sheet_x":39,"sheet_y":17},{"name":null,"hex":"1F469-200D-1F469-200D-1F466-200D-1F466","short_name":"woman-woman-boy-boy","sort_order":169,"sheet_x":39,"sheet_y":15},{"name":null,"hex":"1F469-200D-1F469-200D-1F467-200D-1F467","short_name":"woman-woman-girl-girl","sort_order":170,"sheet_x":39,"sheet_y":18},{"name":null,"hex":"1F468-200D-1F468-200D-1F466","short_name":"man-man-boy","sort_order":171,"sheet_x":39,"sheet_y":3},{"name":null,"hex":"1F468-200D-1F468-200D-1F467","short_name":"man-man-girl","sort_order":172,"sheet_x":39,"sheet_y":5},{"name":null,"hex":"1F468-200D-1F468-200D-1F467-200D-1F466","short_name":"man-man-girl-boy","sort_order":173,"sheet_x":39,"sheet_y":6},{"name":null,"hex":"1F468-200D-1F468-200D-1F466-200D-1F466","short_name":"man-man-boy-boy","sort_order":174,"sheet_x":39,"sheet_y":4},{"name":null,"hex":"1F468-200D-1F468-200D-1F467-200D-1F467","short_name":"man-man-girl-girl","sort_order":175,"sheet_x":39,"sheet_y":7},{"name":"WOMANS CLOTHES","hex":"1F45A","short_name":"womans_clothes","sort_order":176,"sheet_x":15,"sheet_y":37},{"name":"T-SHIRT","hex":"1F455","short_name":"shirt","sort_order":177,"sheet_x":15,"sheet_y":32},{"name":"JEANS","hex":"1F456","short_name":"jeans","sort_order":178,"sheet_x":15,"sheet_y":33},{"name":"NECKTIE","hex":"1F454","short_name":"necktie","sort_order":179,"sheet_x":15,"sheet_y":31},{"name":"DRESS","hex":"1F457","short_name":"dress","sort_order":180,"sheet_x":15,"sheet_y":34},{"name":"BIKINI","hex":"1F459","short_name":"bikini","sort_order":181,"sheet_x":15,"sheet_y":36},{"name":"KIMONO","hex":"1F458","short_name":"kimono","sort_order":182,"sheet_x":15,"sheet_y":35},{"name":"LIPSTICK","hex":"1F484","short_name":"lipstick","sort_order":183,"sheet_x":19,"sheet_y":5},{"name":"KISS MARK","hex":"1F48B","short_name":"kiss","sort_order":184,"sheet_x":19,"sheet_y":27},{"name":"FOOTPRINTS","hex":"1F463","short_name":"footprints","sort_order":185,"sheet_x":16,"sheet_y":5},{"name":"HIGH-HEELED SHOE","hex":"1F460","short_name":"high_heel","sort_order":186,"sheet_x":16,"sheet_y":2},{"name":"WOMANS SANDAL","hex":"1F461","short_name":"sandal","sort_order":187,"sheet_x":16,"sheet_y":3},{"name":"WOMANS BOOTS","hex":"1F462","short_name":"boot","sort_order":188,"sheet_x":16,"sheet_y":4},{"name":"MANS SHOE","hex":"1F45E","short_name":"mans_shoe","sort_order":189,"sheet_x":16,"sheet_y":0},{"name":"ATHLETIC SHOE","hex":"1F45F","short_name":"athletic_shoe","sort_order":190,"sheet_x":16,"sheet_y":1},{"name":"WOMANS HAT","hex":"1F452","short_name":"womans_hat","sort_order":191,"sheet_x":15,"sheet_y":29},{"name":"TOP HAT","hex":"1F3A9","short_name":"tophat","sort_order":192,"sheet_x":9,"sheet_y":24},{"name":"HELMET WITH WHITE CROSS","hex":"26D1","short_name":"helmet_with_white_cross","sort_order":193,"sheet_x":2,"sheet_y":25},{"name":"GRADUATION CAP","hex":"1F393","short_name":"mortar_board","sort_order":194,"sheet_x":9,"sheet_y":7},{"name":"CROWN","hex":"1F451","short_name":"crown","sort_order":195,"sheet_x":15,"sheet_y":28},{"name":"SCHOOL SATCHEL","hex":"1F392","short_name":"school_satchel","sort_order":196,"sheet_x":9,"sheet_y":6},{"name":"POUCH","hex":"1F45D","short_name":"pouch","sort_order":197,"sheet_x":15,"sheet_y":40},{"name":"PURSE","hex":"1F45B","short_name":"purse","sort_order":198,"sheet_x":15,"sheet_y":38},{"name":"HANDBAG","hex":"1F45C","short_name":"handbag","sort_order":199,"sheet_x":15,"sheet_y":39},{"name":"BRIEFCASE","hex":"1F4BC","short_name":"briefcase","sort_order":200,"sheet_x":20,"sheet_y":40},{"name":"EYEGLASSES","hex":"1F453","short_name":"eyeglasses","sort_order":201,"sheet_x":15,"sheet_y":30},{"name":"DARK SUNGLASSES","hex":"1F576","short_name":"dark_sunglasses","sort_order":202,"sheet_x":25,"sheet_y":4},{"name":"RING","hex":"1F48D","short_name":"ring","sort_order":203,"sheet_x":19,"sheet_y":29},{"name":"CLOSED UMBRELLA","hex":"1F302","short_name":"closed_umbrella","sort_order":204,"sheet_x":5,"sheet_y":23}],"short_name":"People","class":"cm-emoji-sunglasses","name":"Smileys & People","order":1},{"emoji":[{"name":"DOG FACE","hex":"1F436","short_name":"dog","sort_order":1,"sheet_x":13,"sheet_y":18},{"name":"CAT FACE","hex":"1F431","short_name":"cat","sort_order":2,"sheet_x":13,"sheet_y":13},{"name":"MOUSE FACE","hex":"1F42D","short_name":"mouse","sort_order":3,"sheet_x":13,"sheet_y":9},{"name":"HAMSTER FACE","hex":"1F439","short_name":"hamster","sort_order":4,"sheet_x":13,"sheet_y":21},{"name":"RABBIT FACE","hex":"1F430","short_name":"rabbit","sort_order":5,"sheet_x":13,"sheet_y":12},{"name":"BEAR FACE","hex":"1F43B","short_name":"bear","sort_order":6,"sheet_x":13,"sheet_y":23},{"name":"PANDA FACE","hex":"1F43C","short_name":"panda_face","sort_order":7,"sheet_x":13,"sheet_y":24},{"name":"KOALA","hex":"1F428","short_name":"koala","sort_order":8,"sheet_x":13,"sheet_y":4},{"name":"TIGER FACE","hex":"1F42F","short_name":"tiger","sort_order":9,"sheet_x":13,"sheet_y":11},{"name":"LION FACE","hex":"1F981","short_name":"lion_face","sort_order":10,"sheet_x":32,"sheet_y":16},{"name":"COW FACE","hex":"1F42E","short_name":"cow","sort_order":11,"sheet_x":13,"sheet_y":10},{"name":"PIG FACE","hex":"1F437","short_name":"pig","sort_order":12,"sheet_x":13,"sheet_y":19},{"name":"PIG NOSE","hex":"1F43D","short_name":"pig_nose","sort_order":13,"sheet_x":13,"sheet_y":25},{"name":"FROG FACE","hex":"1F438","short_name":"frog","sort_order":14,"sheet_x":13,"sheet_y":20},{"name":"OCTOPUS","hex":"1F419","short_name":"octopus","sort_order":15,"sheet_x":12,"sheet_y":30},{"name":"MONKEY FACE","hex":"1F435","short_name":"monkey_face","sort_order":16,"sheet_x":13,"sheet_y":17},{"name":"SEE-NO-EVIL MONKEY","hex":"1F648","short_name":"see_no_evil","sort_order":17,"sheet_x":28,"sheet_y":20},{"name":"HEAR-NO-EVIL MONKEY","hex":"1F649","short_name":"hear_no_evil","sort_order":18,"sheet_x":28,"sheet_y":21},{"name":"SPEAK-NO-EVIL MONKEY","hex":"1F64A","short_name":"speak_no_evil","sort_order":19,"sheet_x":28,"sheet_y":22},{"name":"MONKEY","hex":"1F412","short_name":"monkey","sort_order":20,"sheet_x":12,"sheet_y":23},{"name":"CHICKEN","hex":"1F414","short_name":"chicken","sort_order":21,"sheet_x":12,"sheet_y":25},{"name":"PENGUIN","hex":"1F427","short_name":"penguin","sort_order":22,"sheet_x":13,"sheet_y":3},{"name":"BIRD","hex":"1F426","short_name":"bird","sort_order":23,"sheet_x":13,"sheet_y":2},{"name":"BABY CHICK","hex":"1F424","short_name":"baby_chick","sort_order":24,"sheet_x":13,"sheet_y":0},{"name":"HATCHING CHICK","hex":"1F423","short_name":"hatching_chick","sort_order":25,"sheet_x":12,"sheet_y":40},{"name":"FRONT-FACING BABY CHICK","hex":"1F425","short_name":"hatched_chick","sort_order":26,"sheet_x":13,"sheet_y":1},{"name":"WOLF FACE","hex":"1F43A","short_name":"wolf","sort_order":27,"sheet_x":13,"sheet_y":22},{"name":"BOAR","hex":"1F417","short_name":"boar","sort_order":28,"sheet_x":12,"sheet_y":28},{"name":"HORSE FACE","hex":"1F434","short_name":"horse","sort_order":29,"sheet_x":13,"sheet_y":16},{"name":"UNICORN FACE","hex":"1F984","short_name":"unicorn_face","sort_order":30,"sheet_x":32,"sheet_y":19},{"name":"HONEYBEE","hex":"1F41D","short_name":"bee","sort_order":31,"sheet_x":12,"sheet_y":34},{"name":"BUG","hex":"1F41B","short_name":"bug","sort_order":32,"sheet_x":12,"sheet_y":32},{"name":"SNAIL","hex":"1F40C","short_name":"snail","sort_order":33,"sheet_x":12,"sheet_y":17},{"name":"LADY BEETLE","hex":"1F41E","short_name":"beetle","sort_order":34,"sheet_x":12,"sheet_y":35},{"name":"ANT","hex":"1F41C","short_name":"ant","sort_order":35,"sheet_x":12,"sheet_y":33},{"name":"SPIDER","hex":"1F577","short_name":"spider","sort_order":36,"sheet_x":25,"sheet_y":5},{"name":"SCORPION","hex":"1F982","short_name":"scorpion","sort_order":37,"sheet_x":32,"sheet_y":17},{"name":"CRAB","hex":"1F980","short_name":"crab","sort_order":38,"sheet_x":32,"sheet_y":15},{"name":"SNAKE","hex":"1F40D","short_name":"snake","sort_order":39,"sheet_x":12,"sheet_y":18},{"name":"TURTLE","hex":"1F422","short_name":"turtle","sort_order":40,"sheet_x":12,"sheet_y":39},{"name":"TROPICAL FISH","hex":"1F420","short_name":"tropical_fish","sort_order":41,"sheet_x":12,"sheet_y":37},{"name":"FISH","hex":"1F41F","short_name":"fish","sort_order":42,"sheet_x":12,"sheet_y":36},{"name":"BLOWFISH","hex":"1F421","short_name":"blowfish","sort_order":43,"sheet_x":12,"sheet_y":38},{"name":"DOLPHIN","hex":"1F42C","short_name":"dolphin","sort_order":44,"sheet_x":13,"sheet_y":8},{"name":"SPOUTING WHALE","hex":"1F433","short_name":"whale","sort_order":45,"sheet_x":13,"sheet_y":15},{"name":"WHALE","hex":"1F40B","short_name":"whale2","sort_order":46,"sheet_x":12,"sheet_y":16},{"name":"CROCODILE","hex":"1F40A","short_name":"crocodile","sort_order":47,"sheet_x":12,"sheet_y":15},{"name":"LEOPARD","hex":"1F406","short_name":"leopard","sort_order":48,"sheet_x":12,"sheet_y":11},{"name":"TIGER","hex":"1F405","short_name":"tiger2","sort_order":49,"sheet_x":12,"sheet_y":10},{"name":"WATER BUFFALO","hex":"1F403","short_name":"water_buffalo","sort_order":50,"sheet_x":12,"sheet_y":8},{"name":"OX","hex":"1F402","short_name":"ox","sort_order":51,"sheet_x":12,"sheet_y":7},{"name":"COW","hex":"1F404","short_name":"cow2","sort_order":52,"sheet_x":12,"sheet_y":9},{"name":"DROMEDARY CAMEL","hex":"1F42A","short_name":"dromedary_camel","sort_order":53,"sheet_x":13,"sheet_y":6},{"name":"BACTRIAN CAMEL","hex":"1F42B","short_name":"camel","sort_order":54,"sheet_x":13,"sheet_y":7},{"name":"ELEPHANT","hex":"1F418","short_name":"elephant","sort_order":55,"sheet_x":12,"sheet_y":29},{"name":"GOAT","hex":"1F410","short_name":"goat","sort_order":56,"sheet_x":12,"sheet_y":21},{"name":"RAM","hex":"1F40F","short_name":"ram","sort_order":57,"sheet_x":12,"sheet_y":20},{"name":"SHEEP","hex":"1F411","short_name":"sheep","sort_order":58,"sheet_x":12,"sheet_y":22},{"name":"HORSE","hex":"1F40E","short_name":"racehorse","sort_order":59,"sheet_x":12,"sheet_y":19},{"name":"PIG","hex":"1F416","short_name":"pig2","sort_order":60,"sheet_x":12,"sheet_y":27},{"name":"RAT","hex":"1F400","short_name":"rat","sort_order":61,"sheet_x":12,"sheet_y":5},{"name":"MOUSE","hex":"1F401","short_name":"mouse2","sort_order":62,"sheet_x":12,"sheet_y":6},{"name":"ROOSTER","hex":"1F413","short_name":"rooster","sort_order":63,"sheet_x":12,"sheet_y":24},{"name":"TURKEY","hex":"1F983","short_name":"turkey","sort_order":64,"sheet_x":32,"sheet_y":18},{"name":"DOVE OF PEACE","hex":"1F54A","short_name":"dove_of_peace","sort_order":65,"sheet_x":24,"sheet_y":6},{"name":"DOG","hex":"1F415","short_name":"dog2","sort_order":66,"sheet_x":12,"sheet_y":26},{"name":"POODLE","hex":"1F429","short_name":"poodle","sort_order":67,"sheet_x":13,"sheet_y":5},{"name":"CAT","hex":"1F408","short_name":"cat2","sort_order":68,"sheet_x":12,"sheet_y":13},{"name":"RABBIT","hex":"1F407","short_name":"rabbit2","sort_order":69,"sheet_x":12,"sheet_y":12},{"name":"CHIPMUNK","hex":"1F43F","short_name":"chipmunk","sort_order":70,"sheet_x":13,"sheet_y":27},{"name":"PAW PRINTS","hex":"1F43E","short_name":"feet","sort_order":71,"sheet_x":13,"sheet_y":26},{"name":"DRAGON","hex":"1F409","short_name":"dragon","sort_order":72,"sheet_x":12,"sheet_y":14},{"name":"DRAGON FACE","hex":"1F432","short_name":"dragon_face","sort_order":73,"sheet_x":13,"sheet_y":14},{"name":"CACTUS","hex":"1F335","short_name":"cactus","sort_order":74,"sheet_x":6,"sheet_y":31},{"name":"CHRISTMAS TREE","hex":"1F384","short_name":"christmas_tree","sort_order":75,"sheet_x":8,"sheet_y":28},{"name":"EVERGREEN TREE","hex":"1F332","short_name":"evergreen_tree","sort_order":76,"sheet_x":6,"sheet_y":28},{"name":"DECIDUOUS TREE","hex":"1F333","short_name":"deciduous_tree","sort_order":77,"sheet_x":6,"sheet_y":29},{"name":"PALM TREE","hex":"1F334","short_name":"palm_tree","sort_order":78,"sheet_x":6,"sheet_y":30},{"name":"SEEDLING","hex":"1F331","short_name":"seedling","sort_order":79,"sheet_x":6,"sheet_y":27},{"name":"HERB","hex":"1F33F","short_name":"herb","sort_order":80,"sheet_x":7,"sheet_y":0},{"name":"SHAMROCK","hex":"2618","short_name":"shamrock","sort_order":81,"sheet_x":1,"sheet_y":9},{"name":"FOUR LEAF CLOVER","hex":"1F340","short_name":"four_leaf_clover","sort_order":82,"sheet_x":7,"sheet_y":1},{"name":"PINE DECORATION","hex":"1F38D","short_name":"bamboo","sort_order":83,"sheet_x":9,"sheet_y":1},{"name":"TANABATA TREE","hex":"1F38B","short_name":"tanabata_tree","sort_order":84,"sheet_x":8,"sheet_y":40},{"name":"LEAF FLUTTERING IN WIND","hex":"1F343","short_name":"leaves","sort_order":85,"sheet_x":7,"sheet_y":4},{"name":"FALLEN LEAF","hex":"1F342","short_name":"fallen_leaf","sort_order":86,"sheet_x":7,"sheet_y":3},{"name":"MAPLE LEAF","hex":"1F341","short_name":"maple_leaf","sort_order":87,"sheet_x":7,"sheet_y":2},{"name":"EAR OF RICE","hex":"1F33E","short_name":"ear_of_rice","sort_order":88,"sheet_x":6,"sheet_y":40},{"name":"HIBISCUS","hex":"1F33A","short_name":"hibiscus","sort_order":89,"sheet_x":6,"sheet_y":36},{"name":"SUNFLOWER","hex":"1F33B","short_name":"sunflower","sort_order":90,"sheet_x":6,"sheet_y":37},{"name":"ROSE","hex":"1F339","short_name":"rose","sort_order":91,"sheet_x":6,"sheet_y":35},{"name":"TULIP","hex":"1F337","short_name":"tulip","sort_order":92,"sheet_x":6,"sheet_y":33},{"name":"BLOSSOM","hex":"1F33C","short_name":"blossom","sort_order":93,"sheet_x":6,"sheet_y":38},{"name":"CHERRY BLOSSOM","hex":"1F338","short_name":"cherry_blossom","sort_order":94,"sheet_x":6,"sheet_y":34},{"name":"BOUQUET","hex":"1F490","short_name":"bouquet","sort_order":95,"sheet_x":19,"sheet_y":32},{"name":"MUSHROOM","hex":"1F344","short_name":"mushroom","sort_order":96,"sheet_x":7,"sheet_y":5},{"name":"CHESTNUT","hex":"1F330","short_name":"chestnut","sort_order":97,"sheet_x":6,"sheet_y":26},{"name":"JACK-O-LANTERN","hex":"1F383","short_name":"jack_o_lantern","sort_order":98,"sheet_x":8,"sheet_y":27},{"name":"SPIRAL SHELL","hex":"1F41A","short_name":"shell","sort_order":99,"sheet_x":12,"sheet_y":31},{"name":"SPIDER WEB","hex":"1F578","short_name":"spider_web","sort_order":100,"sheet_x":25,"sheet_y":6},{"name":"EARTH GLOBE AMERICAS","hex":"1F30E","short_name":"earth_americas","sort_order":101,"sheet_x":5,"sheet_y":35},{"name":"EARTH GLOBE EUROPE-AFRICA","hex":"1F30D","short_name":"earth_africa","sort_order":102,"sheet_x":5,"sheet_y":34},{"name":"EARTH GLOBE ASIA-AUSTRALIA","hex":"1F30F","short_name":"earth_asia","sort_order":103,"sheet_x":5,"sheet_y":36},{"name":"FULL MOON SYMBOL","hex":"1F315","short_name":"full_moon","sort_order":104,"sheet_x":6,"sheet_y":1},{"name":"WANING GIBBOUS MOON SYMBOL","hex":"1F316","short_name":"waning_gibbous_moon","sort_order":105,"sheet_x":6,"sheet_y":2},{"name":"LAST QUARTER MOON SYMBOL","hex":"1F317","short_name":"last_quarter_moon","sort_order":106,"sheet_x":6,"sheet_y":3},{"name":"WANING CRESCENT MOON SYMBOL","hex":"1F318","short_name":"waning_crescent_moon","sort_order":107,"sheet_x":6,"sheet_y":4},{"name":"NEW MOON SYMBOL","hex":"1F311","short_name":"new_moon","sort_order":108,"sheet_x":5,"sheet_y":38},{"name":"WAXING CRESCENT MOON SYMBOL","hex":"1F312","short_name":"waxing_crescent_moon","sort_order":109,"sheet_x":5,"sheet_y":39},{"name":"FIRST QUARTER MOON SYMBOL","hex":"1F313","short_name":"first_quarter_moon","sort_order":110,"sheet_x":5,"sheet_y":40},{"name":"WAXING GIBBOUS MOON SYMBOL","hex":"1F314","short_name":"moon","sort_order":111,"sheet_x":6,"sheet_y":0},{"name":"NEW MOON WITH FACE","hex":"1F31A","short_name":"new_moon_with_face","sort_order":112,"sheet_x":6,"sheet_y":6},{"name":"FULL MOON WITH FACE","hex":"1F31D","short_name":"full_moon_with_face","sort_order":113,"sheet_x":6,"sheet_y":9},{"name":"FIRST QUARTER MOON WITH FACE","hex":"1F31B","short_name":"first_quarter_moon_with_face","sort_order":114,"sheet_x":6,"sheet_y":7},{"name":"LAST QUARTER MOON WITH FACE","hex":"1F31C","short_name":"last_quarter_moon_with_face","sort_order":115,"sheet_x":6,"sheet_y":8},{"name":"SUN WITH FACE","hex":"1F31E","short_name":"sun_with_face","sort_order":116,"sheet_x":6,"sheet_y":10},{"name":"CRESCENT MOON","hex":"1F319","short_name":"crescent_moon","sort_order":117,"sheet_x":6,"sheet_y":5},{"name":"WHITE MEDIUM STAR","hex":"2B50","short_name":"star","sort_order":118,"sheet_x":4,"sheet_y":24},{"name":"GLOWING STAR","hex":"1F31F","short_name":"star2","sort_order":119,"sheet_x":6,"sheet_y":11},{"name":"DIZZY SYMBOL","hex":"1F4AB","short_name":"dizzy","sort_order":120,"sheet_x":20,"sheet_y":23},{"name":"SPARKLES","hex":"2728","short_name":"sparkles","sort_order":121,"sheet_x":3,"sheet_y":39},{"name":"COMET","hex":"2604","short_name":"comet","sort_order":122,"sheet_x":1,"sheet_y":4},{"name":"BLACK SUN WITH RAYS","hex":"2600","short_name":"sunny","sort_order":123,"sheet_x":1,"sheet_y":0},{"name":"WHITE SUN WITH SMALL CLOUD","hex":"1F324","short_name":"mostly_sunny","sort_order":124,"sheet_x":6,"sheet_y":14},{"name":"SUN BEHIND CLOUD","hex":"26C5","short_name":"partly_sunny","sort_order":125,"sheet_x":2,"sheet_y":21},{"name":"WHITE SUN BEHIND CLOUD","hex":"1F325","short_name":"barely_sunny","sort_order":126,"sheet_x":6,"sheet_y":15},{"name":"WHITE SUN BEHIND CLOUD WITH RAIN","hex":"1F326","short_name":"partly_sunny_rain","sort_order":127,"sheet_x":6,"sheet_y":16},{"name":"CLOUD","hex":"2601","short_name":"cloud","sort_order":128,"sheet_x":1,"sheet_y":1},{"name":"CLOUD WITH RAIN","hex":"1F327","short_name":"rain_cloud","sort_order":129,"sheet_x":6,"sheet_y":17},{"name":"THUNDER CLOUD AND RAIN","hex":"26C8","short_name":"thunder_cloud_and_rain","sort_order":130,"sheet_x":2,"sheet_y":22},{"name":"CLOUD WITH LIGHTNING","hex":"1F329","short_name":"lightning","sort_order":131,"sheet_x":6,"sheet_y":19},{"name":"HIGH VOLTAGE SIGN","hex":"26A1","short_name":"zap","sort_order":132,"sheet_x":2,"sheet_y":13},{"name":"FIRE","hex":"1F525","short_name":"fire","sort_order":133,"sheet_x":23,"sheet_y":21},{"name":"COLLISION SYMBOL","hex":"1F4A5","short_name":"boom","sort_order":134,"sheet_x":20,"sheet_y":12},{"name":"SNOWFLAKE","hex":"2744","short_name":"snowflake","sort_order":135,"sheet_x":4,"sheet_y":1},{"name":"CLOUD WITH SNOW","hex":"1F328","short_name":"snow_cloud","sort_order":136,"sheet_x":6,"sheet_y":18},{"name":"SNOWMAN","hex":"2603","short_name":"snowman","sort_order":137,"sheet_x":1,"sheet_y":3},{"name":"SNOWMAN WITHOUT SNOW","hex":"26C4","short_name":"snowman_without_snow","sort_order":138,"sheet_x":2,"sheet_y":20},{"name":"WIND BLOWING FACE","hex":"1F32C","short_name":"wind_blowing_face","sort_order":139,"sheet_x":6,"sheet_y":22},{"name":"DASH SYMBOL","hex":"1F4A8","short_name":"dash","sort_order":140,"sheet_x":20,"sheet_y":15},{"name":"CLOUD WITH TORNADO","hex":"1F32A","short_name":"tornado","sort_order":141,"sheet_x":6,"sheet_y":20},{"name":"FOG","hex":"1F32B","short_name":"fog","sort_order":142,"sheet_x":6,"sheet_y":21},{"name":"UMBRELLA","hex":"2602","short_name":"umbrella","sort_order":143,"sheet_x":1,"sheet_y":2},{"name":"UMBRELLA WITH RAIN DROPS","hex":"2614","short_name":"umbrella_with_rain_drops","sort_order":144,"sheet_x":1,"sheet_y":7},{"name":"DROPLET","hex":"1F4A7","short_name":"droplet","sort_order":145,"sheet_x":20,"sheet_y":14},{"name":"SPLASHING SWEAT SYMBOL","hex":"1F4A6","short_name":"sweat_drops","sort_order":146,"sheet_x":20,"sheet_y":13},{"name":"WATER WAVE","hex":"1F30A","short_name":"ocean","sort_order":147,"sheet_x":5,"sheet_y":31}],"short_name":"Nature","class":"cm-emoji-four-leaf-clover","name":"Animals & Nature","order":2},{"emoji":[{"name":"GREEN APPLE","hex":"1F34F","short_name":"green_apple","sort_order":1,"sheet_x":7,"sheet_y":16},{"name":"RED APPLE","hex":"1F34E","short_name":"apple","sort_order":2,"sheet_x":7,"sheet_y":15},{"name":"PEAR","hex":"1F350","short_name":"pear","sort_order":3,"sheet_x":7,"sheet_y":17},{"name":"TANGERINE","hex":"1F34A","short_name":"tangerine","sort_order":4,"sheet_x":7,"sheet_y":11},{"name":"LEMON","hex":"1F34B","short_name":"lemon","sort_order":5,"sheet_x":7,"sheet_y":12},{"name":"BANANA","hex":"1F34C","short_name":"banana","sort_order":6,"sheet_x":7,"sheet_y":13},{"name":"WATERMELON","hex":"1F349","short_name":"watermelon","sort_order":7,"sheet_x":7,"sheet_y":10},{"name":"GRAPES","hex":"1F347","short_name":"grapes","sort_order":8,"sheet_x":7,"sheet_y":8},{"name":"STRAWBERRY","hex":"1F353","short_name":"strawberry","sort_order":9,"sheet_x":7,"sheet_y":20},{"name":"MELON","hex":"1F348","short_name":"melon","sort_order":10,"sheet_x":7,"sheet_y":9},{"name":"CHERRIES","hex":"1F352","short_name":"cherries","sort_order":11,"sheet_x":7,"sheet_y":19},{"name":"PEACH","hex":"1F351","short_name":"peach","sort_order":12,"sheet_x":7,"sheet_y":18},{"name":"PINEAPPLE","hex":"1F34D","short_name":"pineapple","sort_order":13,"sheet_x":7,"sheet_y":14},{"name":"TOMATO","hex":"1F345","short_name":"tomato","sort_order":14,"sheet_x":7,"sheet_y":6},{"name":"AUBERGINE","hex":"1F346","short_name":"eggplant","sort_order":15,"sheet_x":7,"sheet_y":7},{"name":"HOT PEPPER","hex":"1F336","short_name":"hot_pepper","sort_order":16,"sheet_x":6,"sheet_y":32},{"name":"EAR OF MAIZE","hex":"1F33D","short_name":"corn","sort_order":17,"sheet_x":6,"sheet_y":39},{"name":"ROASTED SWEET POTATO","hex":"1F360","short_name":"sweet_potato","sort_order":18,"sheet_x":7,"sheet_y":33},{"name":"HONEY POT","hex":"1F36F","short_name":"honey_pot","sort_order":19,"sheet_x":8,"sheet_y":7},{"name":"BREAD","hex":"1F35E","short_name":"bread","sort_order":20,"sheet_x":7,"sheet_y":31},{"name":"CHEESE WEDGE","hex":"1F9C0","short_name":"cheese_wedge","sort_order":21,"sheet_x":32,"sheet_y":20},{"name":"POULTRY LEG","hex":"1F357","short_name":"poultry_leg","sort_order":22,"sheet_x":7,"sheet_y":24},{"name":"MEAT ON BONE","hex":"1F356","short_name":"meat_on_bone","sort_order":23,"sheet_x":7,"sheet_y":23},{"name":"FRIED SHRIMP","hex":"1F364","short_name":"fried_shrimp","sort_order":24,"sheet_x":7,"sheet_y":37},{"name":"COOKING","hex":"1F373","short_name":"egg","sort_order":25,"sheet_x":8,"sheet_y":11},{"name":"HAMBURGER","hex":"1F354","short_name":"hamburger","sort_order":26,"sheet_x":7,"sheet_y":21},{"name":"FRENCH FRIES","hex":"1F35F","short_name":"fries","sort_order":27,"sheet_x":7,"sheet_y":32},{"name":"HOT DOG","hex":"1F32D","short_name":"hotdog","sort_order":28,"sheet_x":6,"sheet_y":23},{"name":"SLICE OF PIZZA","hex":"1F355","short_name":"pizza","sort_order":29,"sheet_x":7,"sheet_y":22},{"name":"SPAGHETTI","hex":"1F35D","short_name":"spaghetti","sort_order":30,"sheet_x":7,"sheet_y":30},{"name":"TACO","hex":"1F32E","short_name":"taco","sort_order":31,"sheet_x":6,"sheet_y":24},{"name":"BURRITO","hex":"1F32F","short_name":"burrito","sort_order":32,"sheet_x":6,"sheet_y":25},{"name":"STEAMING BOWL","hex":"1F35C","short_name":"ramen","sort_order":33,"sheet_x":7,"sheet_y":29},{"name":"POT OF FOOD","hex":"1F372","short_name":"stew","sort_order":34,"sheet_x":8,"sheet_y":10},{"name":"FISH CAKE WITH SWIRL DESIGN","hex":"1F365","short_name":"fish_cake","sort_order":35,"sheet_x":7,"sheet_y":38},{"name":"SUSHI","hex":"1F363","short_name":"sushi","sort_order":36,"sheet_x":7,"sheet_y":36},{"name":"BENTO BOX","hex":"1F371","short_name":"bento","sort_order":37,"sheet_x":8,"sheet_y":9},{"name":"CURRY AND RICE","hex":"1F35B","short_name":"curry","sort_order":38,"sheet_x":7,"sheet_y":28},{"name":"RICE BALL","hex":"1F359","short_name":"rice_ball","sort_order":39,"sheet_x":7,"sheet_y":26},{"name":"COOKED RICE","hex":"1F35A","short_name":"rice","sort_order":40,"sheet_x":7,"sheet_y":27},{"name":"RICE CRACKER","hex":"1F358","short_name":"rice_cracker","sort_order":41,"sheet_x":7,"sheet_y":25},{"name":"ODEN","hex":"1F362","short_name":"oden","sort_order":42,"sheet_x":7,"sheet_y":35},{"name":"DANGO","hex":"1F361","short_name":"dango","sort_order":43,"sheet_x":7,"sheet_y":34},{"name":"SHAVED ICE","hex":"1F367","short_name":"shaved_ice","sort_order":44,"sheet_x":7,"sheet_y":40},{"name":"ICE CREAM","hex":"1F368","short_name":"ice_cream","sort_order":45,"sheet_x":8,"sheet_y":0},{"name":"SOFT ICE CREAM","hex":"1F366","short_name":"icecream","sort_order":46,"sheet_x":7,"sheet_y":39},{"name":"SHORTCAKE","hex":"1F370","short_name":"cake","sort_order":47,"sheet_x":8,"sheet_y":8},{"name":"BIRTHDAY CAKE","hex":"1F382","short_name":"birthday","sort_order":48,"sheet_x":8,"sheet_y":26},{"name":"CUSTARD","hex":"1F36E","short_name":"custard","sort_order":49,"sheet_x":8,"sheet_y":6},{"name":"CANDY","hex":"1F36C","short_name":"candy","sort_order":50,"sheet_x":8,"sheet_y":4},{"name":"LOLLIPOP","hex":"1F36D","short_name":"lollipop","sort_order":51,"sheet_x":8,"sheet_y":5},{"name":"CHOCOLATE BAR","hex":"1F36B","short_name":"chocolate_bar","sort_order":52,"sheet_x":8,"sheet_y":3},{"name":"POPCORN","hex":"1F37F","short_name":"popcorn","sort_order":53,"sheet_x":8,"sheet_y":23},{"name":"DOUGHNUT","hex":"1F369","short_name":"doughnut","sort_order":54,"sheet_x":8,"sheet_y":1},{"name":"COOKIE","hex":"1F36A","short_name":"cookie","sort_order":55,"sheet_x":8,"sheet_y":2},{"name":"BEER MUG","hex":"1F37A","short_name":"beer","sort_order":56,"sheet_x":8,"sheet_y":18},{"name":"CLINKING BEER MUGS","hex":"1F37B","short_name":"beers","sort_order":57,"sheet_x":8,"sheet_y":19},{"name":"WINE GLASS","hex":"1F377","short_name":"wine_glass","sort_order":58,"sheet_x":8,"sheet_y":15},{"name":"COCKTAIL GLASS","hex":"1F378","short_name":"cocktail","sort_order":59,"sheet_x":8,"sheet_y":16},{"name":"TROPICAL DRINK","hex":"1F379","short_name":"tropical_drink","sort_order":60,"sheet_x":8,"sheet_y":17},{"name":"BOTTLE WITH POPPING CORK","hex":"1F37E","short_name":"champagne","sort_order":61,"sheet_x":8,"sheet_y":22},{"name":"SAKE BOTTLE AND CUP","hex":"1F376","short_name":"sake","sort_order":62,"sheet_x":8,"sheet_y":14},{"name":"TEACUP WITHOUT HANDLE","hex":"1F375","short_name":"tea","sort_order":63,"sheet_x":8,"sheet_y":13},{"name":"HOT BEVERAGE","hex":"2615","short_name":"coffee","sort_order":64,"sheet_x":1,"sheet_y":8},{"name":"BABY BOTTLE","hex":"1F37C","short_name":"baby_bottle","sort_order":65,"sheet_x":8,"sheet_y":20},{"name":"FORK AND KNIFE","hex":"1F374","short_name":"fork_and_knife","sort_order":66,"sheet_x":8,"sheet_y":12},{"name":"FORK AND KNIFE WITH PLATE","hex":"1F37D","short_name":"knife_fork_plate","sort_order":67,"sheet_x":8,"sheet_y":21}],"short_name":"Foods","class":"cm-emoji-pizza","name":"Food & Drink","order":3},{"emoji":[{"name":"SOCCER BALL","hex":"26BD","short_name":"soccer","sort_order":1,"sheet_x":2,"sheet_y":18},{"name":"BASKETBALL AND HOOP","hex":"1F3C0","short_name":"basketball","sort_order":2,"sheet_x":10,"sheet_y":6},{"name":"AMERICAN FOOTBALL","hex":"1F3C8","short_name":"football","sort_order":3,"sheet_x":10,"sheet_y":24},{"name":"BASEBALL","hex":"26BE","short_name":"baseball","sort_order":4,"sheet_x":2,"sheet_y":19},{"name":"TENNIS RACQUET AND BALL","hex":"1F3BE","short_name":"tennis","sort_order":5,"sheet_x":10,"sheet_y":4},{"name":"VOLLEYBALL","hex":"1F3D0","short_name":"volleyball","sort_order":6,"sheet_x":11,"sheet_y":1},{"name":"RUGBY FOOTBALL","hex":"1F3C9","short_name":"rugby_football","sort_order":7,"sheet_x":10,"sheet_y":25},{"name":"BILLIARDS","hex":"1F3B1","short_name":"8ball","sort_order":8,"sheet_x":9,"sheet_y":32},{"name":"FLAG IN HOLE","hex":"26F3","short_name":"golf","sort_order":9,"sheet_x":2,"sheet_y":33},{"name":"GOLFER","hex":"1F3CC","short_name":"golfer","sort_order":10,"sheet_x":10,"sheet_y":38},{"name":"TABLE TENNIS PADDLE AND BALL","hex":"1F3D3","short_name":"table_tennis_paddle_and_ball","sort_order":11,"sheet_x":11,"sheet_y":4},{"name":"BADMINTON RACQUET AND SHUTTLECOCK","hex":"1F3F8","short_name":"badminton_racquet_and_shuttlecock","sort_order":12,"sheet_x":11,"sheet_y":38},{"name":"ICE HOCKEY STICK AND PUCK","hex":"1F3D2","short_name":"ice_hockey_stick_and_puck","sort_order":13,"sheet_x":11,"sheet_y":3},{"name":"FIELD HOCKEY STICK AND BALL","hex":"1F3D1","short_name":"field_hockey_stick_and_ball","sort_order":14,"sheet_x":11,"sheet_y":2},{"name":"CRICKET BAT AND BALL","hex":"1F3CF","short_name":"cricket_bat_and_ball","sort_order":15,"sheet_x":11,"sheet_y":0},{"name":"SKI AND SKI BOOT","hex":"1F3BF","short_name":"ski","sort_order":16,"sheet_x":10,"sheet_y":5},{"name":"SKIER","hex":"26F7","short_name":"skier","sort_order":17,"sheet_x":2,"sheet_y":36},{"name":"SNOWBOARDER","hex":"1F3C2","short_name":"snowboarder","sort_order":18,"sheet_x":10,"sheet_y":8},{"name":"ICE SKATE","hex":"26F8","short_name":"ice_skate","sort_order":19,"sheet_x":2,"sheet_y":37},{"name":"BOW AND ARROW","hex":"1F3F9","short_name":"bow_and_arrow","sort_order":20,"sheet_x":11,"sheet_y":39},{"name":"FISHING POLE AND FISH","hex":"1F3A3","short_name":"fishing_pole_and_fish","sort_order":21,"sheet_x":9,"sheet_y":18},{"name":"ROWBOAT","hex":"1F6A3","short_name":"rowboat","sort_order":22,"sheet_x":30,"sheet_y":6},{"name":"SWIMMER","hex":"1F3CA","short_name":"swimmer","sort_order":23,"sheet_x":10,"sheet_y":26},{"name":"SURFER","hex":"1F3C4","short_name":"surfer","sort_order":24,"sheet_x":10,"sheet_y":15},{"name":"BATH","hex":"1F6C0","short_name":"bath","sort_order":25,"sheet_x":31,"sheet_y":14},{"name":"PERSON WITH BALL","hex":"26F9","short_name":"person_with_ball","sort_order":26,"sheet_x":2,"sheet_y":38},{"name":"WEIGHT LIFTER","hex":"1F3CB","short_name":"weight_lifter","sort_order":27,"sheet_x":10,"sheet_y":32},{"name":"BICYCLIST","hex":"1F6B4","short_name":"bicyclist","sort_order":28,"sheet_x":30,"sheet_y":28},{"name":"MOUNTAIN BICYCLIST","hex":"1F6B5","short_name":"mountain_bicyclist","sort_order":29,"sheet_x":30,"sheet_y":34},{"name":"HORSE RACING","hex":"1F3C7","short_name":"horse_racing","sort_order":30,"sheet_x":10,"sheet_y":23},{"name":"MAN IN BUSINESS SUIT LEVITATING","hex":"1F574","short_name":"man_in_business_suit_levitating","sort_order":31,"sheet_x":24,"sheet_y":38},{"name":"TROPHY","hex":"1F3C6","short_name":"trophy","sort_order":32,"sheet_x":10,"sheet_y":22},{"name":"RUNNING SHIRT WITH SASH","hex":"1F3BD","short_name":"running_shirt_with_sash","sort_order":33,"sheet_x":10,"sheet_y":3},{"name":"SPORTS MEDAL","hex":"1F3C5","short_name":"sports_medal","sort_order":34,"sheet_x":10,"sheet_y":21},{"name":"MILITARY MEDAL","hex":"1F396","short_name":"medal","sort_order":35,"sheet_x":9,"sheet_y":8},{"name":"REMINDER RIBBON","hex":"1F397","short_name":"reminder_ribbon","sort_order":36,"sheet_x":9,"sheet_y":9},{"name":"ROSETTE","hex":"1F3F5","short_name":"rosette","sort_order":37,"sheet_x":11,"sheet_y":36},{"name":"TICKET","hex":"1F3AB","short_name":"ticket","sort_order":38,"sheet_x":9,"sheet_y":26},{"name":"ADMISSION TICKETS","hex":"1F39F","short_name":"admission_tickets","sort_order":39,"sheet_x":9,"sheet_y":14},{"name":"PERFORMING ARTS","hex":"1F3AD","short_name":"performing_arts","sort_order":40,"sheet_x":9,"sheet_y":28},{"name":"ARTIST PALETTE","hex":"1F3A8","short_name":"art","sort_order":41,"sheet_x":9,"sheet_y":23},{"name":"CIRCUS TENT","hex":"1F3AA","short_name":"circus_tent","sort_order":42,"sheet_x":9,"sheet_y":25},{"name":"MICROPHONE","hex":"1F3A4","short_name":"microphone","sort_order":43,"sheet_x":9,"sheet_y":19},{"name":"HEADPHONE","hex":"1F3A7","short_name":"headphones","sort_order":44,"sheet_x":9,"sheet_y":22},{"name":"MUSICAL SCORE","hex":"1F3BC","short_name":"musical_score","sort_order":45,"sheet_x":10,"sheet_y":2},{"name":"MUSICAL KEYBOARD","hex":"1F3B9","short_name":"musical_keyboard","sort_order":46,"sheet_x":9,"sheet_y":40},{"name":"SAXOPHONE","hex":"1F3B7","short_name":"saxophone","sort_order":47,"sheet_x":9,"sheet_y":38},{"name":"TRUMPET","hex":"1F3BA","short_name":"trumpet","sort_order":48,"sheet_x":10,"sheet_y":0},{"name":"GUITAR","hex":"1F3B8","short_name":"guitar","sort_order":49,"sheet_x":9,"sheet_y":39},{"name":"VIOLIN","hex":"1F3BB","short_name":"violin","sort_order":50,"sheet_x":10,"sheet_y":1},{"name":"CLAPPER BOARD","hex":"1F3AC","short_name":"clapper","sort_order":51,"sheet_x":9,"sheet_y":27},{"name":"VIDEO GAME","hex":"1F3AE","short_name":"video_game","sort_order":52,"sheet_x":9,"sheet_y":29},{"name":"ALIEN MONSTER","hex":"1F47E","short_name":"space_invader","sort_order":53,"sheet_x":18,"sheet_y":25},{"name":"DIRECT HIT","hex":"1F3AF","short_name":"dart","sort_order":54,"sheet_x":9,"sheet_y":30},{"name":"GAME DIE","hex":"1F3B2","short_name":"game_die","sort_order":55,"sheet_x":9,"sheet_y":33},{"name":"SLOT MACHINE","hex":"1F3B0","short_name":"slot_machine","sort_order":56,"sheet_x":9,"sheet_y":31},{"name":"BOWLING","hex":"1F3B3","short_name":"bowling","sort_order":57,"sheet_x":9,"sheet_y":34}],"short_name":"Activity","class":"cm-emoji-football","name":"Activity","order":4},{"emoji":[{"name":"AUTOMOBILE","hex":"1F697","short_name":"car","sort_order":1,"sheet_x":29,"sheet_y":35},{"name":"TAXI","hex":"1F695","short_name":"taxi","sort_order":2,"sheet_x":29,"sheet_y":33},{"name":"RECREATIONAL VEHICLE","hex":"1F699","short_name":"blue_car","sort_order":3,"sheet_x":29,"sheet_y":37},{"name":"BUS","hex":"1F68C","short_name":"bus","sort_order":4,"sheet_x":29,"sheet_y":24},{"name":"TROLLEYBUS","hex":"1F68E","short_name":"trolleybus","sort_order":5,"sheet_x":29,"sheet_y":26},{"name":"RACING CAR","hex":"1F3CE","short_name":"racing_car","sort_order":6,"sheet_x":10,"sheet_y":40},{"name":"POLICE CAR","hex":"1F693","short_name":"police_car","sort_order":7,"sheet_x":29,"sheet_y":31},{"name":"AMBULANCE","hex":"1F691","short_name":"ambulance","sort_order":8,"sheet_x":29,"sheet_y":29},{"name":"FIRE ENGINE","hex":"1F692","short_name":"fire_engine","sort_order":9,"sheet_x":29,"sheet_y":30},{"name":"MINIBUS","hex":"1F690","short_name":"minibus","sort_order":10,"sheet_x":29,"sheet_y":28},{"name":"DELIVERY TRUCK","hex":"1F69A","short_name":"truck","sort_order":11,"sheet_x":29,"sheet_y":38},{"name":"ARTICULATED LORRY","hex":"1F69B","short_name":"articulated_lorry","sort_order":12,"sheet_x":29,"sheet_y":39},{"name":"TRACTOR","hex":"1F69C","short_name":"tractor","sort_order":13,"sheet_x":29,"sheet_y":40},{"name":"RACING MOTORCYCLE","hex":"1F3CD","short_name":"racing_motorcycle","sort_order":14,"sheet_x":10,"sheet_y":39},{"name":"BICYCLE","hex":"1F6B2","short_name":"bike","sort_order":15,"sheet_x":30,"sheet_y":26},{"name":"POLICE CARS REVOLVING LIGHT","hex":"1F6A8","short_name":"rotating_light","sort_order":16,"sheet_x":30,"sheet_y":16},{"name":"ONCOMING POLICE CAR","hex":"1F694","short_name":"oncoming_police_car","sort_order":17,"sheet_x":29,"sheet_y":32},{"name":"ONCOMING BUS","hex":"1F68D","short_name":"oncoming_bus","sort_order":18,"sheet_x":29,"sheet_y":25},{"name":"ONCOMING AUTOMOBILE","hex":"1F698","short_name":"oncoming_automobile","sort_order":19,"sheet_x":29,"sheet_y":36},{"name":"ONCOMING TAXI","hex":"1F696","short_name":"oncoming_taxi","sort_order":20,"sheet_x":29,"sheet_y":34},{"name":"AERIAL TRAMWAY","hex":"1F6A1","short_name":"aerial_tramway","sort_order":21,"sheet_x":30,"sheet_y":4},{"name":"MOUNTAIN CABLEWAY","hex":"1F6A0","short_name":"mountain_cableway","sort_order":22,"sheet_x":30,"sheet_y":3},{"name":"SUSPENSION RAILWAY","hex":"1F69F","short_name":"suspension_railway","sort_order":23,"sheet_x":30,"sheet_y":2},{"name":"RAILWAY CAR","hex":"1F683","short_name":"railway_car","sort_order":24,"sheet_x":29,"sheet_y":15},{"name":"TRAM CAR","hex":"1F68B","short_name":"train","sort_order":25,"sheet_x":29,"sheet_y":23},{"name":"MONORAIL","hex":"1F69D","short_name":"monorail","sort_order":26,"sheet_x":30,"sheet_y":0},{"name":"HIGH-SPEED TRAIN","hex":"1F684","short_name":"bullettrain_side","sort_order":27,"sheet_x":29,"sheet_y":16},{"name":"HIGH-SPEED TRAIN WITH BULLET NOSE","hex":"1F685","short_name":"bullettrain_front","sort_order":28,"sheet_x":29,"sheet_y":17},{"name":"LIGHT RAIL","hex":"1F688","short_name":"light_rail","sort_order":29,"sheet_x":29,"sheet_y":20},{"name":"MOUNTAIN RAILWAY","hex":"1F69E","short_name":"mountain_railway","sort_order":30,"sheet_x":30,"sheet_y":1},{"name":"STEAM LOCOMOTIVE","hex":"1F682","short_name":"steam_locomotive","sort_order":31,"sheet_x":29,"sheet_y":14},{"name":"TRAIN","hex":"1F686","short_name":"train2","sort_order":32,"sheet_x":29,"sheet_y":18},{"name":"METRO","hex":"1F687","short_name":"metro","sort_order":33,"sheet_x":29,"sheet_y":19},{"name":"TRAM","hex":"1F68A","short_name":"tram","sort_order":34,"sheet_x":29,"sheet_y":22},{"name":"STATION","hex":"1F689","short_name":"station","sort_order":35,"sheet_x":29,"sheet_y":21},{"name":"HELICOPTER","hex":"1F681","short_name":"helicopter","sort_order":36,"sheet_x":29,"sheet_y":13},{"name":"SMALL AIRPLANE","hex":"1F6E9","short_name":"small_airplane","sort_order":37,"sheet_x":31,"sheet_y":37},{"name":"AIRPLANE","hex":"2708","short_name":"airplane","sort_order":38,"sheet_x":3,"sheet_y":7},{"name":"AIRPLANE DEPARTURE","hex":"1F6EB","short_name":"airplane_departure","sort_order":39,"sheet_x":31,"sheet_y":38},{"name":"AIRPLANE ARRIVING","hex":"1F6EC","short_name":"airplane_arriving","sort_order":40,"sheet_x":31,"sheet_y":39},{"name":"SAILBOAT","hex":"26F5","short_name":"boat","sort_order":41,"sheet_x":2,"sheet_y":35},{"name":"MOTOR BOAT","hex":"1F6E5","short_name":"motor_boat","sort_order":42,"sheet_x":31,"sheet_y":36},{"name":"SPEEDBOAT","hex":"1F6A4","short_name":"speedboat","sort_order":43,"sheet_x":30,"sheet_y":12},{"name":"FERRY","hex":"26F4","short_name":"ferry","sort_order":44,"sheet_x":2,"sheet_y":34},{"name":"PASSENGER SHIP","hex":"1F6F3","short_name":"passenger_ship","sort_order":45,"sheet_x":32,"sheet_y":0},{"name":"ROCKET","hex":"1F680","short_name":"rocket","sort_order":46,"sheet_x":29,"sheet_y":12},{"name":"SATELLITE","hex":"1F6F0","short_name":"satellite","sort_order":47,"sheet_x":31,"sheet_y":40},{"name":"SEAT","hex":"1F4BA","short_name":"seat","sort_order":48,"sheet_x":20,"sheet_y":38},{"name":"ANCHOR","hex":"2693","short_name":"anchor","sort_order":49,"sheet_x":2,"sheet_y":5},{"name":"CONSTRUCTION SIGN","hex":"1F6A7","short_name":"construction","sort_order":50,"sheet_x":30,"sheet_y":15},{"name":"FUEL PUMP","hex":"26FD","short_name":"fuelpump","sort_order":51,"sheet_x":3,"sheet_y":4},{"name":"BUS STOP","hex":"1F68F","short_name":"busstop","sort_order":52,"sheet_x":29,"sheet_y":27},{"name":"VERTICAL TRAFFIC LIGHT","hex":"1F6A6","short_name":"vertical_traffic_light","sort_order":53,"sheet_x":30,"sheet_y":14},{"name":"HORIZONTAL TRAFFIC LIGHT","hex":"1F6A5","short_name":"traffic_light","sort_order":54,"sheet_x":30,"sheet_y":13},{"name":"CHEQUERED FLAG","hex":"1F3C1","short_name":"checkered_flag","sort_order":55,"sheet_x":10,"sheet_y":7},{"name":"SHIP","hex":"1F6A2","short_name":"ship","sort_order":56,"sheet_x":30,"sheet_y":5},{"name":"FERRIS WHEEL","hex":"1F3A1","short_name":"ferris_wheel","sort_order":57,"sheet_x":9,"sheet_y":16},{"name":"ROLLER COASTER","hex":"1F3A2","short_name":"roller_coaster","sort_order":58,"sheet_x":9,"sheet_y":17},{"name":"CAROUSEL HORSE","hex":"1F3A0","short_name":"carousel_horse","sort_order":59,"sheet_x":9,"sheet_y":15},{"name":"BUILDING CONSTRUCTION","hex":"1F3D7","short_name":"building_construction","sort_order":60,"sheet_x":11,"sheet_y":8},{"name":"FOGGY","hex":"1F301","short_name":"foggy","sort_order":61,"sheet_x":5,"sheet_y":22},{"name":"TOKYO TOWER","hex":"1F5FC","short_name":"tokyo_tower","sort_order":62,"sheet_x":26,"sheet_y":11},{"name":"FACTORY","hex":"1F3ED","short_name":"factory","sort_order":63,"sheet_x":11,"sheet_y":30},{"name":"FOUNTAIN","hex":"26F2","short_name":"fountain","sort_order":64,"sheet_x":2,"sheet_y":32},{"name":"MOON VIEWING CEREMONY","hex":"1F391","short_name":"rice_scene","sort_order":65,"sheet_x":9,"sheet_y":5},{"name":"MOUNTAIN","hex":"26F0","short_name":"mountain","sort_order":66,"sheet_x":2,"sheet_y":30},{"name":"SNOW CAPPED MOUNTAIN","hex":"1F3D4","short_name":"snow_capped_mountain","sort_order":67,"sheet_x":11,"sheet_y":5},{"name":"MOUNT FUJI","hex":"1F5FB","short_name":"mount_fuji","sort_order":68,"sheet_x":26,"sheet_y":10},{"name":"VOLCANO","hex":"1F30B","short_name":"volcano","sort_order":69,"sheet_x":5,"sheet_y":32},{"name":"SILHOUETTE OF JAPAN","hex":"1F5FE","short_name":"japan","sort_order":70,"sheet_x":26,"sheet_y":13},{"name":"CAMPING","hex":"1F3D5","short_name":"camping","sort_order":71,"sheet_x":11,"sheet_y":6},{"name":"TENT","hex":"26FA","short_name":"tent","sort_order":72,"sheet_x":3,"sheet_y":3},{"name":"NATIONAL PARK","hex":"1F3DE","short_name":"national_park","sort_order":73,"sheet_x":11,"sheet_y":15},{"name":"MOTORWAY","hex":"1F6E3","short_name":"motorway","sort_order":74,"sheet_x":31,"sheet_y":34},{"name":"RAILWAY TRACK","hex":"1F6E4","short_name":"railway_track","sort_order":75,"sheet_x":31,"sheet_y":35},{"name":"SUNRISE","hex":"1F305","short_name":"sunrise","sort_order":76,"sheet_x":5,"sheet_y":26},{"name":"SUNRISE OVER MOUNTAINS","hex":"1F304","short_name":"sunrise_over_mountains","sort_order":77,"sheet_x":5,"sheet_y":25},{"name":"DESERT","hex":"1F3DC","short_name":"desert","sort_order":78,"sheet_x":11,"sheet_y":13},{"name":"BEACH WITH UMBRELLA","hex":"1F3D6","short_name":"beach_with_umbrella","sort_order":79,"sheet_x":11,"sheet_y":7},{"name":"DESERT ISLAND","hex":"1F3DD","short_name":"desert_island","sort_order":80,"sheet_x":11,"sheet_y":14},{"name":"SUNSET OVER BUILDINGS","hex":"1F307","short_name":"city_sunrise","sort_order":81,"sheet_x":5,"sheet_y":28},{"name":"CITYSCAPE AT DUSK","hex":"1F306","short_name":"city_sunset","sort_order":82,"sheet_x":5,"sheet_y":27},{"name":"CITYSCAPE","hex":"1F3D9","short_name":"cityscape","sort_order":83,"sheet_x":11,"sheet_y":10},{"name":"NIGHT WITH STARS","hex":"1F303","short_name":"night_with_stars","sort_order":84,"sheet_x":5,"sheet_y":24},{"name":"BRIDGE AT NIGHT","hex":"1F309","short_name":"bridge_at_night","sort_order":85,"sheet_x":5,"sheet_y":30},{"name":"MILKY WAY","hex":"1F30C","short_name":"milky_way","sort_order":86,"sheet_x":5,"sheet_y":33},{"name":"SHOOTING STAR","hex":"1F320","short_name":"stars","sort_order":87,"sheet_x":6,"sheet_y":12},{"name":"FIREWORK SPARKLER","hex":"1F387","short_name":"sparkler","sort_order":88,"sheet_x":8,"sheet_y":36},{"name":"FIREWORKS","hex":"1F386","short_name":"fireworks","sort_order":89,"sheet_x":8,"sheet_y":35},{"name":"RAINBOW","hex":"1F308","short_name":"rainbow","sort_order":90,"sheet_x":5,"sheet_y":29},{"name":"HOUSE BUILDINGS","hex":"1F3D8","short_name":"house_buildings","sort_order":91,"sheet_x":11,"sheet_y":9},{"name":"EUROPEAN CASTLE","hex":"1F3F0","short_name":"european_castle","sort_order":92,"sheet_x":11,"sheet_y":33},{"name":"JAPANESE CASTLE","hex":"1F3EF","short_name":"japanese_castle","sort_order":93,"sheet_x":11,"sheet_y":32},{"name":"STADIUM","hex":"1F3DF","short_name":"stadium","sort_order":94,"sheet_x":11,"sheet_y":16},{"name":"STATUE OF LIBERTY","hex":"1F5FD","short_name":"statue_of_liberty","sort_order":95,"sheet_x":26,"sheet_y":12},{"name":"HOUSE BUILDING","hex":"1F3E0","short_name":"house","sort_order":96,"sheet_x":11,"sheet_y":17},{"name":"HOUSE WITH GARDEN","hex":"1F3E1","short_name":"house_with_garden","sort_order":97,"sheet_x":11,"sheet_y":18},{"name":"DERELICT HOUSE BUILDING","hex":"1F3DA","short_name":"derelict_house_building","sort_order":98,"sheet_x":11,"sheet_y":11},{"name":"OFFICE BUILDING","hex":"1F3E2","short_name":"office","sort_order":99,"sheet_x":11,"sheet_y":19},{"name":"DEPARTMENT STORE","hex":"1F3EC","short_name":"department_store","sort_order":100,"sheet_x":11,"sheet_y":29},{"name":"JAPANESE POST OFFICE","hex":"1F3E3","short_name":"post_office","sort_order":101,"sheet_x":11,"sheet_y":20},{"name":"EUROPEAN POST OFFICE","hex":"1F3E4","short_name":"european_post_office","sort_order":102,"sheet_x":11,"sheet_y":21},{"name":"HOSPITAL","hex":"1F3E5","short_name":"hospital","sort_order":103,"sheet_x":11,"sheet_y":22},{"name":"BANK","hex":"1F3E6","short_name":"bank","sort_order":104,"sheet_x":11,"sheet_y":23},{"name":"HOTEL","hex":"1F3E8","short_name":"hotel","sort_order":105,"sheet_x":11,"sheet_y":25},{"name":"CONVENIENCE STORE","hex":"1F3EA","short_name":"convenience_store","sort_order":106,"sheet_x":11,"sheet_y":27},{"name":"SCHOOL","hex":"1F3EB","short_name":"school","sort_order":107,"sheet_x":11,"sheet_y":28},{"name":"LOVE HOTEL","hex":"1F3E9","short_name":"love_hotel","sort_order":108,"sheet_x":11,"sheet_y":26},{"name":"WEDDING","hex":"1F492","short_name":"wedding","sort_order":109,"sheet_x":19,"sheet_y":34},{"name":"CLASSICAL BUILDING","hex":"1F3DB","short_name":"classical_building","sort_order":110,"sheet_x":11,"sheet_y":12},{"name":"CHURCH","hex":"26EA","short_name":"church","sort_order":111,"sheet_x":2,"sheet_y":29},{"name":"MOSQUE","hex":"1F54C","short_name":"mosque","sort_order":112,"sheet_x":24,"sheet_y":8},{"name":"SYNAGOGUE","hex":"1F54D","short_name":"synagogue","sort_order":113,"sheet_x":24,"sheet_y":9},{"name":"KAABA","hex":"1F54B","short_name":"kaaba","sort_order":114,"sheet_x":24,"sheet_y":7},{"name":"SHINTO SHRINE","hex":"26E9","short_name":"shinto_shrine","sort_order":115,"sheet_x":2,"sheet_y":28}],"short_name":"Places","class":"cm-emoji-airplane","name":"Travel & Places","order":5},{"emoji":[{"name":"WATCH","hex":"231A","short_name":"watch","sort_order":1,"sheet_x":0,"sheet_y":14},{"name":"MOBILE PHONE","hex":"1F4F1","short_name":"iphone","sort_order":2,"sheet_x":22,"sheet_y":11},{"name":"MOBILE PHONE WITH RIGHTWARDS ARROW AT LEFT","hex":"1F4F2","short_name":"calling","sort_order":3,"sheet_x":22,"sheet_y":12},{"name":"PERSONAL COMPUTER","hex":"1F4BB","short_name":"computer","sort_order":4,"sheet_x":20,"sheet_y":39},{"name":"KEYBOARD","hex":"2328","short_name":"keyboard","sort_order":5,"sheet_x":0,"sheet_y":16},{"name":"DESKTOP COMPUTER","hex":"1F5A5","short_name":"desktop_computer","sort_order":6,"sheet_x":25,"sheet_y":31},{"name":"PRINTER","hex":"1F5A8","short_name":"printer","sort_order":7,"sheet_x":25,"sheet_y":32},{"name":"THREE BUTTON MOUSE","hex":"1F5B1","short_name":"three_button_mouse","sort_order":8,"sheet_x":25,"sheet_y":33},{"name":"TRACKBALL","hex":"1F5B2","short_name":"trackball","sort_order":9,"sheet_x":25,"sheet_y":34},{"name":"JOYSTICK","hex":"1F579","short_name":"joystick","sort_order":10,"sheet_x":25,"sheet_y":7},{"name":"COMPRESSION","hex":"1F5DC","short_name":"compression","sort_order":11,"sheet_x":26,"sheet_y":1},{"name":"MINIDISC","hex":"1F4BD","short_name":"minidisc","sort_order":12,"sheet_x":21,"sheet_y":0},{"name":"FLOPPY DISK","hex":"1F4BE","short_name":"floppy_disk","sort_order":13,"sheet_x":21,"sheet_y":1},{"name":"OPTICAL DISC","hex":"1F4BF","short_name":"cd","sort_order":14,"sheet_x":21,"sheet_y":2},{"name":"DVD","hex":"1F4C0","short_name":"dvd","sort_order":15,"sheet_x":21,"sheet_y":3},{"name":"VIDEOCASSETTE","hex":"1F4FC","short_name":"vhs","sort_order":16,"sheet_x":22,"sheet_y":22},{"name":"CAMERA","hex":"1F4F7","short_name":"camera","sort_order":17,"sheet_x":22,"sheet_y":17},{"name":"CAMERA WITH FLASH","hex":"1F4F8","short_name":"camera_with_flash","sort_order":18,"sheet_x":22,"sheet_y":18},{"name":"VIDEO CAMERA","hex":"1F4F9","short_name":"video_camera","sort_order":19,"sheet_x":22,"sheet_y":19},{"name":"MOVIE CAMERA","hex":"1F3A5","short_name":"movie_camera","sort_order":20,"sheet_x":9,"sheet_y":20},{"name":"FILM PROJECTOR","hex":"1F4FD","short_name":"film_projector","sort_order":21,"sheet_x":22,"sheet_y":23},{"name":"FILM FRAMES","hex":"1F39E","short_name":"film_frames","sort_order":22,"sheet_x":9,"sheet_y":13},{"name":"TELEPHONE RECEIVER","hex":"1F4DE","short_name":"telephone_receiver","sort_order":23,"sheet_x":21,"sheet_y":33},{"name":"BLACK TELEPHONE","hex":"260E","short_name":"phone","sort_order":24,"sheet_x":1,"sheet_y":5},{"name":"PAGER","hex":"1F4DF","short_name":"pager","sort_order":25,"sheet_x":21,"sheet_y":34},{"name":"FAX MACHINE","hex":"1F4E0","short_name":"fax","sort_order":26,"sheet_x":21,"sheet_y":35},{"name":"TELEVISION","hex":"1F4FA","short_name":"tv","sort_order":27,"sheet_x":22,"sheet_y":20},{"name":"RADIO","hex":"1F4FB","short_name":"radio","sort_order":28,"sheet_x":22,"sheet_y":21},{"name":"STUDIO MICROPHONE","hex":"1F399","short_name":"studio_microphone","sort_order":29,"sheet_x":9,"sheet_y":10},{"name":"LEVEL SLIDER","hex":"1F39A","short_name":"level_slider","sort_order":30,"sheet_x":9,"sheet_y":11},{"name":"CONTROL KNOBS","hex":"1F39B","short_name":"control_knobs","sort_order":31,"sheet_x":9,"sheet_y":12},{"name":"STOPWATCH","hex":"23F1","short_name":"stopwatch","sort_order":32,"sheet_x":0,"sheet_y":26},{"name":"TIMER CLOCK","hex":"23F2","short_name":"timer_clock","sort_order":33,"sheet_x":0,"sheet_y":27},{"name":"ALARM CLOCK","hex":"23F0","short_name":"alarm_clock","sort_order":34,"sheet_x":0,"sheet_y":25},{"name":"MANTELPIECE CLOCK","hex":"1F570","short_name":"mantelpiece_clock","sort_order":35,"sheet_x":24,"sheet_y":36},{"name":"HOURGLASS WITH FLOWING SAND","hex":"23F3","short_name":"hourglass_flowing_sand","sort_order":36,"sheet_x":0,"sheet_y":28},{"name":"HOURGLASS","hex":"231B","short_name":"hourglass","sort_order":37,"sheet_x":0,"sheet_y":15},{"name":"SATELLITE ANTENNA","hex":"1F4E1","short_name":"satellite_antenna","sort_order":38,"sheet_x":21,"sheet_y":36},{"name":"BATTERY","hex":"1F50B","short_name":"battery","sort_order":39,"sheet_x":22,"sheet_y":36},{"name":"ELECTRIC PLUG","hex":"1F50C","short_name":"electric_plug","sort_order":40,"sheet_x":22,"sheet_y":37},{"name":"ELECTRIC LIGHT BULB","hex":"1F4A1","short_name":"bulb","sort_order":41,"sheet_x":20,"sheet_y":8},{"name":"ELECTRIC TORCH","hex":"1F526","short_name":"flashlight","sort_order":42,"sheet_x":23,"sheet_y":22},{"name":"CANDLE","hex":"1F56F","short_name":"candle","sort_order":43,"sheet_x":24,"sheet_y":35},{"name":"WASTEBASKET","hex":"1F5D1","short_name":"wastebasket","sort_order":44,"sheet_x":25,"sheet_y":39},{"name":"OIL DRUM","hex":"1F6E2","short_name":"oil_drum","sort_order":45,"sheet_x":31,"sheet_y":33},{"name":"MONEY WITH WINGS","hex":"1F4B8","short_name":"money_with_wings","sort_order":46,"sheet_x":20,"sheet_y":36},{"name":"BANKNOTE WITH DOLLAR SIGN","hex":"1F4B5","short_name":"dollar","sort_order":47,"sheet_x":20,"sheet_y":33},{"name":"BANKNOTE WITH YEN SIGN","hex":"1F4B4","short_name":"yen","sort_order":48,"sheet_x":20,"sheet_y":32},{"name":"BANKNOTE WITH EURO SIGN","hex":"1F4B6","short_name":"euro","sort_order":49,"sheet_x":20,"sheet_y":34},{"name":"BANKNOTE WITH POUND SIGN","hex":"1F4B7","short_name":"pound","sort_order":50,"sheet_x":20,"sheet_y":35},{"name":"MONEY BAG","hex":"1F4B0","short_name":"moneybag","sort_order":51,"sheet_x":20,"sheet_y":28},{"name":"CREDIT CARD","hex":"1F4B3","short_name":"credit_card","sort_order":52,"sheet_x":20,"sheet_y":31},{"name":"GEM STONE","hex":"1F48E","short_name":"gem","sort_order":53,"sheet_x":19,"sheet_y":30},{"name":"SCALES","hex":"2696","short_name":"scales","sort_order":54,"sheet_x":2,"sheet_y":7},{"name":"WRENCH","hex":"1F527","short_name":"wrench","sort_order":55,"sheet_x":23,"sheet_y":23},{"name":"HAMMER","hex":"1F528","short_name":"hammer","sort_order":56,"sheet_x":23,"sheet_y":24},{"name":"HAMMER AND PICK","hex":"2692","short_name":"hammer_and_pick","sort_order":57,"sheet_x":2,"sheet_y":4},{"name":"HAMMER AND WRENCH","hex":"1F6E0","short_name":"hammer_and_wrench","sort_order":58,"sheet_x":31,"sheet_y":31},{"name":"PICK","hex":"26CF","short_name":"pick","sort_order":59,"sheet_x":2,"sheet_y":24},{"name":"NUT AND BOLT","hex":"1F529","short_name":"nut_and_bolt","sort_order":60,"sheet_x":23,"sheet_y":25},{"name":"GEAR","hex":"2699","short_name":"gear","sort_order":61,"sheet_x":2,"sheet_y":9},{"name":"CHAINS","hex":"26D3","short_name":"chains","sort_order":62,"sheet_x":2,"sheet_y":26},{"name":"PISTOL","hex":"1F52B","short_name":"gun","sort_order":63,"sheet_x":23,"sheet_y":27},{"name":"BOMB","hex":"1F4A3","short_name":"bomb","sort_order":64,"sheet_x":20,"sheet_y":10},{"name":"HOCHO","hex":"1F52A","short_name":"hocho","sort_order":65,"sheet_x":23,"sheet_y":26},{"name":"DAGGER KNIFE","hex":"1F5E1","short_name":"dagger_knife","sort_order":66,"sheet_x":26,"sheet_y":4},{"name":"CROSSED SWORDS","hex":"2694","short_name":"crossed_swords","sort_order":67,"sheet_x":2,"sheet_y":6},{"name":"SHIELD","hex":"1F6E1","short_name":"shield","sort_order":68,"sheet_x":31,"sheet_y":32},{"name":"SMOKING SYMBOL","hex":"1F6AC","short_name":"smoking","sort_order":69,"sheet_x":30,"sheet_y":20},{"name":"SKULL AND CROSSBONES","hex":"2620","short_name":"skull_and_crossbones","sort_order":70,"sheet_x":1,"sheet_y":16},{"name":"COFFIN","hex":"26B0","short_name":"coffin","sort_order":71,"sheet_x":2,"sheet_y":16},{"name":"FUNERAL URN","hex":"26B1","short_name":"funeral_urn","sort_order":72,"sheet_x":2,"sheet_y":17},{"name":"AMPHORA","hex":"1F3FA","short_name":"amphora","sort_order":73,"sheet_x":11,"sheet_y":40},{"name":"CRYSTAL BALL","hex":"1F52E","short_name":"crystal_ball","sort_order":74,"sheet_x":23,"sheet_y":30},{"name":"PRAYER BEADS","hex":"1F4FF","short_name":"prayer_beads","sort_order":75,"sheet_x":22,"sheet_y":24},{"name":"BARBER POLE","hex":"1F488","short_name":"barber","sort_order":76,"sheet_x":19,"sheet_y":24},{"name":"ALEMBIC","hex":"2697","short_name":"alembic","sort_order":77,"sheet_x":2,"sheet_y":8},{"name":"TELESCOPE","hex":"1F52D","short_name":"telescope","sort_order":78,"sheet_x":23,"sheet_y":29},{"name":"MICROSCOPE","hex":"1F52C","short_name":"microscope","sort_order":79,"sheet_x":23,"sheet_y":28},{"name":"HOLE","hex":"1F573","short_name":"hole","sort_order":80,"sheet_x":24,"sheet_y":37},{"name":"PILL","hex":"1F48A","short_name":"pill","sort_order":81,"sheet_x":19,"sheet_y":26},{"name":"SYRINGE","hex":"1F489","short_name":"syringe","sort_order":82,"sheet_x":19,"sheet_y":25},{"name":"THERMOMETER","hex":"1F321","short_name":"thermometer","sort_order":83,"sheet_x":6,"sheet_y":13},{"name":"LABEL","hex":"1F3F7","short_name":"label","sort_order":84,"sheet_x":11,"sheet_y":37},{"name":"BOOKMARK","hex":"1F516","short_name":"bookmark","sort_order":85,"sheet_x":23,"sheet_y":6},{"name":"TOILET","hex":"1F6BD","short_name":"toilet","sort_order":86,"sheet_x":31,"sheet_y":11},{"name":"SHOWER","hex":"1F6BF","short_name":"shower","sort_order":87,"sheet_x":31,"sheet_y":13},{"name":"BATHTUB","hex":"1F6C1","short_name":"bathtub","sort_order":88,"sheet_x":31,"sheet_y":20},{"name":"KEY","hex":"1F511","short_name":"key","sort_order":89,"sheet_x":23,"sheet_y":1},{"name":"OLD KEY","hex":"1F5DD","short_name":"old_key","sort_order":90,"sheet_x":26,"sheet_y":2},{"name":"COUCH AND LAMP","hex":"1F6CB","short_name":"couch_and_lamp","sort_order":91,"sheet_x":31,"sheet_y":25},{"name":"SLEEPING ACCOMMODATION","hex":"1F6CC","short_name":"sleeping_accommodation","sort_order":92,"sheet_x":31,"sheet_y":26},{"name":"BED","hex":"1F6CF","short_name":"bed","sort_order":93,"sheet_x":31,"sheet_y":29},{"name":"DOOR","hex":"1F6AA","short_name":"door","sort_order":94,"sheet_x":30,"sheet_y":18},{"name":"BELLHOP BELL","hex":"1F6CE","short_name":"bellhop_bell","sort_order":95,"sheet_x":31,"sheet_y":28},{"name":"FRAME WITH PICTURE","hex":"1F5BC","short_name":"frame_with_picture","sort_order":96,"sheet_x":25,"sheet_y":35},{"name":"WORLD MAP","hex":"1F5FA","short_name":"world_map","sort_order":97,"sheet_x":26,"sheet_y":9},{"name":"UMBRELLA ON GROUND","hex":"26F1","short_name":"umbrella_on_ground","sort_order":98,"sheet_x":2,"sheet_y":31},{"name":"MOYAI","hex":"1F5FF","short_name":"moyai","sort_order":99,"sheet_x":26,"sheet_y":14},{"name":"SHOPPING BAGS","hex":"1F6CD","short_name":"shopping_bags","sort_order":100,"sheet_x":31,"sheet_y":27},{"name":"BALLOON","hex":"1F388","short_name":"balloon","sort_order":101,"sheet_x":8,"sheet_y":37},{"name":"CARP STREAMER","hex":"1F38F","short_name":"flags","sort_order":102,"sheet_x":9,"sheet_y":3},{"name":"RIBBON","hex":"1F380","short_name":"ribbon","sort_order":103,"sheet_x":8,"sheet_y":24},{"name":"WRAPPED PRESENT","hex":"1F381","short_name":"gift","sort_order":104,"sheet_x":8,"sheet_y":25},{"name":"CONFETTI BALL","hex":"1F38A","short_name":"confetti_ball","sort_order":105,"sheet_x":8,"sheet_y":39},{"name":"PARTY POPPER","hex":"1F389","short_name":"tada","sort_order":106,"sheet_x":8,"sheet_y":38},{"name":"JAPANESE DOLLS","hex":"1F38E","short_name":"dolls","sort_order":107,"sheet_x":9,"sheet_y":2},{"name":"WIND CHIME","hex":"1F390","short_name":"wind_chime","sort_order":108,"sheet_x":9,"sheet_y":4},{"name":"CROSSED FLAGS","hex":"1F38C","short_name":"crossed_flags","sort_order":109,"sheet_x":9,"sheet_y":0},{"name":"IZAKAYA LANTERN","hex":"1F3EE","short_name":"izakaya_lantern","sort_order":110,"sheet_x":11,"sheet_y":31},{"name":"ENVELOPE","hex":"2709","short_name":"email","sort_order":111,"sheet_x":3,"sheet_y":8},{"name":"ENVELOPE WITH DOWNWARDS ARROW ABOVE","hex":"1F4E9","short_name":"envelope_with_arrow","sort_order":112,"sheet_x":22,"sheet_y":3},{"name":"INCOMING ENVELOPE","hex":"1F4E8","short_name":"incoming_envelope","sort_order":113,"sheet_x":22,"sheet_y":2},{"name":"E-MAIL SYMBOL","hex":"1F4E7","short_name":"e-mail","sort_order":114,"sheet_x":22,"sheet_y":1},{"name":"LOVE LETTER","hex":"1F48C","short_name":"love_letter","sort_order":115,"sheet_x":19,"sheet_y":28},{"name":"POSTBOX","hex":"1F4EE","short_name":"postbox","sort_order":116,"sheet_x":22,"sheet_y":8},{"name":"CLOSED MAILBOX WITH LOWERED FLAG","hex":"1F4EA","short_name":"mailbox_closed","sort_order":117,"sheet_x":22,"sheet_y":4},{"name":"CLOSED MAILBOX WITH RAISED FLAG","hex":"1F4EB","short_name":"mailbox","sort_order":118,"sheet_x":22,"sheet_y":5},{"name":"OPEN MAILBOX WITH RAISED FLAG","hex":"1F4EC","short_name":"mailbox_with_mail","sort_order":119,"sheet_x":22,"sheet_y":6},{"name":"OPEN MAILBOX WITH LOWERED FLAG","hex":"1F4ED","short_name":"mailbox_with_no_mail","sort_order":120,"sheet_x":22,"sheet_y":7},{"name":"PACKAGE","hex":"1F4E6","short_name":"package","sort_order":121,"sheet_x":22,"sheet_y":0},{"name":"POSTAL HORN","hex":"1F4EF","short_name":"postal_horn","sort_order":122,"sheet_x":22,"sheet_y":9},{"name":"INBOX TRAY","hex":"1F4E5","short_name":"inbox_tray","sort_order":123,"sheet_x":21,"sheet_y":40},{"name":"OUTBOX TRAY","hex":"1F4E4","short_name":"outbox_tray","sort_order":124,"sheet_x":21,"sheet_y":39},{"name":"SCROLL","hex":"1F4DC","short_name":"scroll","sort_order":125,"sheet_x":21,"sheet_y":31},{"name":"PAGE WITH CURL","hex":"1F4C3","short_name":"page_with_curl","sort_order":126,"sheet_x":21,"sheet_y":6},{"name":"BOOKMARK TABS","hex":"1F4D1","short_name":"bookmark_tabs","sort_order":127,"sheet_x":21,"sheet_y":20},{"name":"BAR CHART","hex":"1F4CA","short_name":"bar_chart","sort_order":128,"sheet_x":21,"sheet_y":13},{"name":"CHART WITH UPWARDS TREND","hex":"1F4C8","short_name":"chart_with_upwards_trend","sort_order":129,"sheet_x":21,"sheet_y":11},{"name":"CHART WITH DOWNWARDS TREND","hex":"1F4C9","short_name":"chart_with_downwards_trend","sort_order":130,"sheet_x":21,"sheet_y":12},{"name":"PAGE FACING UP","hex":"1F4C4","short_name":"page_facing_up","sort_order":131,"sheet_x":21,"sheet_y":7},{"name":"CALENDAR","hex":"1F4C5","short_name":"date","sort_order":132,"sheet_x":21,"sheet_y":8},{"name":"TEAR-OFF CALENDAR","hex":"1F4C6","short_name":"calendar","sort_order":133,"sheet_x":21,"sheet_y":9},{"name":"SPIRAL CALENDAR PAD","hex":"1F5D3","short_name":"spiral_calendar_pad","sort_order":134,"sheet_x":26,"sheet_y":0},{"name":"CARD INDEX","hex":"1F4C7","short_name":"card_index","sort_order":135,"sheet_x":21,"sheet_y":10},{"name":"CARD FILE BOX","hex":"1F5C3","short_name":"card_file_box","sort_order":136,"sheet_x":25,"sheet_y":37},{"name":"BALLOT BOX WITH BALLOT","hex":"1F5F3","short_name":"ballot_box_with_ballot","sort_order":137,"sheet_x":26,"sheet_y":8},{"name":"FILE CABINET","hex":"1F5C4","short_name":"file_cabinet","sort_order":138,"sheet_x":25,"sheet_y":38},{"name":"CLIPBOARD","hex":"1F4CB","short_name":"clipboard","sort_order":139,"sheet_x":21,"sheet_y":14},{"name":"SPIRAL NOTE PAD","hex":"1F5D2","short_name":"spiral_note_pad","sort_order":140,"sheet_x":25,"sheet_y":40},{"name":"FILE FOLDER","hex":"1F4C1","short_name":"file_folder","sort_order":141,"sheet_x":21,"sheet_y":4},{"name":"OPEN FILE FOLDER","hex":"1F4C2","short_name":"open_file_folder","sort_order":142,"sheet_x":21,"sheet_y":5},{"name":"CARD INDEX DIVIDERS","hex":"1F5C2","short_name":"card_index_dividers","sort_order":143,"sheet_x":25,"sheet_y":36},{"name":"ROLLED-UP NEWSPAPER","hex":"1F5DE","short_name":"rolled_up_newspaper","sort_order":144,"sheet_x":26,"sheet_y":3},{"name":"NEWSPAPER","hex":"1F4F0","short_name":"newspaper","sort_order":145,"sheet_x":22,"sheet_y":10},{"name":"NOTEBOOK","hex":"1F4D3","short_name":"notebook","sort_order":146,"sheet_x":21,"sheet_y":22},{"name":"CLOSED BOOK","hex":"1F4D5","short_name":"closed_book","sort_order":147,"sheet_x":21,"sheet_y":24},{"name":"GREEN BOOK","hex":"1F4D7","short_name":"green_book","sort_order":148,"sheet_x":21,"sheet_y":26},{"name":"BLUE BOOK","hex":"1F4D8","short_name":"blue_book","sort_order":149,"sheet_x":21,"sheet_y":27},{"name":"ORANGE BOOK","hex":"1F4D9","short_name":"orange_book","sort_order":150,"sheet_x":21,"sheet_y":28},{"name":"NOTEBOOK WITH DECORATIVE COVER","hex":"1F4D4","short_name":"notebook_with_decorative_cover","sort_order":151,"sheet_x":21,"sheet_y":23},{"name":"LEDGER","hex":"1F4D2","short_name":"ledger","sort_order":152,"sheet_x":21,"sheet_y":21},{"name":"BOOKS","hex":"1F4DA","short_name":"books","sort_order":153,"sheet_x":21,"sheet_y":29},{"name":"OPEN BOOK","hex":"1F4D6","short_name":"book","sort_order":154,"sheet_x":21,"sheet_y":25},{"name":"LINK SYMBOL","hex":"1F517","short_name":"link","sort_order":155,"sheet_x":23,"sheet_y":7},{"name":"PAPERCLIP","hex":"1F4CE","short_name":"paperclip","sort_order":156,"sheet_x":21,"sheet_y":17},{"name":"LINKED PAPERCLIPS","hex":"1F587","short_name":"linked_paperclips","sort_order":157,"sheet_x":25,"sheet_y":8},{"name":"BLACK SCISSORS","hex":"2702","short_name":"scissors","sort_order":158,"sheet_x":3,"sheet_y":5},{"name":"TRIANGULAR RULER","hex":"1F4D0","short_name":"triangular_ruler","sort_order":159,"sheet_x":21,"sheet_y":19},{"name":"STRAIGHT RULER","hex":"1F4CF","short_name":"straight_ruler","sort_order":160,"sheet_x":21,"sheet_y":18},{"name":"PUSHPIN","hex":"1F4CC","short_name":"pushpin","sort_order":161,"sheet_x":21,"sheet_y":15},{"name":"ROUND PUSHPIN","hex":"1F4CD","short_name":"round_pushpin","sort_order":162,"sheet_x":21,"sheet_y":16},{"name":"TRIANGULAR FLAG ON POST","hex":"1F6A9","short_name":"triangular_flag_on_post","sort_order":163,"sheet_x":30,"sheet_y":17},{"name":"WAVING WHITE FLAG","hex":"1F3F3","short_name":"waving_white_flag","sort_order":164,"sheet_x":11,"sheet_y":34},{"name":"WAVING BLACK FLAG","hex":"1F3F4","short_name":"waving_black_flag","sort_order":165,"sheet_x":11,"sheet_y":35},{"name":"CLOSED LOCK WITH KEY","hex":"1F510","short_name":"closed_lock_with_key","sort_order":166,"sheet_x":23,"sheet_y":0},{"name":"LOCK","hex":"1F512","short_name":"lock","sort_order":167,"sheet_x":23,"sheet_y":2},{"name":"OPEN LOCK","hex":"1F513","short_name":"unlock","sort_order":168,"sheet_x":23,"sheet_y":3},{"name":"LOCK WITH INK PEN","hex":"1F50F","short_name":"lock_with_ink_pen","sort_order":169,"sheet_x":22,"sheet_y":40},{"name":"LOWER LEFT BALLPOINT PEN","hex":"1F58A","short_name":"lower_left_ballpoint_pen","sort_order":170,"sheet_x":25,"sheet_y":9},{"name":"LOWER LEFT FOUNTAIN PEN","hex":"1F58B","short_name":"lower_left_fountain_pen","sort_order":171,"sheet_x":25,"sheet_y":10},{"name":"BLACK NIB","hex":"2712","short_name":"black_nib","sort_order":172,"sheet_x":3,"sheet_y":34},{"name":"MEMO","hex":"1F4DD","short_name":"memo","sort_order":173,"sheet_x":21,"sheet_y":32},{"name":"PENCIL","hex":"270F","short_name":"pencil2","sort_order":174,"sheet_x":3,"sheet_y":33},{"name":"LOWER LEFT CRAYON","hex":"1F58D","short_name":"lower_left_crayon","sort_order":175,"sheet_x":25,"sheet_y":12},{"name":"LOWER LEFT PAINTBRUSH","hex":"1F58C","short_name":"lower_left_paintbrush","sort_order":176,"sheet_x":25,"sheet_y":11},{"name":"LEFT-POINTING MAGNIFYING GLASS","hex":"1F50D","short_name":"mag","sort_order":177,"sheet_x":22,"sheet_y":38},{"name":"RIGHT-POINTING MAGNIFYING GLASS","hex":"1F50E","short_name":"mag_right","sort_order":178,"sheet_x":22,"sheet_y":39}],"short_name":"Objects","class":"cm-emoji-bulb","name":"Objects","order":6},{"emoji":[{"name":"HEAVY BLACK HEART","hex":"2764","short_name":"heart","sort_order":1,"sheet_x":4,"sheet_y":10},{"name":"YELLOW HEART","hex":"1F49B","short_name":"yellow_heart","sort_order":2,"sheet_x":20,"sheet_y":2},{"name":"GREEN HEART","hex":"1F49A","short_name":"green_heart","sort_order":3,"sheet_x":20,"sheet_y":1},{"name":"BLUE HEART","hex":"1F499","short_name":"blue_heart","sort_order":4,"sheet_x":20,"sheet_y":0},{"name":"PURPLE HEART","hex":"1F49C","short_name":"purple_heart","sort_order":5,"sheet_x":20,"sheet_y":3},{"name":"BROKEN HEART","hex":"1F494","short_name":"broken_heart","sort_order":6,"sheet_x":19,"sheet_y":36},{"name":"HEAVY HEART EXCLAMATION MARK ORNAMENT","hex":"2763","short_name":"heavy_heart_exclamation_mark_ornament","sort_order":7,"sheet_x":4,"sheet_y":9},{"name":"TWO HEARTS","hex":"1F495","short_name":"two_hearts","sort_order":8,"sheet_x":19,"sheet_y":37},{"name":"REVOLVING HEARTS","hex":"1F49E","short_name":"revolving_hearts","sort_order":9,"sheet_x":20,"sheet_y":5},{"name":"BEATING HEART","hex":"1F493","short_name":"heartbeat","sort_order":10,"sheet_x":19,"sheet_y":35},{"name":"GROWING HEART","hex":"1F497","short_name":"heartpulse","sort_order":11,"sheet_x":19,"sheet_y":39},{"name":"SPARKLING HEART","hex":"1F496","short_name":"sparkling_heart","sort_order":12,"sheet_x":19,"sheet_y":38},{"name":"HEART WITH ARROW","hex":"1F498","short_name":"cupid","sort_order":13,"sheet_x":19,"sheet_y":40},{"name":"HEART WITH RIBBON","hex":"1F49D","short_name":"gift_heart","sort_order":14,"sheet_x":20,"sheet_y":4},{"name":"HEART DECORATION","hex":"1F49F","short_name":"heart_decoration","sort_order":15,"sheet_x":20,"sheet_y":6},{"name":"PEACE SYMBOL","hex":"262E","short_name":"peace_symbol","sort_order":16,"sheet_x":1,"sheet_y":21},{"name":"LATIN CROSS","hex":"271D","short_name":"latin_cross","sort_order":17,"sheet_x":3,"sheet_y":37},{"name":"STAR AND CRESCENT","hex":"262A","short_name":"star_and_crescent","sort_order":18,"sheet_x":1,"sheet_y":20},{"name":"OM SYMBOL","hex":"1F549","short_name":"om_symbol","sort_order":19,"sheet_x":24,"sheet_y":5},{"name":"WHEEL OF DHARMA","hex":"2638","short_name":"wheel_of_dharma","sort_order":20,"sheet_x":1,"sheet_y":23},{"name":"STAR OF DAVID","hex":"2721","short_name":"star_of_david","sort_order":21,"sheet_x":3,"sheet_y":38},{"name":"SIX POINTED STAR WITH MIDDLE DOT","hex":"1F52F","short_name":"six_pointed_star","sort_order":22,"sheet_x":23,"sheet_y":31},{"name":"MENORAH WITH NINE BRANCHES","hex":"1F54E","short_name":"menorah_with_nine_branches","sort_order":23,"sheet_x":24,"sheet_y":10},{"name":"YIN YANG","hex":"262F","short_name":"yin_yang","sort_order":24,"sheet_x":1,"sheet_y":22},{"name":"ORTHODOX CROSS","hex":"2626","short_name":"orthodox_cross","sort_order":25,"sheet_x":1,"sheet_y":19},{"name":"PLACE OF WORSHIP","hex":"1F6D0","short_name":"place_of_worship","sort_order":26,"sheet_x":31,"sheet_y":30},{"name":"OPHIUCHUS","hex":"26CE","short_name":"ophiuchus","sort_order":27,"sheet_x":2,"sheet_y":23},{"name":"ARIES","hex":"2648","short_name":"aries","sort_order":28,"sheet_x":1,"sheet_y":26},{"name":"TAURUS","hex":"2649","short_name":"taurus","sort_order":29,"sheet_x":1,"sheet_y":27},{"name":"GEMINI","hex":"264A","short_name":"gemini","sort_order":30,"sheet_x":1,"sheet_y":28},{"name":"CANCER","hex":"264B","short_name":"cancer","sort_order":31,"sheet_x":1,"sheet_y":29},{"name":"LEO","hex":"264C","short_name":"leo","sort_order":32,"sheet_x":1,"sheet_y":30},{"name":"VIRGO","hex":"264D","short_name":"virgo","sort_order":33,"sheet_x":1,"sheet_y":31},{"name":"LIBRA","hex":"264E","short_name":"libra","sort_order":34,"sheet_x":1,"sheet_y":32},{"name":"SCORPIUS","hex":"264F","short_name":"scorpius","sort_order":35,"sheet_x":1,"sheet_y":33},{"name":"SAGITTARIUS","hex":"2650","short_name":"sagittarius","sort_order":36,"sheet_x":1,"sheet_y":34},{"name":"CAPRICORN","hex":"2651","short_name":"capricorn","sort_order":37,"sheet_x":1,"sheet_y":35},{"name":"AQUARIUS","hex":"2652","short_name":"aquarius","sort_order":38,"sheet_x":1,"sheet_y":36},{"name":"PISCES","hex":"2653","short_name":"pisces","sort_order":39,"sheet_x":1,"sheet_y":37},{"name":"SQUARED ID","hex":"1F194","short_name":"id","sort_order":40,"sheet_x":4,"sheet_y":40},{"name":"ATOM SYMBOL","hex":"269B","short_name":"atom_symbol","sort_order":41,"sheet_x":2,"sheet_y":10},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-7A7A","hex":"1F233","short_name":"u7a7a","sort_order":42,"sheet_x":5,"sheet_y":11},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-5272","hex":"1F239","short_name":"u5272","sort_order":43,"sheet_x":5,"sheet_y":17},{"name":"RADIOACTIVE SIGN","hex":"2622","short_name":"radioactive_sign","sort_order":44,"sheet_x":1,"sheet_y":17},{"name":"BIOHAZARD SIGN","hex":"2623","short_name":"biohazard_sign","sort_order":45,"sheet_x":1,"sheet_y":18},{"name":"MOBILE PHONE OFF","hex":"1F4F4","short_name":"mobile_phone_off","sort_order":46,"sheet_x":22,"sheet_y":14},{"name":"VIBRATION MODE","hex":"1F4F3","short_name":"vibration_mode","sort_order":47,"sheet_x":22,"sheet_y":13},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-6709","hex":"1F236","short_name":"u6709","sort_order":48,"sheet_x":5,"sheet_y":14},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-7121","hex":"1F21A","short_name":"u7121","sort_order":49,"sheet_x":5,"sheet_y":8},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-7533","hex":"1F238","short_name":"u7533","sort_order":50,"sheet_x":5,"sheet_y":16},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-55B6","hex":"1F23A","short_name":"u55b6","sort_order":51,"sheet_x":5,"sheet_y":18},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-6708","hex":"1F237","short_name":"u6708","sort_order":52,"sheet_x":5,"sheet_y":15},{"name":"EIGHT POINTED BLACK STAR","hex":"2734","short_name":"eight_pointed_black_star","sort_order":53,"sheet_x":4,"sheet_y":0},{"name":"SQUARED VS","hex":"1F19A","short_name":"vs","sort_order":54,"sheet_x":5,"sheet_y":5},{"name":"CIRCLED IDEOGRAPH ACCEPT","hex":"1F251","short_name":"accept","sort_order":55,"sheet_x":5,"sheet_y":20},{"name":"WHITE FLOWER","hex":"1F4AE","short_name":"white_flower","sort_order":56,"sheet_x":20,"sheet_y":26},{"name":"CIRCLED IDEOGRAPH ADVANTAGE","hex":"1F250","short_name":"ideograph_advantage","sort_order":57,"sheet_x":5,"sheet_y":19},{"name":"CIRCLED IDEOGRAPH SECRET","hex":"3299","short_name":"secret","sort_order":58,"sheet_x":4,"sheet_y":29},{"name":"CIRCLED IDEOGRAPH CONGRATULATION","hex":"3297","short_name":"congratulations","sort_order":59,"sheet_x":4,"sheet_y":28},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-5408","hex":"1F234","short_name":"u5408","sort_order":60,"sheet_x":5,"sheet_y":12},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-6E80","hex":"1F235","short_name":"u6e80","sort_order":61,"sheet_x":5,"sheet_y":13},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-7981","hex":"1F232","short_name":"u7981","sort_order":62,"sheet_x":5,"sheet_y":10},{"name":"NEGATIVE SQUARED LATIN CAPITAL LETTER A","hex":"1F170","short_name":"a","sort_order":63,"sheet_x":4,"sheet_y":32},{"name":"NEGATIVE SQUARED LATIN CAPITAL LETTER B","hex":"1F171","short_name":"b","sort_order":64,"sheet_x":4,"sheet_y":33},{"name":"NEGATIVE SQUARED AB","hex":"1F18E","short_name":"ab","sort_order":65,"sheet_x":4,"sheet_y":36},{"name":"SQUARED CL","hex":"1F191","short_name":"cl","sort_order":66,"sheet_x":4,"sheet_y":37},{"name":"NEGATIVE SQUARED LATIN CAPITAL LETTER O","hex":"1F17E","short_name":"o2","sort_order":67,"sheet_x":4,"sheet_y":34},{"name":"SQUARED SOS","hex":"1F198","short_name":"sos","sort_order":68,"sheet_x":5,"sheet_y":3},{"name":"NO ENTRY","hex":"26D4","short_name":"no_entry","sort_order":69,"sheet_x":2,"sheet_y":27},{"name":"NAME BADGE","hex":"1F4DB","short_name":"name_badge","sort_order":70,"sheet_x":21,"sheet_y":30},{"name":"NO ENTRY SIGN","hex":"1F6AB","short_name":"no_entry_sign","sort_order":71,"sheet_x":30,"sheet_y":19},{"name":"CROSS MARK","hex":"274C","short_name":"x","sort_order":72,"sheet_x":4,"sheet_y":3},{"name":"HEAVY LARGE CIRCLE","hex":"2B55","short_name":"o","sort_order":73,"sheet_x":4,"sheet_y":25},{"name":"ANGER SYMBOL","hex":"1F4A2","short_name":"anger","sort_order":74,"sheet_x":20,"sheet_y":9},{"name":"HOT SPRINGS","hex":"2668","short_name":"hotsprings","sort_order":75,"sheet_x":2,"sheet_y":1},{"name":"NO PEDESTRIANS","hex":"1F6B7","short_name":"no_pedestrians","sort_order":76,"sheet_x":31,"sheet_y":5},{"name":"DO NOT LITTER SYMBOL","hex":"1F6AF","short_name":"do_not_litter","sort_order":77,"sheet_x":30,"sheet_y":23},{"name":"NO BICYCLES","hex":"1F6B3","short_name":"no_bicycles","sort_order":78,"sheet_x":30,"sheet_y":27},{"name":"NON-POTABLE WATER SYMBOL","hex":"1F6B1","short_name":"non-potable_water","sort_order":79,"sheet_x":30,"sheet_y":25},{"name":"NO ONE UNDER EIGHTEEN SYMBOL","hex":"1F51E","short_name":"underage","sort_order":80,"sheet_x":23,"sheet_y":14},{"name":"NO MOBILE PHONES","hex":"1F4F5","short_name":"no_mobile_phones","sort_order":81,"sheet_x":22,"sheet_y":15},{"name":"HEAVY EXCLAMATION MARK SYMBOL","hex":"2757","short_name":"exclamation","sort_order":82,"sheet_x":4,"sheet_y":8},{"name":"WHITE EXCLAMATION MARK ORNAMENT","hex":"2755","short_name":"grey_exclamation","sort_order":83,"sheet_x":4,"sheet_y":7},{"name":"BLACK QUESTION MARK ORNAMENT","hex":"2753","short_name":"question","sort_order":84,"sheet_x":4,"sheet_y":5},{"name":"WHITE QUESTION MARK ORNAMENT","hex":"2754","short_name":"grey_question","sort_order":85,"sheet_x":4,"sheet_y":6},{"name":"DOUBLE EXCLAMATION MARK","hex":"203C","short_name":"bangbang","sort_order":86,"sheet_x":0,"sheet_y":2},{"name":"EXCLAMATION QUESTION MARK","hex":"2049","short_name":"interrobang","sort_order":87,"sheet_x":0,"sheet_y":3},{"name":"HUNDRED POINTS SYMBOL","hex":"1F4AF","short_name":"100","sort_order":88,"sheet_x":20,"sheet_y":27},{"name":"LOW BRIGHTNESS SYMBOL","hex":"1F505","short_name":"low_brightness","sort_order":89,"sheet_x":22,"sheet_y":30},{"name":"HIGH BRIGHTNESS SYMBOL","hex":"1F506","short_name":"high_brightness","sort_order":90,"sheet_x":22,"sheet_y":31},{"name":"TRIDENT EMBLEM","hex":"1F531","short_name":"trident","sort_order":91,"sheet_x":23,"sheet_y":33},{"name":"FLEUR-DE-LIS","hex":"269C","short_name":"fleur_de_lis","sort_order":92,"sheet_x":2,"sheet_y":11},{"name":"PART ALTERNATION MARK","hex":"303D","short_name":"part_alternation_mark","sort_order":93,"sheet_x":4,"sheet_y":27},{"name":"WARNING SIGN","hex":"26A0","short_name":"warning","sort_order":94,"sheet_x":2,"sheet_y":12},{"name":"CHILDREN CROSSING","hex":"1F6B8","short_name":"children_crossing","sort_order":95,"sheet_x":31,"sheet_y":6},{"name":"JAPANESE SYMBOL FOR BEGINNER","hex":"1F530","short_name":"beginner","sort_order":96,"sheet_x":23,"sheet_y":32},{"name":"BLACK UNIVERSAL RECYCLING SYMBOL","hex":"267B","short_name":"recycle","sort_order":97,"sheet_x":2,"sheet_y":2},{"name":"SQUARED CJK UNIFIED IDEOGRAPH-6307","hex":"1F22F","short_name":"u6307","sort_order":98,"sheet_x":5,"sheet_y":9},{"name":"CHART WITH UPWARDS TREND AND YEN SIGN","hex":"1F4B9","short_name":"chart","sort_order":99,"sheet_x":20,"sheet_y":37},{"name":"SPARKLE","hex":"2747","short_name":"sparkle","sort_order":100,"sheet_x":4,"sheet_y":2},{"name":"EIGHT SPOKED ASTERISK","hex":"2733","short_name":"eight_spoked_asterisk","sort_order":101,"sheet_x":3,"sheet_y":40},{"name":"NEGATIVE SQUARED CROSS MARK","hex":"274E","short_name":"negative_squared_cross_mark","sort_order":102,"sheet_x":4,"sheet_y":4},{"name":"WHITE HEAVY CHECK MARK","hex":"2705","short_name":"white_check_mark","sort_order":103,"sheet_x":3,"sheet_y":6},{"name":"DIAMOND SHAPE WITH A DOT INSIDE","hex":"1F4A0","short_name":"diamond_shape_with_a_dot_inside","sort_order":104,"sheet_x":20,"sheet_y":7},{"name":"CYCLONE","hex":"1F300","short_name":"cyclone","sort_order":105,"sheet_x":5,"sheet_y":21},{"name":"DOUBLE CURLY LOOP","hex":"27BF","short_name":"loop","sort_order":106,"sheet_x":4,"sheet_y":16},{"name":"GLOBE WITH MERIDIANS","hex":"1F310","short_name":"globe_with_meridians","sort_order":107,"sheet_x":5,"sheet_y":37},{"name":"CIRCLED LATIN CAPITAL LETTER M","hex":"24C2","short_name":"m","sort_order":108,"sheet_x":0,"sheet_y":32},{"name":"AUTOMATED TELLER MACHINE","hex":"1F3E7","short_name":"atm","sort_order":109,"sheet_x":11,"sheet_y":24},{"name":"SQUARED KATAKANA SA","hex":"1F202","short_name":"sa","sort_order":110,"sheet_x":5,"sheet_y":7},{"name":"PASSPORT CONTROL","hex":"1F6C2","short_name":"passport_control","sort_order":111,"sheet_x":31,"sheet_y":21},{"name":"CUSTOMS","hex":"1F6C3","short_name":"customs","sort_order":112,"sheet_x":31,"sheet_y":22},{"name":"BAGGAGE CLAIM","hex":"1F6C4","short_name":"baggage_claim","sort_order":113,"sheet_x":31,"sheet_y":23},{"name":"LEFT LUGGAGE","hex":"1F6C5","short_name":"left_luggage","sort_order":114,"sheet_x":31,"sheet_y":24},{"name":"WHEELCHAIR SYMBOL","hex":"267F","short_name":"wheelchair","sort_order":115,"sheet_x":2,"sheet_y":3},{"name":"NO SMOKING SYMBOL","hex":"1F6AD","short_name":"no_smoking","sort_order":116,"sheet_x":30,"sheet_y":21},{"name":"WATER CLOSET","hex":"1F6BE","short_name":"wc","sort_order":117,"sheet_x":31,"sheet_y":12},{"name":"NEGATIVE SQUARED LATIN CAPITAL LETTER P","hex":"1F17F","short_name":"parking","sort_order":118,"sheet_x":4,"sheet_y":35},{"name":"POTABLE WATER SYMBOL","hex":"1F6B0","short_name":"potable_water","sort_order":119,"sheet_x":30,"sheet_y":24},{"name":"MENS SYMBOL","hex":"1F6B9","short_name":"mens","sort_order":120,"sheet_x":31,"sheet_y":7},{"name":"WOMENS SYMBOL","hex":"1F6BA","short_name":"womens","sort_order":121,"sheet_x":31,"sheet_y":8},{"name":"BABY SYMBOL","hex":"1F6BC","short_name":"baby_symbol","sort_order":122,"sheet_x":31,"sheet_y":10},{"name":"RESTROOM","hex":"1F6BB","short_name":"restroom","sort_order":123,"sheet_x":31,"sheet_y":9},{"name":"PUT LITTER IN ITS PLACE SYMBOL","hex":"1F6AE","short_name":"put_litter_in_its_place","sort_order":124,"sheet_x":30,"sheet_y":22},{"name":"CINEMA","hex":"1F3A6","short_name":"cinema","sort_order":125,"sheet_x":9,"sheet_y":21},{"name":"ANTENNA WITH BARS","hex":"1F4F6","short_name":"signal_strength","sort_order":126,"sheet_x":22,"sheet_y":16},{"name":"SQUARED KATAKANA KOKO","hex":"1F201","short_name":"koko","sort_order":127,"sheet_x":5,"sheet_y":6},{"name":"SQUARED NG","hex":"1F196","short_name":"ng","sort_order":128,"sheet_x":5,"sheet_y":1},{"name":"SQUARED OK","hex":"1F197","short_name":"ok","sort_order":129,"sheet_x":5,"sheet_y":2},{"name":"SQUARED UP WITH EXCLAMATION MARK","hex":"1F199","short_name":"up","sort_order":130,"sheet_x":5,"sheet_y":4},{"name":"SQUARED COOL","hex":"1F192","short_name":"cool","sort_order":131,"sheet_x":4,"sheet_y":38},{"name":"SQUARED NEW","hex":"1F195","short_name":"new","sort_order":132,"sheet_x":5,"sheet_y":0},{"name":"SQUARED FREE","hex":"1F193","short_name":"free","sort_order":133,"sheet_x":4,"sheet_y":39},{"name":"KEYCAP 0","hex":"0030-20E3","short_name":"zero","sort_order":134,"sheet_x":32,"sheet_y":23},{"name":"KEYCAP 1","hex":"0031-20E3","short_name":"one","sort_order":135,"sheet_x":32,"sheet_y":24},{"name":"KEYCAP 2","hex":"0032-20E3","short_name":"two","sort_order":136,"sheet_x":32,"sheet_y":25},{"name":"KEYCAP 3","hex":"0033-20E3","short_name":"three","sort_order":137,"sheet_x":32,"sheet_y":26},{"name":"KEYCAP 4","hex":"0034-20E3","short_name":"four","sort_order":138,"sheet_x":32,"sheet_y":27},{"name":"KEYCAP 5","hex":"0035-20E3","short_name":"five","sort_order":139,"sheet_x":32,"sheet_y":28},{"name":"KEYCAP 6","hex":"0036-20E3","short_name":"six","sort_order":140,"sheet_x":32,"sheet_y":29},{"name":"KEYCAP 7","hex":"0037-20E3","short_name":"seven","sort_order":141,"sheet_x":32,"sheet_y":30},{"name":"KEYCAP 8","hex":"0038-20E3","short_name":"eight","sort_order":142,"sheet_x":32,"sheet_y":31},{"name":"KEYCAP 9","hex":"0039-20E3","short_name":"nine","sort_order":143,"sheet_x":32,"sheet_y":32},{"name":"KEYCAP TEN","hex":"1F51F","short_name":"keycap_ten","sort_order":144,"sheet_x":23,"sheet_y":15},{"name":null,"hex":"002A-20E3","short_name":"keycap_star","sort_order":145,"sheet_x":32,"sheet_y":22},{"name":"INPUT SYMBOL FOR NUMBERS","hex":"1F522","short_name":"1234","sort_order":146,"sheet_x":23,"sheet_y":18},{"name":"BLACK RIGHT-POINTING TRIANGLE","hex":"25B6","short_name":"arrow_forward","sort_order":147,"sheet_x":0,"sheet_y":35},{"name":"DOUBLE VERTICAL BAR","hex":"23F8","short_name":"double_vertical_bar","sort_order":148,"sheet_x":0,"sheet_y":29},{"name":"BLACK RIGHT-POINTING TRIANGLE WITH DOUBLE VERTICAL BAR","hex":"23EF","short_name":"black_right_pointing_triangle_with_double_vertical_bar","sort_order":149,"sheet_x":0,"sheet_y":24},{"name":"BLACK SQUARE FOR STOP","hex":"23F9","short_name":"black_square_for_stop","sort_order":150,"sheet_x":0,"sheet_y":30},{"name":"EJECT SYMBOL","hex":"23CF","short_name":"eject","sort_order":151,"sheet_x":0,"sheet_y":17},{"name":"BLACK CIRCLE FOR RECORD","hex":"23FA","short_name":"black_circle_for_record","sort_order":152,"sheet_x":0,"sheet_y":31},{"name":"BLACK RIGHT-POINTING DOUBLE TRIANGLE WITH VERTICAL BAR","hex":"23ED","short_name":"black_right_pointing_double_triangle_with_vertical_bar","sort_order":153,"sheet_x":0,"sheet_y":22},{"name":"BLACK LEFT-POINTING DOUBLE TRIANGLE WITH VERTICAL BAR","hex":"23EE","short_name":"black_left_pointing_double_triangle_with_vertical_bar","sort_order":154,"sheet_x":0,"sheet_y":23},{"name":"BLACK RIGHT-POINTING DOUBLE TRIANGLE","hex":"23E9","short_name":"fast_forward","sort_order":155,"sheet_x":0,"sheet_y":18},{"name":"BLACK LEFT-POINTING DOUBLE TRIANGLE","hex":"23EA","short_name":"rewind","sort_order":156,"sheet_x":0,"sheet_y":19},{"name":"TWISTED RIGHTWARDS ARROWS","hex":"1F500","short_name":"twisted_rightwards_arrows","sort_order":157,"sheet_x":22,"sheet_y":25},{"name":"CLOCKWISE RIGHTWARDS AND LEFTWARDS OPEN CIRCLE ARROWS","hex":"1F501","short_name":"repeat","sort_order":158,"sheet_x":22,"sheet_y":26},{"name":"CLOCKWISE RIGHTWARDS AND LEFTWARDS OPEN CIRCLE ARROWS WITH CIRCLED ONE OVERLAY","hex":"1F502","short_name":"repeat_one","sort_order":159,"sheet_x":22,"sheet_y":27},{"name":"BLACK LEFT-POINTING TRIANGLE","hex":"25C0","short_name":"arrow_backward","sort_order":160,"sheet_x":0,"sheet_y":36},{"name":"UP-POINTING SMALL RED TRIANGLE","hex":"1F53C","short_name":"arrow_up_small","sort_order":161,"sheet_x":24,"sheet_y":3},{"name":"DOWN-POINTING SMALL RED TRIANGLE","hex":"1F53D","short_name":"arrow_down_small","sort_order":162,"sheet_x":24,"sheet_y":4},{"name":"BLACK UP-POINTING DOUBLE TRIANGLE","hex":"23EB","short_name":"arrow_double_up","sort_order":163,"sheet_x":0,"sheet_y":20},{"name":"BLACK DOWN-POINTING DOUBLE TRIANGLE","hex":"23EC","short_name":"arrow_double_down","sort_order":164,"sheet_x":0,"sheet_y":21},{"name":"BLACK RIGHTWARDS ARROW","hex":"27A1","short_name":"arrow_right","sort_order":165,"sheet_x":4,"sheet_y":14},{"name":"LEFTWARDS BLACK ARROW","hex":"2B05","short_name":"arrow_left","sort_order":166,"sheet_x":4,"sheet_y":19},{"name":"UPWARDS BLACK ARROW","hex":"2B06","short_name":"arrow_up","sort_order":167,"sheet_x":4,"sheet_y":20},{"name":"DOWNWARDS BLACK ARROW","hex":"2B07","short_name":"arrow_down","sort_order":168,"sheet_x":4,"sheet_y":21},{"name":"NORTH EAST ARROW","hex":"2197","short_name":"arrow_upper_right","sort_order":169,"sheet_x":0,"sheet_y":9},{"name":"SOUTH EAST ARROW","hex":"2198","short_name":"arrow_lower_right","sort_order":170,"sheet_x":0,"sheet_y":10},{"name":"SOUTH WEST ARROW","hex":"2199","short_name":"arrow_lower_left","sort_order":171,"sheet_x":0,"sheet_y":11},{"name":"NORTH WEST ARROW","hex":"2196","short_name":"arrow_upper_left","sort_order":172,"sheet_x":0,"sheet_y":8},{"name":"UP DOWN ARROW","hex":"2195","short_name":"arrow_up_down","sort_order":173,"sheet_x":0,"sheet_y":7},{"name":"LEFT RIGHT ARROW","hex":"2194","short_name":"left_right_arrow","sort_order":174,"sheet_x":0,"sheet_y":6},{"name":"ANTICLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS","hex":"1F504","short_name":"arrows_counterclockwise","sort_order":175,"sheet_x":22,"sheet_y":29},{"name":"RIGHTWARDS ARROW WITH HOOK","hex":"21AA","short_name":"arrow_right_hook","sort_order":176,"sheet_x":0,"sheet_y":13},{"name":"LEFTWARDS ARROW WITH HOOK","hex":"21A9","short_name":"leftwards_arrow_with_hook","sort_order":177,"sheet_x":0,"sheet_y":12},{"name":"ARROW POINTING RIGHTWARDS THEN CURVING UPWARDS","hex":"2934","short_name":"arrow_heading_up","sort_order":178,"sheet_x":4,"sheet_y":17},{"name":"ARROW POINTING RIGHTWARDS THEN CURVING DOWNWARDS","hex":"2935","short_name":"arrow_heading_down","sort_order":179,"sheet_x":4,"sheet_y":18},{"name":"HASH KEY","hex":"0023-20E3","short_name":"hash","sort_order":180,"sheet_x":32,"sheet_y":21},{"name":"INFORMATION SOURCE","hex":"2139","short_name":"information_source","sort_order":181,"sheet_x":0,"sheet_y":5},{"name":"INPUT SYMBOL FOR LATIN LETTERS","hex":"1F524","short_name":"abc","sort_order":182,"sheet_x":23,"sheet_y":20},{"name":"INPUT SYMBOL FOR LATIN SMALL LETTERS","hex":"1F521","short_name":"abcd","sort_order":183,"sheet_x":23,"sheet_y":17},{"name":"INPUT SYMBOL FOR LATIN CAPITAL LETTERS","hex":"1F520","short_name":"capital_abcd","sort_order":184,"sheet_x":23,"sheet_y":16},{"name":"INPUT SYMBOL FOR SYMBOLS","hex":"1F523","short_name":"symbols","sort_order":185,"sheet_x":23,"sheet_y":19},{"name":"MUSICAL NOTE","hex":"1F3B5","short_name":"musical_note","sort_order":186,"sheet_x":9,"sheet_y":36},{"name":"MULTIPLE MUSICAL NOTES","hex":"1F3B6","short_name":"notes","sort_order":187,"sheet_x":9,"sheet_y":37},{"name":"WAVY DASH","hex":"3030","short_name":"wavy_dash","sort_order":188,"sheet_x":4,"sheet_y":26},{"name":"CURLY LOOP","hex":"27B0","short_name":"curly_loop","sort_order":189,"sheet_x":4,"sheet_y":15},{"name":"HEAVY CHECK MARK","hex":"2714","short_name":"heavy_check_mark","sort_order":190,"sheet_x":3,"sheet_y":35},{"name":"CLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS","hex":"1F503","short_name":"arrows_clockwise","sort_order":191,"sheet_x":22,"sheet_y":28},{"name":"HEAVY PLUS SIGN","hex":"2795","short_name":"heavy_plus_sign","sort_order":192,"sheet_x":4,"sheet_y":11},{"name":"HEAVY MINUS SIGN","hex":"2796","short_name":"heavy_minus_sign","sort_order":193,"sheet_x":4,"sheet_y":12},{"name":"HEAVY DIVISION SIGN","hex":"2797","short_name":"heavy_division_sign","sort_order":194,"sheet_x":4,"sheet_y":13},{"name":"HEAVY MULTIPLICATION X","hex":"2716","short_name":"heavy_multiplication_x","sort_order":195,"sheet_x":3,"sheet_y":36},{"name":"HEAVY DOLLAR SIGN","hex":"1F4B2","short_name":"heavy_dollar_sign","sort_order":196,"sheet_x":20,"sheet_y":30},{"name":"CURRENCY EXCHANGE","hex":"1F4B1","short_name":"currency_exchange","sort_order":197,"sheet_x":20,"sheet_y":29},{"name":"COPYRIGHT SIGN","hex":"00A9","short_name":"copyright","sort_order":198,"sheet_x":0,"sheet_y":0},{"name":"REGISTERED SIGN","hex":"00AE","short_name":"registered","sort_order":199,"sheet_x":0,"sheet_y":1},{"name":"TRADE MARK SIGN","hex":"2122","short_name":"tm","sort_order":200,"sheet_x":0,"sheet_y":4},{"name":"END WITH LEFTWARDS ARROW ABOVE","hex":"1F51A","short_name":"end","sort_order":201,"sheet_x":23,"sheet_y":10},{"name":"BACK WITH LEFTWARDS ARROW ABOVE","hex":"1F519","short_name":"back","sort_order":202,"sheet_x":23,"sheet_y":9},{"name":"ON WITH EXCLAMATION MARK WITH LEFT RIGHT ARROW ABOVE","hex":"1F51B","short_name":"on","sort_order":203,"sheet_x":23,"sheet_y":11},{"name":"TOP WITH UPWARDS ARROW ABOVE","hex":"1F51D","short_name":"top","sort_order":204,"sheet_x":23,"sheet_y":13},{"name":"SOON WITH RIGHTWARDS ARROW ABOVE","hex":"1F51C","short_name":"soon","sort_order":205,"sheet_x":23,"sheet_y":12},{"name":"BALLOT BOX WITH CHECK","hex":"2611","short_name":"ballot_box_with_check","sort_order":206,"sheet_x":1,"sheet_y":6},{"name":"RADIO BUTTON","hex":"1F518","short_name":"radio_button","sort_order":207,"sheet_x":23,"sheet_y":8},{"name":"MEDIUM WHITE CIRCLE","hex":"26AA","short_name":"white_circle","sort_order":208,"sheet_x":2,"sheet_y":14},{"name":"MEDIUM BLACK CIRCLE","hex":"26AB","short_name":"black_circle","sort_order":209,"sheet_x":2,"sheet_y":15},{"name":"LARGE RED CIRCLE","hex":"1F534","short_name":"red_circle","sort_order":210,"sheet_x":23,"sheet_y":36},{"name":"LARGE BLUE CIRCLE","hex":"1F535","short_name":"large_blue_circle","sort_order":211,"sheet_x":23,"sheet_y":37},{"name":"SMALL ORANGE DIAMOND","hex":"1F538","short_name":"small_orange_diamond","sort_order":212,"sheet_x":23,"sheet_y":40},{"name":"SMALL BLUE DIAMOND","hex":"1F539","short_name":"small_blue_diamond","sort_order":213,"sheet_x":24,"sheet_y":0},{"name":"LARGE ORANGE DIAMOND","hex":"1F536","short_name":"large_orange_diamond","sort_order":214,"sheet_x":23,"sheet_y":38},{"name":"LARGE BLUE DIAMOND","hex":"1F537","short_name":"large_blue_diamond","sort_order":215,"sheet_x":23,"sheet_y":39},{"name":"UP-POINTING RED TRIANGLE","hex":"1F53A","short_name":"small_red_triangle","sort_order":216,"sheet_x":24,"sheet_y":1},{"name":"BLACK SMALL SQUARE","hex":"25AA","short_name":"black_small_square","sort_order":217,"sheet_x":0,"sheet_y":33},{"name":"WHITE SMALL SQUARE","hex":"25AB","short_name":"white_small_square","sort_order":218,"sheet_x":0,"sheet_y":34},{"name":"BLACK LARGE SQUARE","hex":"2B1B","short_name":"black_large_square","sort_order":219,"sheet_x":4,"sheet_y":22},{"name":"WHITE LARGE SQUARE","hex":"2B1C","short_name":"white_large_square","sort_order":220,"sheet_x":4,"sheet_y":23},{"name":"DOWN-POINTING RED TRIANGLE","hex":"1F53B","short_name":"small_red_triangle_down","sort_order":221,"sheet_x":24,"sheet_y":2},{"name":"BLACK MEDIUM SQUARE","hex":"25FC","short_name":"black_medium_square","sort_order":222,"sheet_x":0,"sheet_y":38},{"name":"WHITE MEDIUM SQUARE","hex":"25FB","short_name":"white_medium_square","sort_order":223,"sheet_x":0,"sheet_y":37},{"name":"BLACK MEDIUM SMALL SQUARE","hex":"25FE","short_name":"black_medium_small_square","sort_order":224,"sheet_x":0,"sheet_y":40},{"name":"WHITE MEDIUM SMALL SQUARE","hex":"25FD","short_name":"white_medium_small_square","sort_order":225,"sheet_x":0,"sheet_y":39},{"name":"BLACK SQUARE BUTTON","hex":"1F532","short_name":"black_square_button","sort_order":226,"sheet_x":23,"sheet_y":34},{"name":"WHITE SQUARE BUTTON","hex":"1F533","short_name":"white_square_button","sort_order":227,"sheet_x":23,"sheet_y":35},{"name":"SPEAKER","hex":"1F508","short_name":"speaker","sort_order":228,"sheet_x":22,"sheet_y":33},{"name":"SPEAKER WITH ONE SOUND WAVE","hex":"1F509","short_name":"sound","sort_order":229,"sheet_x":22,"sheet_y":34},{"name":"SPEAKER WITH THREE SOUND WAVES","hex":"1F50A","short_name":"loud_sound","sort_order":230,"sheet_x":22,"sheet_y":35},{"name":"SPEAKER WITH CANCELLATION STROKE","hex":"1F507","short_name":"mute","sort_order":231,"sheet_x":22,"sheet_y":32},{"name":"CHEERING MEGAPHONE","hex":"1F4E3","short_name":"mega","sort_order":232,"sheet_x":21,"sheet_y":38},{"name":"PUBLIC ADDRESS LOUDSPEAKER","hex":"1F4E2","short_name":"loudspeaker","sort_order":233,"sheet_x":21,"sheet_y":37},{"name":"BELL","hex":"1F514","short_name":"bell","sort_order":234,"sheet_x":23,"sheet_y":4},{"name":"BELL WITH CANCELLATION STROKE","hex":"1F515","short_name":"no_bell","sort_order":235,"sheet_x":23,"sheet_y":5},{"name":"PLAYING CARD BLACK JOKER","hex":"1F0CF","short_name":"black_joker","sort_order":236,"sheet_x":4,"sheet_y":31},{"name":"MAHJONG TILE RED DRAGON","hex":"1F004","short_name":"mahjong","sort_order":237,"sheet_x":4,"sheet_y":30},{"name":"BLACK SPADE SUIT","hex":"2660","short_name":"spades","sort_order":238,"sheet_x":1,"sheet_y":38},{"name":"BLACK CLUB SUIT","hex":"2663","short_name":"clubs","sort_order":239,"sheet_x":1,"sheet_y":39},{"name":"BLACK HEART SUIT","hex":"2665","short_name":"hearts","sort_order":240,"sheet_x":1,"sheet_y":40},{"name":"BLACK DIAMOND SUIT","hex":"2666","short_name":"diamonds","sort_order":241,"sheet_x":2,"sheet_y":0},{"name":"FLOWER PLAYING CARDS","hex":"1F3B4","short_name":"flower_playing_cards","sort_order":242,"sheet_x":9,"sheet_y":35},{"name":"THOUGHT BALLOON","hex":"1F4AD","short_name":"thought_balloon","sort_order":243,"sheet_x":20,"sheet_y":25},{"name":"RIGHT ANGER BUBBLE","hex":"1F5EF","short_name":"right_anger_bubble","sort_order":244,"sheet_x":26,"sheet_y":7},{"name":"SPEECH BALLOON","hex":"1F4AC","short_name":"speech_balloon","sort_order":245,"sheet_x":20,"sheet_y":24},{"name":"LEFT SPEECH BUBBLE","hex":"1F5E8","short_name":"left_speech_bubble","sort_order":246,"sheet_x":26,"sheet_y":6},{"name":"CLOCK FACE ONE OCLOCK","hex":"1F550","short_name":"clock1","sort_order":247,"sheet_x":24,"sheet_y":11},{"name":"CLOCK FACE TWO OCLOCK","hex":"1F551","short_name":"clock2","sort_order":248,"sheet_x":24,"sheet_y":12},{"name":"CLOCK FACE THREE OCLOCK","hex":"1F552","short_name":"clock3","sort_order":249,"sheet_x":24,"sheet_y":13},{"name":"CLOCK FACE FOUR OCLOCK","hex":"1F553","short_name":"clock4","sort_order":250,"sheet_x":24,"sheet_y":14},{"name":"CLOCK FACE FIVE OCLOCK","hex":"1F554","short_name":"clock5","sort_order":251,"sheet_x":24,"sheet_y":15},{"name":"CLOCK FACE SIX OCLOCK","hex":"1F555","short_name":"clock6","sort_order":252,"sheet_x":24,"sheet_y":16},{"name":"CLOCK FACE SEVEN OCLOCK","hex":"1F556","short_name":"clock7","sort_order":253,"sheet_x":24,"sheet_y":17},{"name":"CLOCK FACE EIGHT OCLOCK","hex":"1F557","short_name":"clock8","sort_order":254,"sheet_x":24,"sheet_y":18},{"name":"CLOCK FACE NINE OCLOCK","hex":"1F558","short_name":"clock9","sort_order":255,"sheet_x":24,"sheet_y":19},{"name":"CLOCK FACE TEN OCLOCK","hex":"1F559","short_name":"clock10","sort_order":256,"sheet_x":24,"sheet_y":20},{"name":"CLOCK FACE ELEVEN OCLOCK","hex":"1F55A","short_name":"clock11","sort_order":257,"sheet_x":24,"sheet_y":21},{"name":"CLOCK FACE TWELVE OCLOCK","hex":"1F55B","short_name":"clock12","sort_order":258,"sheet_x":24,"sheet_y":22},{"name":"CLOCK FACE ONE-THIRTY","hex":"1F55C","short_name":"clock130","sort_order":259,"sheet_x":24,"sheet_y":23},{"name":"CLOCK FACE TWO-THIRTY","hex":"1F55D","short_name":"clock230","sort_order":260,"sheet_x":24,"sheet_y":24},{"name":"CLOCK FACE THREE-THIRTY","hex":"1F55E","short_name":"clock330","sort_order":261,"sheet_x":24,"sheet_y":25},{"name":"CLOCK FACE FOUR-THIRTY","hex":"1F55F","short_name":"clock430","sort_order":262,"sheet_x":24,"sheet_y":26},{"name":"CLOCK FACE FIVE-THIRTY","hex":"1F560","short_name":"clock530","sort_order":263,"sheet_x":24,"sheet_y":27},{"name":"CLOCK FACE SIX-THIRTY","hex":"1F561","short_name":"clock630","sort_order":264,"sheet_x":24,"sheet_y":28},{"name":"CLOCK FACE SEVEN-THIRTY","hex":"1F562","short_name":"clock730","sort_order":265,"sheet_x":24,"sheet_y":29},{"name":"CLOCK FACE EIGHT-THIRTY","hex":"1F563","short_name":"clock830","sort_order":266,"sheet_x":24,"sheet_y":30},{"name":"CLOCK FACE NINE-THIRTY","hex":"1F564","short_name":"clock930","sort_order":267,"sheet_x":24,"sheet_y":31},{"name":"CLOCK FACE TEN-THIRTY","hex":"1F565","short_name":"clock1030","sort_order":268,"sheet_x":24,"sheet_y":32},{"name":"CLOCK FACE ELEVEN-THIRTY","hex":"1F566","short_name":"clock1130","sort_order":269,"sheet_x":24,"sheet_y":33},{"name":"CLOCK FACE TWELVE-THIRTY","hex":"1F567","short_name":"clock1230","sort_order":270,"sheet_x":24,"sheet_y":34}],"short_name":"Symbols","class":"cm-emoji-heart","name":"Symbols","order":7},{"emoji":[{"name":"REGIONAL INDICATOR SYMBOL LETTERS AF","hex":"1F1E6-1F1EB","short_name":"flag-af","sort_order":1,"sheet_x":32,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AX","hex":"1F1E6-1F1FD","short_name":"flag-ax","sort_order":2,"sheet_x":33,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AL","hex":"1F1E6-1F1F1","short_name":"flag-al","sort_order":3,"sheet_x":32,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DZ","hex":"1F1E9-1F1FF","short_name":"flag-dz","sort_order":4,"sheet_x":34,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AS","hex":"1F1E6-1F1F8","short_name":"flag-as","sort_order":5,"sheet_x":33,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AD","hex":"1F1E6-1F1E9","short_name":"flag-ad","sort_order":6,"sheet_x":32,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AO","hex":"1F1E6-1F1F4","short_name":"flag-ao","sort_order":7,"sheet_x":33,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AI","hex":"1F1E6-1F1EE","short_name":"flag-ai","sort_order":8,"sheet_x":32,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AQ","hex":"1F1E6-1F1F6","short_name":"flag-aq","sort_order":9,"sheet_x":33,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AG","hex":"1F1E6-1F1EC","short_name":"flag-ag","sort_order":10,"sheet_x":32,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AR","hex":"1F1E6-1F1F7","short_name":"flag-ar","sort_order":11,"sheet_x":33,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AM","hex":"1F1E6-1F1F2","short_name":"flag-am","sort_order":12,"sheet_x":32,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AW","hex":"1F1E6-1F1FC","short_name":"flag-aw","sort_order":13,"sheet_x":33,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AU","hex":"1F1E6-1F1FA","short_name":"flag-au","sort_order":14,"sheet_x":33,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AT","hex":"1F1E6-1F1F9","short_name":"flag-at","sort_order":15,"sheet_x":33,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AZ","hex":"1F1E6-1F1FF","short_name":"flag-az","sort_order":16,"sheet_x":33,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BS","hex":"1F1E7-1F1F8","short_name":"flag-bs","sort_order":17,"sheet_x":33,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BH","hex":"1F1E7-1F1ED","short_name":"flag-bh","sort_order":18,"sheet_x":33,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BD","hex":"1F1E7-1F1E9","short_name":"flag-bd","sort_order":19,"sheet_x":33,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BB","hex":"1F1E7-1F1E7","short_name":"flag-bb","sort_order":20,"sheet_x":33,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BY","hex":"1F1E7-1F1FE","short_name":"flag-by","sort_order":21,"sheet_x":33,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BE","hex":"1F1E7-1F1EA","short_name":"flag-be","sort_order":22,"sheet_x":33,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BZ","hex":"1F1E7-1F1FF","short_name":"flag-bz","sort_order":23,"sheet_x":33,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BJ","hex":"1F1E7-1F1EF","short_name":"flag-bj","sort_order":24,"sheet_x":33,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BM","hex":"1F1E7-1F1F2","short_name":"flag-bm","sort_order":25,"sheet_x":33,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BT","hex":"1F1E7-1F1F9","short_name":"flag-bt","sort_order":26,"sheet_x":33,"sheet_y":25},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BO","hex":"1F1E7-1F1F4","short_name":"flag-bo","sort_order":27,"sheet_x":33,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BQ","hex":"1F1E7-1F1F6","short_name":"flag-bq","sort_order":28,"sheet_x":33,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BA","hex":"1F1E7-1F1E6","short_name":"flag-ba","sort_order":29,"sheet_x":33,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BW","hex":"1F1E7-1F1FC","short_name":"flag-bw","sort_order":30,"sheet_x":33,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BR","hex":"1F1E7-1F1F7","short_name":"flag-br","sort_order":31,"sheet_x":33,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IO","hex":"1F1EE-1F1F4","short_name":"flag-io","sort_order":32,"sheet_x":35,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VG","hex":"1F1FB-1F1EC","short_name":"flag-vg","sort_order":33,"sheet_x":38,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BN","hex":"1F1E7-1F1F3","short_name":"flag-bn","sort_order":34,"sheet_x":33,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BG","hex":"1F1E7-1F1EC","short_name":"flag-bg","sort_order":35,"sheet_x":33,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BF","hex":"1F1E7-1F1EB","short_name":"flag-bf","sort_order":36,"sheet_x":33,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BI","hex":"1F1E7-1F1EE","short_name":"flag-bi","sort_order":37,"sheet_x":33,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CV","hex":"1F1E8-1F1FB","short_name":"flag-cv","sort_order":38,"sheet_x":34,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KH","hex":"1F1F0-1F1ED","short_name":"flag-kh","sort_order":39,"sheet_x":35,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CM","hex":"1F1E8-1F1F2","short_name":"flag-cm","sort_order":40,"sheet_x":33,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CA","hex":"1F1E8-1F1E6","short_name":"flag-ca","sort_order":41,"sheet_x":33,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IC","hex":"1F1EE-1F1E8","short_name":"flag-ic","sort_order":42,"sheet_x":35,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KY","hex":"1F1F0-1F1FE","short_name":"flag-ky","sort_order":43,"sheet_x":35,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CF","hex":"1F1E8-1F1EB","short_name":"flag-cf","sort_order":44,"sheet_x":33,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TD","hex":"1F1F9-1F1E9","short_name":"flag-td","sort_order":45,"sheet_x":38,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CL","hex":"1F1E8-1F1F1","short_name":"flag-cl","sort_order":46,"sheet_x":33,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CN","hex":"1F1E8-1F1F3","short_name":"flag-cn","sort_order":47,"sheet_x":33,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CX","hex":"1F1E8-1F1FD","short_name":"flag-cx","sort_order":48,"sheet_x":34,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CC","hex":"1F1E8-1F1E8","short_name":"flag-cc","sort_order":49,"sheet_x":33,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CO","hex":"1F1E8-1F1F4","short_name":"flag-co","sort_order":50,"sheet_x":34,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KM","hex":"1F1F0-1F1F2","short_name":"flag-km","sort_order":51,"sheet_x":35,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CG","hex":"1F1E8-1F1EC","short_name":"flag-cg","sort_order":52,"sheet_x":33,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CD","hex":"1F1E8-1F1E9","short_name":"flag-cd","sort_order":53,"sheet_x":33,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CK","hex":"1F1E8-1F1F0","short_name":"flag-ck","sort_order":54,"sheet_x":33,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CR","hex":"1F1E8-1F1F7","short_name":"flag-cr","sort_order":55,"sheet_x":34,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HR","hex":"1F1ED-1F1F7","short_name":"flag-hr","sort_order":56,"sheet_x":35,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CU","hex":"1F1E8-1F1FA","short_name":"flag-cu","sort_order":57,"sheet_x":34,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CW","hex":"1F1E8-1F1FC","short_name":"flag-cw","sort_order":58,"sheet_x":34,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CY","hex":"1F1E8-1F1FE","short_name":"flag-cy","sort_order":59,"sheet_x":34,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CZ","hex":"1F1E8-1F1FF","short_name":"flag-cz","sort_order":60,"sheet_x":34,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DK","hex":"1F1E9-1F1F0","short_name":"flag-dk","sort_order":61,"sheet_x":34,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DJ","hex":"1F1E9-1F1EF","short_name":"flag-dj","sort_order":62,"sheet_x":34,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DM","hex":"1F1E9-1F1F2","short_name":"flag-dm","sort_order":63,"sheet_x":34,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DO","hex":"1F1E9-1F1F4","short_name":"flag-do","sort_order":64,"sheet_x":34,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EC","hex":"1F1EA-1F1E8","short_name":"flag-ec","sort_order":65,"sheet_x":34,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EG","hex":"1F1EA-1F1EC","short_name":"flag-eg","sort_order":66,"sheet_x":34,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SV","hex":"1F1F8-1F1FB","short_name":"flag-sv","sort_order":67,"sheet_x":38,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GQ","hex":"1F1EC-1F1F6","short_name":"flag-gq","sort_order":68,"sheet_x":35,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ER","hex":"1F1EA-1F1F7","short_name":"flag-er","sort_order":69,"sheet_x":34,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EE","hex":"1F1EA-1F1EA","short_name":"flag-ee","sort_order":70,"sheet_x":34,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ET","hex":"1F1EA-1F1F9","short_name":"flag-et","sort_order":71,"sheet_x":34,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EU","hex":"1F1EA-1F1FA","short_name":"flag-eu","sort_order":72,"sheet_x":34,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FK","hex":"1F1EB-1F1F0","short_name":"flag-fk","sort_order":73,"sheet_x":34,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FO","hex":"1F1EB-1F1F4","short_name":"flag-fo","sort_order":74,"sheet_x":34,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FJ","hex":"1F1EB-1F1EF","short_name":"flag-fj","sort_order":75,"sheet_x":34,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FI","hex":"1F1EB-1F1EE","short_name":"flag-fi","sort_order":76,"sheet_x":34,"sheet_y":25},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FR","hex":"1F1EB-1F1F7","short_name":"flag-fr","sort_order":77,"sheet_x":34,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GF","hex":"1F1EC-1F1EB","short_name":"flag-gf","sort_order":78,"sheet_x":34,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PF","hex":"1F1F5-1F1EB","short_name":"flag-pf","sort_order":79,"sheet_x":37,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TF","hex":"1F1F9-1F1EB","short_name":"flag-tf","sort_order":80,"sheet_x":38,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GA","hex":"1F1EC-1F1E6","short_name":"flag-ga","sort_order":81,"sheet_x":34,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GM","hex":"1F1EC-1F1F2","short_name":"flag-gm","sort_order":82,"sheet_x":34,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GE","hex":"1F1EC-1F1EA","short_name":"flag-ge","sort_order":83,"sheet_x":34,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DE","hex":"1F1E9-1F1EA","short_name":"flag-de","sort_order":84,"sheet_x":34,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GH","hex":"1F1EC-1F1ED","short_name":"flag-gh","sort_order":85,"sheet_x":34,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GI","hex":"1F1EC-1F1EE","short_name":"flag-gi","sort_order":86,"sheet_x":34,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GR","hex":"1F1EC-1F1F7","short_name":"flag-gr","sort_order":87,"sheet_x":35,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GL","hex":"1F1EC-1F1F1","short_name":"flag-gl","sort_order":88,"sheet_x":34,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GD","hex":"1F1EC-1F1E9","short_name":"flag-gd","sort_order":89,"sheet_x":34,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GP","hex":"1F1EC-1F1F5","short_name":"flag-gp","sort_order":90,"sheet_x":35,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GU","hex":"1F1EC-1F1FA","short_name":"flag-gu","sort_order":91,"sheet_x":35,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GT","hex":"1F1EC-1F1F9","short_name":"flag-gt","sort_order":92,"sheet_x":35,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GG","hex":"1F1EC-1F1EC","short_name":"flag-gg","sort_order":93,"sheet_x":34,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GN","hex":"1F1EC-1F1F3","short_name":"flag-gn","sort_order":94,"sheet_x":35,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GW","hex":"1F1EC-1F1FC","short_name":"flag-gw","sort_order":95,"sheet_x":35,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GY","hex":"1F1EC-1F1FE","short_name":"flag-gy","sort_order":96,"sheet_x":35,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HT","hex":"1F1ED-1F1F9","short_name":"flag-ht","sort_order":97,"sheet_x":35,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HN","hex":"1F1ED-1F1F3","short_name":"flag-hn","sort_order":98,"sheet_x":35,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HK","hex":"1F1ED-1F1F0","short_name":"flag-hk","sort_order":99,"sheet_x":35,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HU","hex":"1F1ED-1F1FA","short_name":"flag-hu","sort_order":100,"sheet_x":35,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IS","hex":"1F1EE-1F1F8","short_name":"flag-is","sort_order":101,"sheet_x":35,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IN","hex":"1F1EE-1F1F3","short_name":"flag-in","sort_order":102,"sheet_x":35,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ID","hex":"1F1EE-1F1E9","short_name":"flag-id","sort_order":103,"sheet_x":35,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IR","hex":"1F1EE-1F1F7","short_name":"flag-ir","sort_order":104,"sheet_x":35,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IQ","hex":"1F1EE-1F1F6","short_name":"flag-iq","sort_order":105,"sheet_x":35,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IE","hex":"1F1EE-1F1EA","short_name":"flag-ie","sort_order":106,"sheet_x":35,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IM","hex":"1F1EE-1F1F2","short_name":"flag-im","sort_order":107,"sheet_x":35,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IL","hex":"1F1EE-1F1F1","short_name":"flag-il","sort_order":108,"sheet_x":35,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS IT","hex":"1F1EE-1F1F9","short_name":"flag-it","sort_order":109,"sheet_x":35,"sheet_y":25},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CI","hex":"1F1E8-1F1EE","short_name":"flag-ci","sort_order":110,"sheet_x":33,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS JM","hex":"1F1EF-1F1F2","short_name":"flag-jm","sort_order":111,"sheet_x":35,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS JP","hex":"1F1EF-1F1F5","short_name":"flag-jp","sort_order":112,"sheet_x":35,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS JE","hex":"1F1EF-1F1EA","short_name":"flag-je","sort_order":113,"sheet_x":35,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS JO","hex":"1F1EF-1F1F4","short_name":"flag-jo","sort_order":114,"sheet_x":35,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KZ","hex":"1F1F0-1F1FF","short_name":"flag-kz","sort_order":115,"sheet_x":35,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KE","hex":"1F1F0-1F1EA","short_name":"flag-ke","sort_order":116,"sheet_x":35,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KI","hex":"1F1F0-1F1EE","short_name":"flag-ki","sort_order":117,"sheet_x":35,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS XK","hex":"1F1FD-1F1F0","short_name":"flag-xk","sort_order":118,"sheet_x":38,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KW","hex":"1F1F0-1F1FC","short_name":"flag-kw","sort_order":119,"sheet_x":35,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KG","hex":"1F1F0-1F1EC","short_name":"flag-kg","sort_order":120,"sheet_x":35,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LA","hex":"1F1F1-1F1E6","short_name":"flag-la","sort_order":121,"sheet_x":36,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LV","hex":"1F1F1-1F1FB","short_name":"flag-lv","sort_order":122,"sheet_x":36,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LB","hex":"1F1F1-1F1E7","short_name":"flag-lb","sort_order":123,"sheet_x":36,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LS","hex":"1F1F1-1F1F8","short_name":"flag-ls","sort_order":124,"sheet_x":36,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LR","hex":"1F1F1-1F1F7","short_name":"flag-lr","sort_order":125,"sheet_x":36,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LY","hex":"1F1F1-1F1FE","short_name":"flag-ly","sort_order":126,"sheet_x":36,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LI","hex":"1F1F1-1F1EE","short_name":"flag-li","sort_order":127,"sheet_x":36,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LT","hex":"1F1F1-1F1F9","short_name":"flag-lt","sort_order":128,"sheet_x":36,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LU","hex":"1F1F1-1F1FA","short_name":"flag-lu","sort_order":129,"sheet_x":36,"sheet_y":8},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MO","hex":"1F1F2-1F1F4","short_name":"flag-mo","sort_order":130,"sheet_x":36,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MK","hex":"1F1F2-1F1F0","short_name":"flag-mk","sort_order":131,"sheet_x":36,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MG","hex":"1F1F2-1F1EC","short_name":"flag-mg","sort_order":132,"sheet_x":36,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MW","hex":"1F1F2-1F1FC","short_name":"flag-mw","sort_order":133,"sheet_x":36,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MY","hex":"1F1F2-1F1FE","short_name":"flag-my","sort_order":134,"sheet_x":36,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MV","hex":"1F1F2-1F1FB","short_name":"flag-mv","sort_order":135,"sheet_x":36,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ML","hex":"1F1F2-1F1F1","short_name":"flag-ml","sort_order":136,"sheet_x":36,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MT","hex":"1F1F2-1F1F9","short_name":"flag-mt","sort_order":137,"sheet_x":36,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MH","hex":"1F1F2-1F1ED","short_name":"flag-mh","sort_order":138,"sheet_x":36,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MQ","hex":"1F1F2-1F1F6","short_name":"flag-mq","sort_order":139,"sheet_x":36,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MR","hex":"1F1F2-1F1F7","short_name":"flag-mr","sort_order":140,"sheet_x":36,"sheet_y":25},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MU","hex":"1F1F2-1F1FA","short_name":"flag-mu","sort_order":141,"sheet_x":36,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS YT","hex":"1F1FE-1F1F9","short_name":"flag-yt","sort_order":142,"sheet_x":38,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MX","hex":"1F1F2-1F1FD","short_name":"flag-mx","sort_order":143,"sheet_x":36,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS FM","hex":"1F1EB-1F1F2","short_name":"flag-fm","sort_order":144,"sheet_x":34,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MD","hex":"1F1F2-1F1E9","short_name":"flag-md","sort_order":145,"sheet_x":36,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MC","hex":"1F1F2-1F1E8","short_name":"flag-mc","sort_order":146,"sheet_x":36,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MN","hex":"1F1F2-1F1F3","short_name":"flag-mn","sort_order":147,"sheet_x":36,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ME","hex":"1F1F2-1F1EA","short_name":"flag-me","sort_order":148,"sheet_x":36,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MS","hex":"1F1F2-1F1F8","short_name":"flag-ms","sort_order":149,"sheet_x":36,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MA","hex":"1F1F2-1F1E6","short_name":"flag-ma","sort_order":150,"sheet_x":36,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MZ","hex":"1F1F2-1F1FF","short_name":"flag-mz","sort_order":151,"sheet_x":36,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MM","hex":"1F1F2-1F1F2","short_name":"flag-mm","sort_order":152,"sheet_x":36,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NA","hex":"1F1F3-1F1E6","short_name":"flag-na","sort_order":153,"sheet_x":36,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NR","hex":"1F1F3-1F1F7","short_name":"flag-nr","sort_order":154,"sheet_x":37,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NP","hex":"1F1F3-1F1F5","short_name":"flag-np","sort_order":155,"sheet_x":37,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NL","hex":"1F1F3-1F1F1","short_name":"flag-nl","sort_order":156,"sheet_x":36,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NC","hex":"1F1F3-1F1E8","short_name":"flag-nc","sort_order":157,"sheet_x":36,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NZ","hex":"1F1F3-1F1FF","short_name":"flag-nz","sort_order":158,"sheet_x":37,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NI","hex":"1F1F3-1F1EE","short_name":"flag-ni","sort_order":159,"sheet_x":36,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NE","hex":"1F1F3-1F1EA","short_name":"flag-ne","sort_order":160,"sheet_x":36,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NG","hex":"1F1F3-1F1EC","short_name":"flag-ng","sort_order":161,"sheet_x":36,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NU","hex":"1F1F3-1F1FA","short_name":"flag-nu","sort_order":162,"sheet_x":37,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NF","hex":"1F1F3-1F1EB","short_name":"flag-nf","sort_order":163,"sheet_x":36,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MP","hex":"1F1F2-1F1F5","short_name":"flag-mp","sort_order":164,"sheet_x":36,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KP","hex":"1F1F0-1F1F5","short_name":"flag-kp","sort_order":165,"sheet_x":35,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS NO","hex":"1F1F3-1F1F4","short_name":"flag-no","sort_order":166,"sheet_x":37,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS OM","hex":"1F1F4-1F1F2","short_name":"flag-om","sort_order":167,"sheet_x":37,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PK","hex":"1F1F5-1F1F0","short_name":"flag-pk","sort_order":168,"sheet_x":37,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PW","hex":"1F1F5-1F1FC","short_name":"flag-pw","sort_order":169,"sheet_x":37,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PS","hex":"1F1F5-1F1F8","short_name":"flag-ps","sort_order":170,"sheet_x":37,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PA","hex":"1F1F5-1F1E6","short_name":"flag-pa","sort_order":171,"sheet_x":37,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PG","hex":"1F1F5-1F1EC","short_name":"flag-pg","sort_order":172,"sheet_x":37,"sheet_y":9},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PY","hex":"1F1F5-1F1FE","short_name":"flag-py","sort_order":173,"sheet_x":37,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PE","hex":"1F1F5-1F1EA","short_name":"flag-pe","sort_order":174,"sheet_x":37,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PH","hex":"1F1F5-1F1ED","short_name":"flag-ph","sort_order":175,"sheet_x":37,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PN","hex":"1F1F5-1F1F3","short_name":"flag-pn","sort_order":176,"sheet_x":37,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PL","hex":"1F1F5-1F1F1","short_name":"flag-pl","sort_order":177,"sheet_x":37,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PT","hex":"1F1F5-1F1F9","short_name":"flag-pt","sort_order":178,"sheet_x":37,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PR","hex":"1F1F5-1F1F7","short_name":"flag-pr","sort_order":179,"sheet_x":37,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS QA","hex":"1F1F6-1F1E6","short_name":"flag-qa","sort_order":180,"sheet_x":37,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS RE","hex":"1F1F7-1F1EA","short_name":"flag-re","sort_order":181,"sheet_x":37,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS RO","hex":"1F1F7-1F1F4","short_name":"flag-ro","sort_order":182,"sheet_x":37,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS RU","hex":"1F1F7-1F1FA","short_name":"flag-ru","sort_order":183,"sheet_x":37,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS RW","hex":"1F1F7-1F1FC","short_name":"flag-rw","sort_order":184,"sheet_x":37,"sheet_y":25},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BL","hex":"1F1E7-1F1F1","short_name":"flag-bl","sort_order":185,"sheet_x":33,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SH","hex":"1F1F8-1F1ED","short_name":"flag-sh","sort_order":186,"sheet_x":37,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KN","hex":"1F1F0-1F1F3","short_name":"flag-kn","sort_order":187,"sheet_x":35,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LC","hex":"1F1F1-1F1E8","short_name":"flag-lc","sort_order":188,"sheet_x":36,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS PM","hex":"1F1F5-1F1F2","short_name":"flag-pm","sort_order":189,"sheet_x":37,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VC","hex":"1F1FB-1F1E8","short_name":"flag-vc","sort_order":190,"sheet_x":38,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS WS","hex":"1F1FC-1F1F8","short_name":"flag-ws","sort_order":191,"sheet_x":38,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SM","hex":"1F1F8-1F1F2","short_name":"flag-sm","sort_order":192,"sheet_x":37,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ST","hex":"1F1F8-1F1F9","short_name":"flag-st","sort_order":193,"sheet_x":38,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SA","hex":"1F1F8-1F1E6","short_name":"flag-sa","sort_order":194,"sheet_x":37,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SN","hex":"1F1F8-1F1F3","short_name":"flag-sn","sort_order":195,"sheet_x":37,"sheet_y":38},{"name":"REGIONAL INDICATOR SYMBOL LETTERS RS","hex":"1F1F7-1F1F8","short_name":"flag-rs","sort_order":196,"sheet_x":37,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SC","hex":"1F1F8-1F1E8","short_name":"flag-sc","sort_order":197,"sheet_x":37,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SL","hex":"1F1F8-1F1F1","short_name":"flag-sl","sort_order":198,"sheet_x":37,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SG","hex":"1F1F8-1F1EC","short_name":"flag-sg","sort_order":199,"sheet_x":37,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SX","hex":"1F1F8-1F1FD","short_name":"flag-sx","sort_order":200,"sheet_x":38,"sheet_y":3},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SK","hex":"1F1F8-1F1F0","short_name":"flag-sk","sort_order":201,"sheet_x":37,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SI","hex":"1F1F8-1F1EE","short_name":"flag-si","sort_order":202,"sheet_x":37,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SB","hex":"1F1F8-1F1E7","short_name":"flag-sb","sort_order":203,"sheet_x":37,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SO","hex":"1F1F8-1F1F4","short_name":"flag-so","sort_order":204,"sheet_x":37,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ZA","hex":"1F1FF-1F1E6","short_name":"flag-za","sort_order":205,"sheet_x":39,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GS","hex":"1F1EC-1F1F8","short_name":"flag-gs","sort_order":206,"sheet_x":35,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS KR","hex":"1F1F0-1F1F7","short_name":"flag-kr","sort_order":207,"sheet_x":35,"sheet_y":37},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SS","hex":"1F1F8-1F1F8","short_name":"flag-ss","sort_order":208,"sheet_x":38,"sheet_y":0},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ES","hex":"1F1EA-1F1F8","short_name":"flag-es","sort_order":209,"sheet_x":34,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS LK","hex":"1F1F1-1F1F0","short_name":"flag-lk","sort_order":210,"sheet_x":36,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SD","hex":"1F1F8-1F1E9","short_name":"flag-sd","sort_order":211,"sheet_x":37,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SR","hex":"1F1F8-1F1F7","short_name":"flag-sr","sort_order":212,"sheet_x":37,"sheet_y":40},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SZ","hex":"1F1F8-1F1FF","short_name":"flag-sz","sort_order":213,"sheet_x":38,"sheet_y":5},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SE","hex":"1F1F8-1F1EA","short_name":"flag-se","sort_order":214,"sheet_x":37,"sheet_y":30},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CH","hex":"1F1E8-1F1ED","short_name":"flag-ch","sort_order":215,"sheet_x":33,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SY","hex":"1F1F8-1F1FE","short_name":"flag-sy","sort_order":216,"sheet_x":38,"sheet_y":4},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TW","hex":"1F1F9-1F1FC","short_name":"flag-tw","sort_order":217,"sheet_x":38,"sheet_y":21},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TJ","hex":"1F1F9-1F1EF","short_name":"flag-tj","sort_order":218,"sheet_x":38,"sheet_y":12},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TZ","hex":"1F1F9-1F1FF","short_name":"flag-tz","sort_order":219,"sheet_x":38,"sheet_y":22},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TH","hex":"1F1F9-1F1ED","short_name":"flag-th","sort_order":220,"sheet_x":38,"sheet_y":11},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TL","hex":"1F1F9-1F1F1","short_name":"flag-tl","sort_order":221,"sheet_x":38,"sheet_y":14},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TG","hex":"1F1F9-1F1EC","short_name":"flag-tg","sort_order":222,"sheet_x":38,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TK","hex":"1F1F9-1F1F0","short_name":"flag-tk","sort_order":223,"sheet_x":38,"sheet_y":13},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TO","hex":"1F1F9-1F1F4","short_name":"flag-to","sort_order":224,"sheet_x":38,"sheet_y":17},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TT","hex":"1F1F9-1F1F9","short_name":"flag-tt","sort_order":225,"sheet_x":38,"sheet_y":19},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TN","hex":"1F1F9-1F1F3","short_name":"flag-tn","sort_order":226,"sheet_x":38,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TR","hex":"1F1F9-1F1F7","short_name":"flag-tr","sort_order":227,"sheet_x":38,"sheet_y":18},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TM","hex":"1F1F9-1F1F2","short_name":"flag-tm","sort_order":228,"sheet_x":38,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TC","hex":"1F1F9-1F1E8","short_name":"flag-tc","sort_order":229,"sheet_x":38,"sheet_y":7},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TV","hex":"1F1F9-1F1FB","short_name":"flag-tv","sort_order":230,"sheet_x":38,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS UG","hex":"1F1FA-1F1EC","short_name":"flag-ug","sort_order":231,"sheet_x":38,"sheet_y":24},{"name":"REGIONAL INDICATOR SYMBOL LETTERS UA","hex":"1F1FA-1F1E6","short_name":"flag-ua","sort_order":232,"sheet_x":38,"sheet_y":23},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AE","hex":"1F1E6-1F1EA","short_name":"flag-ae","sort_order":233,"sheet_x":32,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS GB","hex":"1F1EC-1F1E7","short_name":"flag-gb","sort_order":234,"sheet_x":34,"sheet_y":32},{"name":"REGIONAL INDICATOR SYMBOL LETTERS US","hex":"1F1FA-1F1F8","short_name":"flag-us","sort_order":235,"sheet_x":38,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VI","hex":"1F1FB-1F1EE","short_name":"flag-vi","sort_order":236,"sheet_x":38,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS UY","hex":"1F1FA-1F1FE","short_name":"flag-uy","sort_order":237,"sheet_x":38,"sheet_y":27},{"name":"REGIONAL INDICATOR SYMBOL LETTERS UZ","hex":"1F1FA-1F1FF","short_name":"flag-uz","sort_order":238,"sheet_x":38,"sheet_y":28},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VU","hex":"1F1FB-1F1FA","short_name":"flag-vu","sort_order":239,"sheet_x":38,"sheet_y":35},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VA","hex":"1F1FB-1F1E6","short_name":"flag-va","sort_order":240,"sheet_x":38,"sheet_y":29},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VE","hex":"1F1FB-1F1EA","short_name":"flag-ve","sort_order":241,"sheet_x":38,"sheet_y":31},{"name":"REGIONAL INDICATOR SYMBOL LETTERS VN","hex":"1F1FB-1F1F3","short_name":"flag-vn","sort_order":242,"sheet_x":38,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS WF","hex":"1F1FC-1F1EB","short_name":"flag-wf","sort_order":243,"sheet_x":38,"sheet_y":36},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EH","hex":"1F1EA-1F1ED","short_name":"flag-eh","sort_order":244,"sheet_x":34,"sheet_y":20},{"name":"REGIONAL INDICATOR SYMBOL LETTERS YE","hex":"1F1FE-1F1EA","short_name":"flag-ye","sort_order":245,"sheet_x":38,"sheet_y":39},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ZM","hex":"1F1FF-1F1F2","short_name":"flag-zm","sort_order":246,"sheet_x":39,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS ZW","hex":"1F1FF-1F1FC","short_name":"flag-zw","sort_order":247,"sheet_x":39,"sheet_y":2},{"name":"REGIONAL INDICATOR SYMBOL LETTERS AC","hex":"1F1E6-1F1E8","short_name":"flag-ac","sort_order":248,"sheet_x":32,"sheet_y":33},{"name":"REGIONAL INDICATOR SYMBOL LETTERS BV","hex":"1F1E7-1F1FB","short_name":"flag-bv","sort_order":249,"sheet_x":33,"sheet_y":26},{"name":"REGIONAL INDICATOR SYMBOL LETTERS CP","hex":"1F1E8-1F1F5","short_name":"flag-cp","sort_order":250,"sheet_x":34,"sheet_y":1},{"name":"REGIONAL INDICATOR SYMBOL LETTERS DG","hex":"1F1E9-1F1EC","short_name":"flag-dg","sort_order":251,"sheet_x":34,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS EA","hex":"1F1EA-1F1E6","short_name":"flag-ea","sort_order":252,"sheet_x":34,"sheet_y":16},{"name":"REGIONAL INDICATOR SYMBOL LETTERS HM","hex":"1F1ED-1F1F2","short_name":"flag-hm","sort_order":253,"sheet_x":35,"sheet_y":10},{"name":"REGIONAL INDICATOR SYMBOL LETTERS MF","hex":"1F1F2-1F1EB","short_name":"flag-mf","sort_order":254,"sheet_x":36,"sheet_y":15},{"name":"REGIONAL INDICATOR SYMBOL LETTERS SJ","hex":"1F1F8-1F1EF","short_name":"flag-sj","sort_order":255,"sheet_x":37,"sheet_y":34},{"name":"REGIONAL INDICATOR SYMBOL LETTERS TA","hex":"1F1F9-1F1E6","short_name":"flag-ta","sort_order":256,"sheet_x":38,"sheet_y":6},{"name":"REGIONAL INDICATOR SYMBOL LETTERS UM","hex":"1F1FA-1F1F2","short_name":"flag-um","sort_order":257,"sheet_x":38,"sheet_y":25}],"short_name":"Flags","class":"cm-emoji-flag-um","name":"Flags","order":8}]
})());


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
angular.module('ngEmojiPicker').filter('aliasify', [
    'ngEmojiTransforms', function (ngEmojiTransforms) {
        return ngEmojiTransforms.aliasify;
    }
]);

angular.module('ngEmojiPicker').filter('emojify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.emojify;
  }
]);

angular.module('ngEmojiPicker').filter('hexify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.hexify;
  }
]);

angular.module('ngEmojiPicker').filter('imagify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.imagify;
  }
]);

angular.module('ngEmojiPicker').filter('unicodeToImage', [
    'ngEmojiTransforms', function (ngEmojiTransforms) {
        return ngEmojiTransforms.unicodeToImage;
    }
]);


angular.module('ngEmojiPicker').filter('unicodify', [
  'ngEmojiTransforms', function (ngEmojiTransforms) {
    return ngEmojiTransforms.unicodify;
  }
]);

angular.module('ngEmojiPicker').factory('ngEmojiLocalStorage', function () {
    var factory = {
        length: 0
    };
    var storage = {};

    var countLength = function (storageObject) {
        var length = 0;

        angular.forEach(storageObject, function () {
            length += 1;
        });

        return length;
    };

    factory.setItem = function (key, value) {
        storage[key] = value;
        factory.length = countLength(storage);
    };

    factory.getItem = function (name) {
        var value = storage[name];

        if (value == null) {
            return null;
        }

        return value;
    };

    factory.removeItem = function (key) {
        var value = factory.getItem(key);
        delete storage[key];
        factory.length = countLength(storage);

        return value;
    };

    factory.clear = function () {
        storage = {};
    };

    factory.key = function () {
        throw new Error('Realization required');
    };

    return factory;
});

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
