 /// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class EditPropertiesModalController
{
    loop_options = {
        use: false,
        args: [0, 0, 255]
    };

    jump_options = {
        use:  false,
        args: [0]
    };

    static $inject = [
        "$modalInstance",
        "SharedMotionService"
    ];

    constructor(
        public $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        public motion: MotionModel
    )
    {
        _.each(this.motion.codes, (code: CodeModel) =>
        {
            if (code.func == "loop")
            {
                this.loop_options.use  = true;
                this.loop_options.args = code.args;
            }

            if (code.func == "jump")
            {
                this.jump_options.use  = true;
                this.jump_options.args = code.args;
            }
        });
    }

    ok(): void
    {
        try {
            if (_.isUndefined(this.motion.slot))
            {
                throw "Slot: Please fill the property. (Required value is between 0 to 89.)";
            }

            if ((this.motion.name.length > 20)
                || (!/^[\w\s]+$/.test(this.motion.name)))
            {
                throw "Name: Required format is half-width alphanumerics and length is 20 bytes or less.";
            }

            if (this.loop_options.use)
            {
                if (   (_.isUndefined(this.loop_options.args[0]))
                    || (this.loop_options.args[0] > this.loop_options.args[1]) )
                {
                    var max = this.loop_options.args[1];

                    throw "Loop function - Begin: Please fill the propertie. (Required value is between 0 to " + max.toString() + ".)";
                }

                if (   (_.isUndefined(this.loop_options.args[1]))
                    || (this.loop_options.args[1] < this.loop_options.args[0])
                    || (this.loop_options.args[1] >= this.motion.frames.length) )
                {
                    var min = this.loop_options.args[0];
                    var max = this.motion.frames.length - 1;

                    throw "Loop function - End: Please fill the propertie. (Required value is between " + min.toString() + " to " + max.toString() + ".)";
                }

                if (_.isUndefined(this.loop_options.args[2]))
                {
                    throw "Loop function - Count: Please fill the propertie. (Required value is between 1 to 255.)";
                }
            }

            if (this.jump_options.use)
            {
                if (_.isUndefined(this.jump_options.args[0]))
                {
                    throw "Jump function - Slot: Please fill the propertie. (Required value is between 0 to 89.)";
                }
            }
        }
        catch (exception)
        {
            alert(exception);

            return;
        }

        this.motion.codes = [];

        if (this.loop_options.use)
        {
            this.motion.codes.push(new CodeModel("loop", this.loop_options.args));
        }

        if (this.jump_options.use)
        {
            this.motion.codes.push(new CodeModel("jump", this.jump_options.args));
        }

        this.$modalInstance.close();
    }
}