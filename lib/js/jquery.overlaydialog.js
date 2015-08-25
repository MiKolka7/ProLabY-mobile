(function($) {
    var OverlayDialog = function () {
        this.prevBodyOverflow = undefined
        this.prevBodyPosition = undefined

        this.$container = $('<div class="od-container" />')
            .css({'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'height': '100%', 'overflow': 'auto'})

        this.$body = $('<div class="od-body" />')

        this.$title = $('<div class="od-title" />')

        this.$close = $('<button class="od-close"></button>')
        
        this.$title.append(this.$close)
        this.$title.append('<div style="clear:both" />')
        this.$body.append(this.$title)
        this.$container.append(this.$body)
    }
    OverlayDialog.prototype.lockBodyScroll = function () {
        var $body = $(document.body)
            , $document = $(document)
        this.prevBodyOverflow = $body.css('overflow') || 'auto'
        this.prevBodyPosition = $body.css('position') || 'static'
        this.prevBodyMarginTop = $body.css('margin-top')
        this.prevScrollTop = $document.scrollTop()
        
        $body.css('overflow', 'hidden')
        $body.css('margin-top', -this.prevScrollTop)
        $body.css('position', 'fixed')
    }
    OverlayDialog.prototype.unlockBodyScroll = function () {
        var $body = $(document.body)
            , $document = $(document)
        
        $body.css('overflow', this.prevBodyOverflow)
        $body.css('margin-top', this.prevBodyMarginTop)
        $body.css('position', this.prevBodyPosition)
        $document.scrollTop(this.prevScrollTop)
    }
    OverlayDialog.prototype.size = function () {
        this.$body.css('min-height', this.$container.height())
    }

    OverlayDialog.prototype.scroll = function(event) {
        switch(event.keyCode) {
            case 38: // up
                this.$container.scrollTop(this.$container.scrollTop() - 100)
                break;
            case 40: // down
                this.$container.scrollTop(this.$container.scrollTop() + 100)
                break;
            case 33: // pageup
                this.$container.scrollTop(this.$container.scrollTop() - 300)
                break;
            case 34: case 32: // pagedown and space
                this.$container.scrollTop(this.$container.scrollTop() + 300)
                break;
            case 36: // home
                this.$container.scrollTop(0)
                break;
            case 35: // end
                this.$container.scrollTop(999999)
                break;
        }
    }
    var actions = {
        show: function (html) {
            var $el = $(this)

            var overlayDialog = new OverlayDialog()
            $el.data('overlay_dialog', overlayDialog)
            
            overlayDialog.$body.append($el)

            overlayDialog.lockBodyScroll()
            

            overlayDialog.$close.click(function() {
                $el.overlayDialog('close')
            })
            overlayDialog.$container.click(function(event) {
                if($(event.target).is(overlayDialog.$container)) {
                    $el.overlayDialog('close')
                }
            })

            overlayDialog.resizeCb = function() {
                overlayDialog.size()
            }
            $(window).resize(overlayDialog.resizeCb)

            overlayDialog.keydownCb = function(event) {
                if(event.keyCode == 27) { // handle escape button
                    $el.overlayDialog('close')
                }
                overlayDialog.scroll(event)
            }
            $(window).keydown(overlayDialog.keydownCb)

            $(document.body).append(overlayDialog.$container)

            overlayDialog.size()
        }
        , close: function() {
            var $el = $(this)

            var overlayDialog = $el.data('overlay_dialog')
            overlayDialog.$container.remove()

            $(window).off('resize', overlayDialog.resizeCb)
            $(window).off('keydown', overlayDialog.keydownCb)

            overlayDialog.unlockBodyScroll()
        }
    }


    $.fn.overlayDialog = function(action, options) {
        if(typeof action != 'string') {
            options = action
            action = 'show'
        }
        options = options || {}

        return this.each(function() {
            actions[action].call(this, options)
        })
    }

})(jQuery)