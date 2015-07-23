"use strict";

class GoogleplusButtonController
{
    href: string;

    static $inject = ["$window"];

    constructor(
        public $window: ng.IWindowService
    )
    {
        this.href = "https://plus.google.com/share?url=http://plen.jp/playground/motion-editor/";
    }

    click(): void
    {
        this.$window.open(
            encodeURI(this.href),
            "googleplus_window",
            "width=650, height=450, menubar=no, toolbar=no, location=no, scrollbars=yes, sizable=yes"
        );
    }
}   