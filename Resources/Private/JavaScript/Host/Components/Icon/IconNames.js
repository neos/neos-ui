import iconStyles from './icons.css';

const ICON_NAMES = Object.keys(iconStyles);
const MIGRATION_PATH = [
    {
        deprecated: ['icon-glass'],
        name: 'fa-glass'
    },
    {
        deprecated: ['icon-music'],
        name: 'fa-music'
    },
    {
        deprecated: ['icon-search'],
        name: 'fa-search'
    },
    {
        deprecated: ['icon-envelope-alt'],
        name: 'fa-envelope-o'
    },
    {
        deprecated: ['icon-heart'],
        name: 'fa-heart'
    },
    {
        deprecated: ['icon-star'],
        name: 'fa-star'
    },
    {
        deprecated: ['star-empty'],
        name: 'fa-star-o'
    },
    {
        deprecated: ['icon-user'],
        name: 'fa-user'
    },
    {
        deprecated: ['icon-film'],
        name: 'fa-film'
    },
    {
        deprecated: ['icon-th-large'],
        name: 'fa-th-large'
    },
    {
        deprecated: ['icon-th'],
        name: 'fa-th'
    },
    {
        deprecated: ['icon-th-list'],
        name: 'fa-th-list'
    },
    {
        deprecated: ['icon-ok'],
        name: 'fa-check'
    },
    {
        deprecated: ['icon-remove'],
        name: 'fa-times'
    },
    {
        deprecated: ['icon-zoom-in'],
        name: 'fa-search-plus'
    },
    {
        deprecated: ['icon-zoom-out'],
        name: 'fa-search-minus'
    },
    {
        deprecated: ['icon-power-off'],
        name: 'fa-power-off'
    },
    {
        deprecated: ['icon-off'],
        name: 'fa-power-off'
    },
    {
        deprecated: ['icon-signal'],
        name: 'fa-signal'
    },
    {
        deprecated: ['icon-gear'],
        name: 'fa-gear'
    },
    {
        deprecated: ['icon-cog'],
        name: 'fa-cog'
    },
    {
        deprecated: ['icon-trash'],
        name: 'fa-trash-o'
    },
    {
        deprecated: ['icon-home'],
        name: 'fa-home'
    },
    {
        deprecated: ['icon-file-alt'],
        name: 'fa-file-alt'
    },
    {
        deprecated: ['icon-file-alt'],
        name: 'fa-file-o'
    },
    {
        deprecated: ['icon-time'],
        name: 'fa-clock-o'
    },
    {
        deprecated: ['icon-road'],
        name: 'fa-road'
    },
    {
        deprecated: ['icon-download-alt'],
        name: 'fa-download'
    },
    {
        deprecated: ['icon-download'],
        name: 'fa-arrow-circle-o-down'
    },
    {
        deprecated: ['icon-upload'],
        name: 'fa-arrow-circle-o-up'
    },
    {
        deprecated: ['icon-inbox'],
        name: 'fa-inbox'
    },
    {
        deprecated: ['icon-play-circle'],
        name: 'fa-play-circle-o'
    },
    {
        deprecated: ['icon-rotate-right'],
        name: 'fa-rotate-right'
    },
    {
        deprecated: ['icon-repeat'],
        name: 'fa-repeat'
    },
    {
        deprecated: ['icon-refresh'],
        name: 'fa-refresh'
    },
    {
        deprecated: ['icon-list-alt'],
        name: 'fa-list-alt'
    },
    {
        deprecated: ['icon-lock'],
        name: 'fa-lock'
    },
    {
        deprecated: ['icon-flag'],
        name: 'fa-flag'
    },
    {
        deprecated: ['icon-headphones'],
        name: 'fa-headphones'
    },
    {
        deprecated: ['icon-volume-off'],
        name: 'fa-volume-off'
    },
    {
        deprecated: ['icon-volume-down'],
        name: 'fa-volume-down'
    },
    {
        deprecated: ['icon-volume-up'],
        name: 'fa-volume-up'
    },
    {
        deprecated: ['icon-qrcode'],
        name: 'fa-qrcode'
    },
    {
        deprecated: ['icon-barcode'],
        name: 'fa-barcode'
    },
    {
        deprecated: ['icon-tag'],
        name: 'fa-tag'
    },
    {
        deprecated: ['icon-tags'],
        name: 'fa-tags'
    },
    {
        deprecated: ['icon-book'],
        name: 'fa-book'
    },
    {
        deprecated: ['icon-bookmark'],
        name: 'fa-bookmark'
    },
    {
        deprecated: ['icon-print'],
        name: 'fa-print'
    },
    {
        deprecated: ['icon-camera'],
        name: 'fa-camera'
    },
    {
        deprecated: ['icon-font'],
        name: 'fa-font'
    },
    {
        deprecated: ['icon-bold'],
        name: 'fa-bold'
    },
    {
        deprecated: ['icon-italic'],
        name: 'fa-italic'
    },
    {
        deprecated: ['icon-text-height'],
        name: 'fa-text-height'
    },
    {
        deprecated: ['icon-text-width'],
        name: 'fa-text-width'
    },
    {
        deprecated: ['icon-align-left'],
        name: 'fa-align-left'
    },
    {
        deprecated: ['icon-align-center'],
        name: 'fa-align-center'
    },
    {
        deprecated: ['icon-align-right'],
        name: 'fa-align-right'
    },
    {
        deprecated: ['icon-align-justify'],
        name: 'fa-align-justify'
    },
    {
        deprecated: ['icon-list'],
        name: 'fa-list'
    },
    {
        deprecated: ['icon-indent-left'],
        name: 'fa-outdent'
    },
    {
        deprecated: ['icon-indent-right'],
        name: 'fa-indent'
    },
    {
        deprecated: ['icon-facetime-video'],
        name: 'fa-facetime-video'
    },
    {
        deprecated: ['icon-picture'],
        name: 'fa-picture-o'
    },
    {
        deprecated: ['icon-pencil'],
        name: 'fa-pencil'
    },
    {
        deprecated: ['icon-map-marker'],
        name: 'fa-map-marker'
    },
    {
        deprecated: ['icon-adjust'],
        name: 'fa-adjust'
    },
    {
        deprecated: ['icon-tint'],
        name: 'fa-tint'
    },
    {
        deprecated: ['icon-edit'],
        name: 'fa-edit'
    },
    {
        deprecated: ['icon-edit'],
        name: 'fa-pencil-square-o'
    },
    {
        deprecated: ['icon-share'],
        name: 'fa-share-square-o'
    },
    {
        deprecated: ['icon-check'],
        name: 'fa-check-square-o'
    },
    {
        deprecated: ['icon-move'],
        name: 'fa-arrows'
    },
    {
        deprecated: ['icon-step-backward'],
        name: 'fa-step-backward'
    },
    {
        deprecated: ['icon-fast-backward'],
        name: 'fa-fast-backward'
    },
    {
        deprecated: ['icon-backward'],
        name: 'fa-backward'
    },
    {
        deprecated: ['icon-play'],
        name: 'fa-play'
    },
    {
        deprecated: ['icon-pause'],
        name: 'fa-pause'
    },
    {
        deprecated: ['icon-stop'],
        name: 'fa-stop'
    },
    {
        deprecated: ['icon-forward'],
        name: 'fa-forward'
    },
    {
        deprecated: ['icon-fast-forward'],
        name: 'fa-fast-forward'
    },
    {
        deprecated: ['icon-step-forward'],
        name: 'fa-step-forward'
    },
    {
        deprecated: ['icon-eject'],
        name: 'fa-eject'
    },
    {
        deprecated: ['icon-chevron-left'],
        name: 'fa-chevron-left'
    },
    {
        deprecated: ['icon-chevron-right'],
        name: 'fa-chevron-right'
    },
    {
        deprecated: ['icon-plus-sign'],
        name: 'fa-plus-circle'
    },
    {
        deprecated: ['icon-minus-sign'],
        name: 'fa-minus-sign'
    },
    {
        deprecated: ['icon-minus-sign'],
        name: 'fa-minus-circle'
    },
    {
        deprecated: ['icon-remove-sign'],
        name: 'fa-times-circle'
    },
    {
        deprecated: ['icon-ok-sign'],
        name: 'fa-ok-sign'
    },
    {
        deprecated: ['icon-ok-sign'],
        name: 'fa-check-circle'
    },
    {
        deprecated: ['icon-question-sign'],
        name: 'fa-question-circle'
    },
    {
        deprecated: ['icon-info-sign'],
        name: 'fa-info-circle'
    },
    {
        deprecated: ['icon-screenshot'],
        name: 'fa-crosshairs'
    },
    {
        deprecated: ['icon-remove-circle'],
        name: 'fa-times-circle-o'
    },
    {
        deprecated: ['icon-ban-circle'],
        name: 'fa-ban'
    },
    {
        deprecated: ['icon-ok-circle'],
        name: 'fa-check-circle-o'
    },
    {
        deprecated: ['icon-arrow-left'],
        name: 'fa-arrow-left'
    },
    {
        deprecated: ['icon-arrow-right'],
        name: 'fa-arrow-right'
    },
    {
        deprecated: ['icon-arrow-up'],
        name: 'fa-arrow-up'
    },
    {
        deprecated: ['icon-arrow-down'],
        name: 'fa-arrow-down'
    },
    {
        deprecated: ['icon-mail-forward'],
        name: 'fa-mail-forward'
    },
    {
        deprecated: ['icon-share-alt'],
        name: 'fa-share'
    },
    {
        deprecated: ['icon-resize-full'],
        name: 'fa-expand'
    },
    {
        deprecated: ['icon-resize-small'],
        name: 'fa-compress'
    },
    {
        deprecated: ['icon-plus'],
        name: 'fa-plus'
    },
    {
        deprecated: ['icon-minus'],
        name: 'fa-minus'
    },
    {
        deprecated: ['icon-asterisk'],
        name: 'fa-asterisk'
    },
    {
        deprecated: ['icon-exclamation-sign'],
        name: 'fa-exclamation-circle'
    },
    {
        deprecated: ['icon-gift'],
        name: 'fa-gift'
    },
    {
        deprecated: ['icon-leaf'],
        name: 'fa-leaf'
    },
    {
        deprecated: ['icon-fire'],
        name: 'fa-fire'
    },
    {
        deprecated: ['icon-eye-open'],
        name: 'fa-eye'
    },
    {
        deprecated: ['icon-eye-close'],
        name: 'fa-eye-slash'
    },
    {
        deprecated: ['icon-warning-sign'],
        name: 'fa-exclamation-triangle'
    },
    {
        deprecated: ['icon-plane'],
        name: 'fa-plane'
    },
    {
        deprecated: ['icon-calendar'],
        name: 'fa-calendar'
    },
    {
        deprecated: ['icon-random'],
        name: 'fa-random'
    },
    {
        deprecated: ['icon-comment'],
        name: 'fa-comment'
    },
    {
        deprecated: ['icon-magnet'],
        name: 'fa-magnet'
    },
    {
        deprecated: ['icon-chevron-up'],
        name: 'fa-chevron-up'
    },
    {
        deprecated: ['icon-chevron-down'],
        name: 'fa-chevron-down'
    },
    {
        deprecated: ['icon-retweet'],
        name: 'fa-retweet'
    },
    {
        deprecated: ['icon-shopping-cart'],
        name: 'fa-shopping-cart'
    },
    {
        deprecated: ['icon-folder-close'],
        name: 'fa-folder'
    },
    {
        deprecated: ['icon-folder-open'],
        name: 'fa-folder-open'
    },
    {
        deprecated: ['icon-resize-vertical'],
        name: 'fa-arrows-v'
    },
    {
        deprecated: ['icon-resize-horizontal'],
        name: 'fa-arrows-h'
    },
    {
        deprecated: ['icon-bar-chart'],
        name: 'fa-bar-chart-o'
    },
    {
        deprecated: ['icon-twitter-sign'],
        name: 'fa-twitter-square'
    },
    {
        deprecated: ['icon-facebook-sign'],
        name: 'fa-facebook-square'
    },
    {
        deprecated: ['icon-camera-retro'],
        name: 'fa-camera-retro'
    },
    {
        deprecated: ['icon-key'],
        name: 'fa-key'
    },
    {
        deprecated: ['icon-gears'],
        name: 'fa-gears'
    },
    {
        deprecated: ['icon-cogs'],
        name: 'fa-cogs'
    },
    {
        deprecated: ['icon-comments'],
        name: 'fa-comments'
    },
    {
        deprecated: ['icon-thumbs-up-alt'],
        name: 'fa-thumbs-o-up'
    },
    {
        deprecated: ['icon-thumbs-down-alt'],
        name: 'fa-thumbs-o-down'
    },
    {
        deprecated: ['icon-star-half'],
        name: 'fa-star-half'
    },
    {
        deprecated: ['icon-heart-empty'],
        name: 'fa-heart-o'
    },
    {
        deprecated: ['icon-signout'],
        name: 'fa-sign-out'
    },
    {
        deprecated: ['icon-linkedin-sign'],
        name: 'fa-linkedin-square'
    },
    {
        deprecated: ['icon-pushpin'],
        name: 'fa-thumb-tack'
    },
    {
        deprecated: ['icon-external-link'],
        name: 'fa-external-link'
    },
    {
        deprecated: ['icon-signin'],
        name: 'fa-sign-in'
    },
    {
        deprecated: ['icon-trophy'],
        name: 'fa-trophy'
    },
    {
        deprecated: ['icon-github-sign'],
        name: 'fa-github-square'
    },
    {
        deprecated: ['icon-upload-alt'],
        name: 'fa-upload'
    },
    {
        deprecated: ['icon-lemon'],
        name: 'fa-lemon-o'
    },
    {
        deprecated: ['icon-phone'],
        name: 'fa-phone'
    },
    {
        deprecated: ['icon-unchecked'],
        name: 'fa-unchecked'
    },
    {
        deprecated: ['icon-check-empty'],
        name: 'fa-square-o'
    },
    {
        deprecated: ['icon-bookmark-empty'],
        name: 'fa-bookmark-o'
    },
    {
        deprecated: ['icon-phone-sign'],
        name: 'fa-phone-square'
    },
    {
        deprecated: ['icon-twitter'],
        name: 'fa-twitter'
    },
    {
        deprecated: ['icon-facebook'],
        name: 'fa-facebook'
    },
    {
        deprecated: ['icon-github'],
        name: 'fa-github'
    },
    {
        deprecated: ['icon-unlock'],
        name: 'fa-unlock'
    },
    {
        deprecated: ['icon-credit-card'],
        name: 'fa-credit-card'
    },
    {
        deprecated: ['icon-rss'],
        name: 'fa-rss'
    },
    {
        deprecated: ['icon-hdd'],
        name: 'fa-hdd-o'
    },
    {
        deprecated: ['icon-bullhorn'],
        name: 'fa-bullhorn'
    },
    {
        deprecated: ['icon-bell'],
        name: 'fa-bell-o'
    },
    {
        deprecated: ['icon-certificate'],
        name: 'fa-certificate'
    },
    {
        deprecated: ['icon-hand-right'],
        name: 'fa-hand-o-down'
    },
    {
        deprecated: ['icon-hand-left'],
        name: 'fa-hand-o-left'
    },
    {
        deprecated: ['icon-hand-up'],
        name: 'fa-hand-o-up'
    },
    {
        deprecated: ['icon-hand-down'],
        name: 'fa-hand-o-down'
    },
    {
        deprecated: ['icon-circle-arrow-left'],
        name: 'fa-arrow-circle-down'
    },
    {
        deprecated: ['icon-circle-arrow-left'],
        name: 'fa-arrow-circle-left'
    },
    {
        deprecated: ['icon-circle-arrow-right'],
        name: 'fa-arrow-circle-right'
    },
    {
        deprecated: ['icon-circle-arrow-up'],
        name: 'fa-arrow-circle-up'
    },
    {
        deprecated: ['icon-globe'],
        name: 'fa-globe'
    },
    {
        deprecated: ['icon-wrench'],
        name: 'fa-wrench'
    },
    {
        deprecated: ['icon-tasks'],
        name: 'fa-tasks'
    },
    {
        deprecated: ['icon-filter'],
        name: 'fa-filter'
    },
    {
        deprecated: ['icon-briefcase'],
        name: 'fa-briefcase'
    },
    {
        deprecated: ['icon-fullscreen'],
        name: 'fa-fullscreen'
    },
    {
        deprecated: ['icon-fullscreen'],
        name: 'fa-arrows-alt'
    },
    {
        deprecated: ['icon-group'],
        name: 'fa-users'
    },
    {
        deprecated: ['icon-link'],
        name: 'fa-link'
    },
    {
        deprecated: ['icon-cloud'],
        name: 'fa-cloud'
    },
    {
        deprecated: ['icon-beaker'],
        name: 'fa-flask'
    },
    {
        deprecated: ['icon-cut'],
        name: 'fa-scissors'
    },
    {
        deprecated: ['icon-copy'],
        name: 'fa-files-o'
    },
    {
        deprecated: ['icon-paperclip'],
        name: 'fa-paperclip'
    },
    {
        deprecated: ['icon-paper-clip'],
        name: 'fa-paperclip'
    },
    {
        deprecated: ['icon-save'],
        name: 'fa-floppy-o'
    },
    {
        deprecated: ['icon-sign-blank'],
        name: 'fa-square'
    },
    {
        deprecated: ['icon-reorder'],
        name: 'fa-bars'
    },
    {
        deprecated: ['icon-list-ul'],
        name: 'fa-list-ul'
    },
    {
        deprecated: ['icon-list-ol'],
        name: 'fa-list-ol'
    },
    {
        deprecated: ['icon-strikethrough'],
        name: 'fa-strikethrough'
    },
    {
        deprecated: ['icon-underline'],
        name: 'fa-underline'
    },
    {
        deprecated: ['icon-table'],
        name: 'fa-table'
    },
    {
        deprecated: ['icon-magic'],
        name: 'fa-magic'
    },
    {
        deprecated: ['icon-truck'],
        name: 'fa-truck'
    },
    {
        deprecated: ['icon-pinterest'],
        name: 'fa-pinterest'
    },
    {
        deprecated: ['icon-pinterest-sign'],
        name: 'fa-pinterest-square'
    },
    {
        deprecated: ['icon-google-plus-sign'],
        name: 'fa-google-plus-square'
    },
    {
        deprecated: ['icon-google-plus'],
        name: 'fa-google-plus'
    },
    {
        deprecated: ['icon-money'],
        name: 'fa-money'
    },
    {
        deprecated: ['icon-caret-down'],
        name: 'fa-caret-down'
    },
    {
        deprecated: ['icon-caret-up'],
        name: 'fa-caret-up'
    },
    {
        deprecated: ['icon-caret-left'],
        name: 'fa-caret-left'
    },
    {
        deprecated: ['icon-caret-right'],
        name: 'fa-caret-right'
    },
    {
        deprecated: ['icon-columns'],
        name: 'fa-columns'
    },
    {
        deprecated: ['icon-sort'],
        name: 'fa-sort'
    },
    {
        deprecated: ['icon-sort-down'],
        name: 'fa-sort-desc'
    },
    {
        deprecated: ['icon-sort-up'],
        name: 'fa-sort-asc'
    },
    {
        deprecated: ['icon-envelope'],
        name: 'fa-envelope'
    },
    {
        deprecated: ['icon-linkedin'],
        name: 'fa-linkedin'
    },
    {
        deprecated: ['icon-rotate-left'],
        name: 'fa-rotate-left'
    },
    {
        deprecated: ['icon-undo'],
        name: 'fa-undo'
    },
    {
        deprecated: ['icon-legal'],
        name: 'fa-gavel'
    },
    {
        deprecated: ['icon-dashboard'],
        name: 'fa-tachometer'
    },
    {
        deprecated: ['icon-comment-alt'],
        name: 'fa-comment-o'
    },
    {
        deprecated: ['icon-comments-alt'],
        name: 'fa-comments-o'
    },
    {
        deprecated: ['icon-bolt'],
        name: 'fa-bolt'
    },
    {
        deprecated: ['icon-sitemap'],
        name: 'fa-sitemap'
    },
    {
        deprecated: ['icon-umbrella'],
        name: 'fa-umbrella'
    },
    {
        deprecated: ['icon-paste'],
        name: 'fa-clipboard'
    },
    {
        deprecated: ['icon-lightbulb'],
        name: 'fa-lightbulb-o'
    },
    {
        deprecated: ['icon-exchange'],
        name: 'fa-exchange'
    },
    {
        deprecated: ['icon-cloud-download'],
        name: 'fa-cloud-download'
    },
    {
        deprecated: ['icon-cloud-upload'],
        name: 'fa-cloud-upload'
    },
    {
        deprecated: ['icon-user-md'],
        name: 'fa-user-md'
    },
    {
        deprecated: ['icon-stethoscope'],
        name: 'fa-stethoscope'
    },
    {
        deprecated: ['icon-suitcase'],
        name: 'fa-suitcase'
    },
    {
        deprecated: ['icon-bell-alt'],
        name: 'fa-bell'
    },
    {
        deprecated: ['icon-coffee'],
        name: 'fa-coffee'
    },
    {
        deprecated: ['icon-food'],
        name: 'fa-cutlery'
    },
    {
        deprecated: ['icon-file-text-alt'],
        name: 'fa-file-text-o'
    },
    {
        deprecated: ['icon-building'],
        name: 'fa-building-o'
    },
    {
        deprecated: ['icon-hospital'],
        name: 'fa-hospital-o'
    },
    {
        deprecated: ['icon-ambulance'],
        name: 'fa-ambulance'
    },
    {
        deprecated: ['icon-medkit'],
        name: 'fa-medkit'
    },
    {
        deprecated: ['icon-fighter-jet'],
        name: 'fa-fighter-jet'
    },
    {
        deprecated: ['icon-beer'],
        name: 'fa-beer'
    },
    {
        deprecated: ['icon-h-sign'],
        name: 'fa-h-square'
    },
    {
        deprecated: ['icon-plus-sign-alt'],
        name: 'fa-plus-square'
    },
    {
        deprecated: ['icon-double-angle-left'],
        name: 'fa-angle-double-left'
    },
    {
        deprecated: ['icon-double-angle-right'],
        name: 'fa-angle-double-right'
    },
    {
        deprecated: ['icon-double-angle-up'],
        name: 'fa-angle-double-up'
    },
    {
        deprecated: ['icon-double-angle-down'],
        name: 'fa-angle-double-down'
    },
    {
        deprecated: ['icon-angle-left'],
        name: 'fa-angle-left'
    },
    {
        deprecated: ['icon-angle-right'],
        name: 'fa-angle-right'
    },
    {
        deprecated: ['icon-angle-up'],
        name: 'fa-angle-up'
    },
    {
        deprecated: ['icon-angle-down'],
        name: 'fa-angle-down'
    },
    {
        deprecated: ['icon-desktop'],
        name: 'fa-desktop'
    },
    {
        deprecated: ['icon-laptop'],
        name: 'fa-laptop'
    },
    {
        deprecated: ['icon-tablet'],
        name: 'fa-tablet'
    },
    {
        deprecated: ['icon-mobile-phone'],
        name: 'fa-mobile'
    },
    {
        deprecated: ['icon-circle-blank'],
        name: 'fa-circle-o'
    },
    {
        deprecated: ['icon-quote-left'],
        name: 'fa-quote-left'
    },
    {
        deprecated: ['icon-quote-right'],
        name: 'fa-quote-right'
    },
    {
        deprecated: ['icon-spinner'],
        name: 'fa-spinner'
    },
    {
        deprecated: ['icon-circle'],
        name: 'fa-circle'
    },
    {
        deprecated: ['icon-mail-reply'],
        name: 'fa-mail-reply'
    },
    {
        deprecated: ['icon-reply'],
        name: 'fa-reply'
    },
    {
        deprecated: ['icon-github-alt'],
        name: 'fa-github-alt'
    },
    {
        deprecated: ['icon-folder-close-alt'],
        name: 'fa-folder-o'
    },
    {
        deprecated: ['icon-folder-open-alt'],
        name: 'fa-folder-open-o'
    },
    {
        deprecated: ['icon-collapse-alt'],
        name: 'fa-minus-square-o'
    },
    {
        deprecated: ['icon-expand-alt'],
        name: 'fa-plus-square-o'
    },
    {
        deprecated: ['icon-smile'],
        name: 'fa-smile-o'
    },
    {
        deprecated: ['icon-frown'],
        name: 'fa-frown-o'
    },
    {
        deprecated: ['icon-meh'],
        name: 'fa-meh-o'
    },
    {
        deprecated: ['icon-gamepad'],
        name: 'fa-gamepad'
    },
    {
        deprecated: ['icon-keyboard'],
        name: 'fa-keyboard-o'
    },
    {
        deprecated: ['icon-flag-alt'],
        name: 'fa-flag-alt'
    },
    {
        deprecated: ['icon-flag-alt'],
        name: 'fa-flag-o'
    },
    {
        deprecated: ['icon-flag-checkered'],
        name: 'fa-flag-checkered'
    },
    {
        deprecated: ['icon-terminal'],
        name: 'fa-terminal'
    },
    {
        deprecated: ['icon-code'],
        name: 'fa-code'
    },
    {
        deprecated: ['icon-reply-all'],
        name: 'fa-reply-all'
    },
    {
        deprecated: ['icon-mail-reply-all'],
        name: 'fa-mail-reply-all'
    },
    {
        deprecated: ['icon-star-half-full'],
        name: 'fa-star-half-full'
    },
    {
        deprecated: ['icon-star-half-empty'],
        name: 'fa-star-half-o'
    },
    {
        deprecated: ['icon-location-arrow'],
        name: 'fa-location-arrow'
    },
    {
        deprecated: ['icon-crop'],
        name: 'fa-crop'
    },
    {
        deprecated: ['icon-code-fork'],
        name: 'fa-code-fork'
    },
    {
        deprecated: ['icon-unlink'],
        name: 'fa-chain-broken'
    },
    {
        deprecated: ['icon-question'],
        name: 'fa-question'
    },
    {
        deprecated: ['icon-info'],
        name: 'fa-info'
    },
    {
        deprecated: ['icon-exclamation'],
        name: 'fa-exclamation'
    },
    {
        deprecated: ['icon-superscript'],
        name: 'fa-superscript'
    },
    {
        deprecated: ['icon-subscript'],
        name: 'fa-subscript'
    },
    {
        deprecated: ['icon-eraser'],
        name: 'fa-eraser'
    },
    {
        deprecated: ['icon-puzzle-piece'],
        name: 'fa-puzzle-piece'
    },
    {
        deprecated: ['icon-microphone'],
        name: 'fa-microphone'
    },
    {
        deprecated: ['icon-microphone-off'],
        name: 'fa-microphone-slash'
    },
    {
        deprecated: ['icon-shield'],
        name: 'fa-shield'
    },
    {
        deprecated: ['icon-calendar-empty'],
        name: 'fa-calendar-o'
    },
    {
        deprecated: ['icon-fire-extinguisher'],
        name: 'fa-fire-extinguisher'
    },
    {
        deprecated: ['icon-rocket'],
        name: 'fa-rocket'
    },
    {
        deprecated: ['icon-maxcdn'],
        name: 'fa-maxcdn'
    },
    {
        deprecated: ['icon-chevron-sign-left'],
        name: 'fa-chevron-left'
    },
    {
        deprecated: ['icon-chevron-sign-right'],
        name: 'fa-chevron-right'
    },
    {
        deprecated: ['icon-chevron-sign-up'],
        name: 'fa-chevron-up'
    },
    {
        deprecated: ['icon-chevron-sign-down'],
        name: 'fa-chevron-down'
    },
    {
        deprecated: ['icon-html5'],
        name: 'fa-html5'
    },
    {
        deprecated: ['icon-css3'],
        name: 'fa-css3'
    },
    {
        deprecated: ['icon-anchor'],
        name: 'fa-anchor'
    },
    {
        deprecated: ['icon-unlock-alt'],
        name: 'fa-unlock-alt'
    },
    {
        deprecated: ['icon-bullseye'],
        name: 'fa-bullseye'
    },
    {
        deprecated: ['icon-ellipsis-horizontal'],
        name: 'fa-ellipsis-h'
    },
    {
        deprecated: ['icon-ellipsis-vertical'],
        name: 'fa-ellipsis-v'
    },
    {
        deprecated: ['icon-rss-sign'],
        name: 'fa-rss-square'
    },
    {
        deprecated: ['icon-play-sign'],
        name: 'fa-play-circle'
    },
    {
        deprecated: ['icon-ticket'],
        name: 'fa-ticket'
    },
    {
        deprecated: ['icon-minus-sign-alt'],
        name: 'fa-minus-square'
    },
    {
        deprecated: ['icon-check-minus'],
        name: 'fa-minus-square-o'
    },
    {
        deprecated: ['icon-level-up'],
        name: 'fa-level-up'
    },
    {
        deprecated: ['icon-level-down'],
        name: 'fa-level-down'
    },
    {
        deprecated: ['icon-check-sign'],
        name: 'fa-check-square'
    },
    {
        deprecated: ['icon-edit-sign'],
        name: 'fa-pencil-square'
    },
    {
        deprecated: ['icon-external-link-sign'],
        name: 'fa-external-link-square'
    },
    {
        deprecated: ['icon-share-sign'],
        name: 'fa-share-square'
    },
    {
        deprecated: ['icon-compass'],
        name: 'fa-compass'
    },
    {
        deprecated: ['icon-collapse'],
        name: 'fa-caret-square-o-down'
    },
    {
        deprecated: ['icon-collapse-top'],
        name: 'fa-caret-square-o-up'
    },
    {
        deprecated: ['icon-expand'],
        name: 'fa-caret-square-o-right'
    },
    {
        deprecated: ['icon-euro'],
        name: 'fa-euro'
    },
    {
        deprecated: ['icon-eur'],
        name: 'fa-eur'
    },
    {
        deprecated: ['icon-gbp'],
        name: 'fa-gbp'
    },
    {
        deprecated: ['icon-dollar'],
        name: 'fa-dollar'
    },
    {
        deprecated: ['icon-usd'],
        name: 'fa-usd'
    },
    {
        deprecated: ['icon-rupee'],
        name: 'fa-rupee'
    },
    {
        deprecated: ['icon-inr'],
        name: 'fa-inr'
    },
    {
        deprecated: ['icon-yen'],
        name: 'fa-yen'
    },
    {
        deprecated: ['icon-jpy'],
        name: 'fa-jpy'
    },
    {
        deprecated: ['icon-renminbi'],
        name: 'fa-renminbi'
    },
    {
        deprecated: ['icon-cny'],
        name: 'fa-rmb'
    },
    {
        deprecated: ['icon-won'],
        name: 'fa-won'
    },
    {
        deprecated: ['icon-krw'],
        name: 'fa-krw'
    },
    {
        deprecated: ['icon-bitcoin'],
        name: 'fa-bitcoin'
    },
    {
        deprecated: ['icon-btc'],
        name: 'fa-btc'
    },
    {
        deprecated: ['icon-file'],
        name: 'fa-file'
    },
    {
        deprecated: ['icon-file-text'],
        name: 'fa-file-text'
    },
    {
        deprecated: ['icon-sort-by-alphabet'],
        name: 'fa-sort-alpha-asc'
    },
    {
        deprecated: ['icon-sort-by-alphabet-alt'],
        name: 'fa-sort-alpha-desc'
    },
    {
        deprecated: ['icon-sort-by-attributes'],
        name: 'fa-sort-amount-asc'
    },
    {
        deprecated: ['icon-sort-by-attributes-alt'],
        name: 'fa-sort-amount-desc'
    },
    {
        deprecated: ['icon-sort-by-order'],
        name: 'fa-sort-numeric-asc'
    },
    {
        deprecated: ['icon-sort-by-order-alt'],
        name: 'fa-sort-numeric-desc'
    },
    {
        deprecated: ['icon-thumbs-up'],
        name: 'fa-thumbs-up'
    },
    {
        deprecated: ['icon-thumbs-down'],
        name: 'fa-thumbs-down'
    },
    {
        deprecated: ['icon-youtube-sign'],
        name: 'fa-youtube-square'
    },
    {
        deprecated: ['icon-youtube'],
        name: 'fa-youtube'
    },
    {
        deprecated: ['icon-xing'],
        name: 'fa-xing'
    },
    {
        deprecated: ['icon-xing-sign'],
        name: 'fa-xing-square'
    },
    {
        deprecated: ['icon-youtube-play'],
        name: 'fa-youtube-play'
    },
    {
        deprecated: ['icon-dropbox'],
        name: 'fa-dropbox'
    },
    {
        deprecated: ['icon-stackexchange'],
        name: 'fa-stack-overflow'
    },
    {
        deprecated: ['icon-instagram'],
        name: 'fa-instagram'
    },
    {
        deprecated: ['icon-flickr'],
        name: 'fa-flickr'
    },
    {
        deprecated: ['icon-adn'],
        name: 'fa-adn'
    },
    {
        deprecated: ['icon-bitbucket'],
        name: 'fa-bitbucket'
    },
    {
        deprecated: ['icon-bitbucket-sign'],
        name: 'fa-bitbucket-square'
    },
    {
        deprecated: ['icon-tumblr'],
        name: 'fa-tumblr'
    },
    {
        deprecated: ['icon-tumblr-sign'],
        name: 'fa-tumblr-square'
    },
    {
        deprecated: ['icon-long-arrow-down'],
        name: 'fa-long-arrow-down'
    },
    {
        deprecated: ['icon-long-arrow-up'],
        name: 'fa-long-arrow-up'
    },
    {
        deprecated: ['icon-long-arrow-left'],
        name: 'fa-long-arrow-left'
    },
    {
        deprecated: ['icon-long-arrow-right'],
        name: 'fa-long-arrow-right'
    },
    {
        deprecated: ['icon-apple'],
        name: 'fa-apple'
    },
    {
        deprecated: ['icon-windows'],
        name: 'fa-windows'
    },
    {
        deprecated: ['icon-android'],
        name: 'fa-android'
    },
    {
        deprecated: ['icon-linux'],
        name: 'fa-linux'
    },
    {
        deprecated: ['icon-dribbble'],
        name: 'fa-dribbble'
    },
    {
        deprecated: ['icon-skype'],
        name: 'fa-skype'
    },
    {
        deprecated: ['icon-foursquare'],
        name: 'fa-foursquare'
    },
    {
        deprecated: ['icon-trello'],
        name: 'fa-trello'
    },
    {
        deprecated: ['icon-female'],
        name: 'fa-female'
    },
    {
        deprecated: ['icon-male'],
        name: 'fa-male'
    },
    {
        deprecated: ['icon-gittip'],
        name: 'fa-gittip'
    },
    {
        deprecated: ['icon-sun'],
        name: 'fa-sun-o'
    },
    {
        deprecated: ['icon-moon'],
        name: 'fa-moon-o'
    },
    {
        deprecated: ['icon-archive'],
        name: 'fa-archive'
    },
    {
        deprecated: ['icon-bug'],
        name: 'fa-bug'
    },
    {
        deprecated: ['icon-vk'],
        name: 'fa-vk'
    },
    {
        deprecated: ['icon-weibo'],
        name: 'fa-weibo'
    },
    {
        deprecated: ['icon-renre'],
        name: 'fa-renre'
    }
];
export function validateIconId(id) {
    const name = id.indexOf('fa-') === 0 ? id : `fa-${id}`;
    const isValid = ICON_NAMES.indexOf(name) > -1;

    if (isValid) {
        return {
            isValid,
            iconName: name
        };
    }

    const migration = MIGRATION_PATH.filter(migration => migration.deprecated.indexOf(id) > -1).shift();

    return {
        isValid,
        isMigrated: true,
        iconName: migration.name
    };
}
