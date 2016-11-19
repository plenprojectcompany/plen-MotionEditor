"use strict";

// The application module's namespace definition.
var APP_NAME = "MotionEditor";

angular.module(APP_NAME, [
    "ngAnimate",
    "ui.sortable",
    "ui.bootstrap"
]);

// @attention If you use Batarang, you should disable "strictDi" property.
angular.element(() =>
{
    angular.bootstrap(document.body, [APP_NAME], { strictDi: true });
});