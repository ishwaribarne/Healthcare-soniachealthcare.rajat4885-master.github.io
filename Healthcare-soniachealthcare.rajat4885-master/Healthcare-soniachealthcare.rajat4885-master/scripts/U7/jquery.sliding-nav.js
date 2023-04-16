(function ( $ ) {

    $.fn.slidingNav = function( options ) {
        
        this._settings = $.extend({
            topSpacing: 10, 
            bottomSpacing: 10, 
            rightSpacing: 30, 
            initialPlacement: 800, 
            triggerPoint: 800
        }, options );

        this._state = "top"; // following, top, bottom

        this._init = function(){
            this._setInitialState();
            this._setEventHandlers();                     
        };
        this._setInitialState = function(){
            if (this._isScrollable())
            {
                this._setAtTop();
                this._setNavState();
                this._setContainerMargin();          
            } 
            else 
            {
                this._hideNav();
                this._setContainerMargin();                
            }
        };
        this._isNavVisible = function(){
            return 1 == $(this).css("opacity");
        };
        this._showNav = function(){
            $(this).css({
                "opacity": 1, 
                "z-index": 10
            });
        };
        this._hideNav = function(){
            $(this).css({
                "opacity": 0, 
                "z-index": -99999
            });
        };
        this._setNavScrolling = function(){
            var isPastTop = this._isPastTopBoundary();
            var isPastBottom = this._isPastBottomBoundary();
            
            if (isPastTop && !isPastBottom)
            {
                this._setFollowing();
            } 
            else if (isPastTop && isPastBottom)
            {
                this._setAtBottom();
            } 
            else 
            {
                this._setAtTop()
            }
        };
        this._setNavState = function(){
            
            if (this._getDocumentScrollTop() > this._settings.triggerPoint)
            {
                this._showNav();
            }
            else 
            {
                this._hideNav();
            }
            if (this._isNavVisible())
            {
                this._setNavScrolling();
            } 
        };
        this._setFollowing = function(){   
            this._state = "following";
            $(this).css({
                position: "fixed", 
                top: this._getHeaderHeight() + this._settings.topSpacing
            });       
        };
        this._setAtTop = function(){
            this._state = "top";
            $(this).css({
                position: "absolute", 
                top: this._getHeaderHeight() + this._settings.initialPlacement
            });
        };
        this._setAtBottom = function(){
            this._state = "bottom";
            $(this).css({
                position: "absolute", 
                top: this._getEndingPosition() - this._getNavHeight()
            });
        };
        this._getContainerMarginModifiers = function(){
            var container = $('.sliding-nav').parent();
            var containerWidth = container.outerWidth()
            var bodyWidth = $('body').outerWidth();

            var deductPadding = parseInt(container.css("padding-left")) - 15;
            var deductMargin = (bodyWidth - containerWidth) / 2;
            var navWidth = this._getNavWidth();

            var deductibleSpace = navWidth - deductMargin - deductPadding + this._settings.rightSpacing;
            
            return deductibleSpace < 0 ? 0 : deductibleSpace;
        };
        this._setContainerMargin = function(){
            $('.fixed-content').css("margin-left", this._getContainerMarginModifiers());
        };
        this._setEventHandlers = function(){
            var that = this; 
            
            $(window).on('scroll', function(){
                that._setNavState();
            });
            $(window).on('resize', function(){
                if (that.resizeHandler)
                {
                    clearTimeout(that.resizeHandler);
                }
                that.resizeHandler = setTimeout(function(){
                    that._setInitialState();
                }, 100);
            });
            $(".sliding-nav .open-trigger, .sliding-nav .close-trigger").click(function () {
                $(".sliding-nav").toggleClass("open");
                that._setNavState();
                that._setContainerMargin();
            });
        };
        this._isNavOpen = function(){
            return $(this).hasClass('open');
        };
        this._isScrollable = function(){
            return this._getNavHeight() + this._getHeaderHeight() + this._settings.topSpacing < this._getWindowHeight();
        };
        this._isPastTopBoundary = function(){
            return this._getDocumentScrollTop() >= this._settings.initialPlacement - this._settings.topSpacing;
        };
        this._isPastBottomBoundary = function(){
            return this._getFixedNavBottom() >= this._getEndingPosition();
        };
        this._getFixedNavBottom = function(){
            return this._getDocumentScrollTop() + this._getHeaderHeight() + this._settings.topSpacing + this._getNavHeight();     
        };
        this._getStartingPosition = function(){
            return this._getHeaderHeight() + this._settings.initialPlacement;
        };
        this._getEndingPosition = function(){
            return this._getDocumentHeight() - this._getFooterHeight() - this._settings.bottomSpacing;
        }
        this._getHeaderHeight = function(){
            return $("header").outerHeight();
        }
        this._getFooterHeight = function(){
            return $("footer").outerHeight();
        }
        this._getWindowHeight = function(){
            return $(window).outerHeight();
        };
        this._getDocumentHeight = function(){
            return $(document).outerHeight();
        };
        this._getNavWidth = function(){
            if (this._isNavOpen())
            {
                return $(this).outerWidth();
            }
            else 
            {
                return $(this).find(".open-btn").outerWidth();
            }
        };
        this._getNavHeight = function(){
            if (this._isNavOpen())
            {
                return $(this).outerHeight();
            }
            else 
            {
                return $(this).find(".open-btn").outerHeight();
            }
        };
        this._getNavTop = function(){
            return $(this).offset().top;
        };
        this._getDocumentScrollTop = function(){
            return $(document).scrollTop();
        };
        this._getDocumentScrollBottom = function(){
            return $(document).scrollTop() + this._getWindowHeight();
        };
        
        this._init();
 
    };
 
}( jQuery ));