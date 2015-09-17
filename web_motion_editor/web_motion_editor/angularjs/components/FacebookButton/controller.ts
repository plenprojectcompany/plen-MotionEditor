"use strict";

class FacebookButtonController
{
    href: string;

    static $inject = ["$window"];

    constructor(
        public $window: ng.IWindowService
    )
    {
        this.href = "http://www.facebook.com/share.php?u=http://plen.jp/playground/motion-editor/";
    }

    click(): void
    {
        this.$window.open(
            encodeURI(this.href),
            "facebook_window",
            "width=650,height=470,menubar=no,toolbar=no,location=no,scrollbars=yes,sizable=no"
        );
    }
}   