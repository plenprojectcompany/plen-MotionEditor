"use strict";

class TwitterButtonController
{
    href: string;

    static $inject = ['$window'];

    constructor(
        public $window: ng.IWindowService
    )
    {
        this.href = "http://twitter.com/share?text=あなた好みにPLENを動かそう！「PLEN - Motion Editor for Web.」は、誰でも簡単にPLENのモーションを作成できるwebアプリです。&url=http://plen.jp/playground/motion-editor/&hashtags=PLEN";
    }

    click(): void
    {
        this.$window.open(
            encodeURI(this.href),
            'tweeter_window',
            'width=650,height=470,menubar=no,toolbar=no,location=no,scrollbars=yes,sizable=yes'
        );
    }
}  