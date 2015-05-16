"use strict";

class ImageStoreService
{
    private _image_canvas;
    private _context;

    constructor()
    {
        this._image_canvas = angular.element("<canvas/>")[0];
        this._image_canvas.width  = 150;
        this._image_canvas.height = 150;

        this._context = this._image_canvas.getContext("2d");
    }

    set(image: any): void
    {
        var sx, sy, sw, sh;

        if (image.width > image.height)
        {
            sy = 0;
            sw = image.height;
            sh = image.height;

            sx = (image.width - sw) / 2;
        }
        else
        {
            sx = 0;
            sw = image.width;
            sh = image.width;

            sy = (image.height - sh) / 2;
        }

        this._context.drawImage(image, sx, sy, sw, sh, 0, 0, 150, 150);
    }

    get(): string
    {
        return this._image_canvas.toDataURL();
    }
}

angular.module(app_name).service("ImageStoreService", ImageStoreService);