var fontsize = 0;

var app = window.app || {};

$(function() {
    $('body').addClass('w-no-scroll');

    var device = setDevice();
    deviceChangeTasks(device, device);

    setEventHandlers();
    setBodyScrollClass();
    initTranslateAriaTimer();
    setMore();
    setWhiteFeaturePadding();
    setHeights();
    setInactiveTimer(window);
    setNavigationScrollMaxWidth();
    setMegaMenuLayouts();
    moveModalsToEndOfDocument();
    initCarousel();
    setGalleryHeight();
    setStickyFooter();
    setFullWidthHeight();
    //setRTEImageProperties();

    $('body').mousemove(function() {
        setFullWidthHeight()
    })

    if (isAndroidStockBrowser()) {
        $.reject({
            reject: { all: true, closeCookie: true }
        });
    } else {
        $.reject({
            closeCookie: true
        });
    }

    if (!("ontouchstart" in document.documentElement)) {
        document.documentElement.className += " no-touch";
    } else {
        document.documentElement.className += " has-touch";
    }

    // $('#sideMenuAccordion').dcAccordion({
    //     eventType: 'click',
    //     autoClose: false,
    //     saveState: true,
    //     disableLink: false,
    //     speed: 'fast',
    //     menuClose: false,
    //     classActive: 'Active',
    //     showCount: false
    // });
    // $(". side-nav button").on("click", function(){
    //     var $menu = $(this).next("ul");
    //     $menu.slideDown
    // });
    $(".side-nav [aria-pressed=true]").siblings("[aria-hidden=true]").each(function() {
        $(this).attr("aria-hidden", "false");
    });
    $('li.ParentOpen > ul.childmenu').css('display', 'block', 'important');
});

function setRTEImageProperties() {
    $(".w-rte img[style*=\"float\"]").each(function() {
        $(this).parent().css("overflow", "hidden");
    });
}

function setCarouselPaginationVisibility() {
    $(".w-carousel").each(function(i) {
        var $holder = $(this).find(".w-carousel-pagination");
        var $pagination = $(this).find(".jcarousel-pagination");
        var $dots = $pagination.children();
        var dotsLength = $dots.length;
        var dotsWidth = $dots.first().outerWidth(true) * dotsLength;
        var playWidth = $(this).find(".w-carousel-play").outerWidth(true);
        var combinedWidth = dotsWidth + playWidth;
        var availableWidth = $holder.width();

        combinedWidth >= availableWidth ? $pagination.hide() : $pagination.show();
    });
}

function initCarousel() {
    $('.w-carousel .jcarousel').each(function() {
        var $carousel = $(this);
        var timeout = parseInt($(this).data("timeout")) || 0;
        var autoplay = $(this).data("autoplay");

        $carousel.on('jcarousel:reload jcarousel:create', function() {
            var $carousel = $(this);
            var width = $carousel.innerWidth();
            $carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            setTimeout(setCarouselPaginationVisibility, 0);
        });
        $carousel.jcarousel({
            vertical: false,
            wrap: 'circular'
        }).jcarouselSwipe();

        $carousel.jcarouselAutoscroll({
            target: '+=1',
            interval: timeout
        });
        if (!autoplay) {
            $carousel.jcarouselAutoscroll('stop');
        }
    });

    $('.w-carousel-play').on('click', function() {
        var $carousel = $(this).parent().siblings(".jcarousel")
        var isPressed = $(this).attr("aria-pressed").toLowerCase() == "true" ? true : false;
        var command = isPressed ? "stop" : "start";

        $(this).attr("aria-pressed", (!isPressed).toString().toLowerCase());
        $carousel.jcarouselAutoscroll(command);
    });

    $('.w-carousel .jcarousel-control-prev')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '-=1'
        });

    $('.w-carousel .jcarousel-control-next')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '+=1'
        });

    $('.w-carousel .jcarousel-pagination')
        .on('jcarouselpagination:active', 'a', function() {
            $(this).addClass('active');
        })
        .on('jcarouselpagination:inactive', 'a', function() {
            $(this).removeClass('active');
        })
        .jcarouselPagination({
            // 'perPage': 6, 
            'item': function(page, carouselItems) {
                return '<a href="#' + page + '" aria-label="page ' + page + '"></a>';
            }
        });
}

function moveModalsToEndOfDocument() {
    $('.frontmodal').each(function() {
        $(this).appendTo("body");
    });
}

function setWhiteFeaturePadding() {

    $(".w-white-feature").each(function () {
        var $button = $(this).find(".w-white-tile-button");
        var $content = $(this).find(".w-white-feature-content");
        var buttonHeight = $button.outerHeight();

        $content.css({
            "padding-bottom": buttonHeight + "px"
        })
    });

}

function setHeights() {
    var $elems = $('.w-match-height, .padded-box, .bs-callout, .service-button');
    $elems.attr('style', function(i, style) {
        return style && style.replace(/height[^;]+;?/g, '');
    });
    setTimeout(function() {
        $('.w-match-height').matchHeight();
        $('.bs-callout').matchHeight();
        $('.service-button').matchHeight();
        $('.horfeature-container').matchHeight();
        $('.row .accordionPanel:not(.RTEAccordionPanel) > .accordionPanelHeading').matchHeight();
    }, 1);
}

function setNavigationScrollMaxWidth() {
    var logoWidth = $(".w-header-logo img:visible").outerWidth();
    var styleTag = $("#setNavigationScrollMaxWidth");
    if (0 == styleTag.length) {
        styleTag = $("<style id='setNavigationScrollMaxWidth'></style>");
        $("body").append(styleTag);
    }
    styleTag.html(".w-scroll .w-navigation { max-width: calc(100% - " + (logoWidth + 1) + "px); }");
}

function setDevice() {
    var device = getWindowType();
    $("body").prop("device", device);
    return device;
}

function getPreviousDevice() {
    return $("body").prop("device");
}

function checkDeviceChange() {
    var device = getWindowType();
    var previousDevice = getPreviousDevice();
    if (previousDevice !== device) {
        setDevice();
        deviceChangeTasks(previousDevice, device);
    }
}

function deviceChangeTasks(previousDevice, device) {
    setBodyScrollClass();
}

function initTranslateAriaTimer() {
    var translate = $(".w-translate");
    $(window).translateTimer = setInterval(function() {
        var pressed = translate.attr("aria-pressed") === "true";
        var translateDiv = $(".skiptranslate").not(".goog-te-gadget");
        if (translateDiv.length) {
            var translated = translateDiv.is(":visible");
            if (!pressed && translated) {
                translate.trigger("click");
            }
        }
    }, 500);
}

function stripUniqueAttributes($item) {
    $item
        .removeAttr("id")
        .removeAttr("aria-controls")
        .removeAttr("class")
        .find("*")
        .removeAttr("id")
        .removeAttr("aria-controls")
        .removeAttr("class");
    return $item;
}

function activeTasks() {
    setBackToTopOpacity(1);
}

function setInactiveTimer(that) {
    if (that.inactiveTimer) {
        clearTimeout(that.inactiveTimer);
    }
    that.inactiveTimer = setTimeout(inactiveTasks, 2500);
}

function activityHandler() {
    setInactiveTimer(window);
    activeTasks();
}

function setEventHandlers() {
    $(window).mousemove(function() {
        activityHandler();
    });
    $(window).on('scroll', function() {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(scrollTasks, 100);
        activityHandler();
    });
    $(window).on('resize', function() {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(function() {
            resizeTasks();
            setTopPadding();
        }, 50);
        activityHandler();
    });
    $("header .increase, header .decrease").on('click', function() {
        setTimeout(resizeTasks, 50);
    });
    $(window).trigger('resize');

    // master aria handlers
    $("[aria-pressed]").on('aria:toggle', function() {
        var pressedState = $(this).attr("aria-pressed") == "true";
        var controlIdString = $(this).attr("aria-controls");
        $(this).attr("aria-pressed", !pressedState);
        setAriaHidden(controlIdString, pressedState);
    });
    $("[aria-expanded]").on('aria:toggle', function() {
        var expandedState = $(this).attr("aria-expanded") == "true";
        var controlIdString = $(this).attr("aria-controls");
        $(this).attr("aria-expanded", !expandedState);
        setAriaHidden(controlIdString, expandedState);
    });
    $("[data-toggle-text]").on('aria:toggle toggle', function() {
        var myText = $(this).html();
        var newText = $(this).data("toggle-text");
        $(this).html(newText);
        $(this).data("toggle-text", myText);
    });

    // individual aria handlers
    $(".w-more-button").on("click", function(e) {
        $(".w-mobile-menu-button a").trigger("click");
    });

    $(".w-mobile-menu-button a").on("click", function (e) {
        e.preventDefault();
        $(this).trigger("aria:toggle");
        $("body").toggleClass("w-mobile-menu-open");
        var pressed = $(this).attr("aria-pressed") == "true";
        if (!pressed) {
            $(".w-mobile-scroll-menu-holder i[aria-pressed=true]").trigger("click");
        }
    });
    $(".w-mobile-menu-button a").on("keyup", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this).trigger("aria:toggle");
            $("body").toggleClass("w-mobile-menu-open");
            var pressed = $(this).attr("aria-pressed") == "true";
            if (!pressed) {
                $(".w-mobile-scroll-menu-holder i[aria-pressed=true]").trigger("click");
            }
        }
    });
    $(".w-mobile-scroll-menu-holder i").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).trigger("aria:toggle");
    });
    $(".w-mobile-scroll-menu-holder .w-mobile-scroll-menu-button").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".w-mobile-menu-button a").trigger("click");
    });
    $(document).on("click", ".w-navigation a", function(e) {
        var device = getWindowType();
        if ("mobile" === device) {
            e.preventDefault();
            var index = $(this).closest("li").index();
            var button = $(".w-mobile-scroll-menu-scroll > ul > li")
                .eq(index)
                .children("i")
                .trigger("click");
            $(".w-mobile-menu-button a").trigger("click");
        } else {
            if ($(".has-touch").length && $(this).closest("li").find("ul").length) {
                $(".w-navigation a").not($(this)).prop("clicked", false);
                if (!$(this).prop("clicked")) {
                    e.preventDefault();
                    $(this).prop("clicked", true)
                } else {
                    window.location = $(this).attr("href");
                }
            }
        }
    });
    $(".w-translate").on("click", function(e) {
        e.preventDefault();
        if (!$(".skiptranslate").not(".goog-te-gadget").is(":visible")) {
            $(this).trigger("aria:toggle");
            var pressed = $(this).attr("aria-pressed") == "true";
            $(".w-translate").each(function() {
                $(this).attr("aria-pressed", pressed.toString().toLowerCase());
            });
            setTimeout(function() {
                $(window).trigger("resize");
            }, 600);
        }
    });
    $(".w-search, .w-mobile-search-button a").on("click", function (e) {
        e.preventDefault();
        $(this).trigger("aria:toggle");
        $(".w-search-container input[type=text]").focus();
        $(".w-search-close").attr("aria-pressed", "true");
    });
    $(".w-search, .w-mobile-search-button a").on("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this).trigger("aria:toggle");
            $(".w-search-container input[type=text]").focus();
            $(".w-search-close").attr("aria-pressed", "true");
        }
    });
    $(".w-search-close").on("click", function(e) {
        e.preventDefault();
        $(this).trigger("aria:toggle");
        $(".w-search-container input[type=text]").blur();
        $(".w-search, .w-mobile-search-button a").attr("aria-pressed", "false");
    });
    $(".w-filters-holder-toggle").on("click", function() {
        $(this).parent("h2").toggleClass("w-open");
        $(this).trigger("aria:toggle");
    });
    $(".w-filters-toggle-single").on("click", function(e) {
        e.preventDefault();
        $(this).trigger("aria:toggle");
    });

    $(".w-filters-holder input, .w-search-input").on("change input", function() {
        var filtersApplied = $(".w-filters-holder input:checked").length;
        var termsSearched = $(".w-search-input").val().length;
        if (filtersApplied || termsSearched) {
            $(".w-search-clear").addClass("w-show");
        } else {
            $(".w-search-clear").removeClass("w-show");
        }
    });
    $(".w-search-clear").on("click", function(e) {
        e.preventDefault();
        $(".w-filters-holder input:checked").attr("checked", false);
        $(".w-search-input").val("");
    });
    $(".w-filters-toggle-all").on("click", function(e) {
        e.preventDefault();
        var expanded = $(this).attr("aria-expanded") == "true";

        $(".w-filters-holder-toggle[aria-pressed=" + expanded.toString().toLowerCase() + "]").trigger("click");
        $(".w-filters-toggle-single[aria-pressed=" + expanded.toString().toLowerCase() + "]").trigger("click");
        $(this).attr("aria-expanded", (!expanded).toString().toLowerCase());
        $(this).trigger("toggle");
    });
    $(".side-nav [aria-pressed]").on("click", function () {
        setGalleryHeight();
        $(this).trigger("aria:toggle");
        var i = $(this).children('i');

        if (i.hasClass("sh-icon-thick-arrow-up")) {
            $(i).removeClass("sh-icon-thick-arrow-up");
            $(i).addClass("sh-icon-thick-arrow-down");
        } else {
            $(i).removeClass("sh-icon-thick-arrow-down");
            $(i).addClass("sh-icon-thick-arrow-up");
        }
    });

    // /scroll to top
    setInterval(function() {
        $(window).mousemoved = false;
    }, 2500);
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function() {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    $('#back-to-top').tooltip('show');

    $(".breadcrumbs > ul > li > a > i").on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent("a").parent("li").siblings().removeClass("open");
        $(this).parent("a").parent("li").toggleClass("open");
    });
    $(".breadcrumbs > ul > li > a > i").on('focusout', function (e) {
        $(".breadcrumbs > ul > li").removeClass("open");
    });

    // $('.mega-menu .video-holder').on('mouseenter', function () {
    //     $(this).closest(".mega-menu").addClass('ie-hover');
    // }).on("mouseleave", function () {
    //     $(this).closest(".mega-menu").removeClass('ie-hover');
    // });
    $('#runReject').click(function() {
        $.reject({
            reject: { all: true }
        });
        return false;
    });

    $(".search-btn").click(function() {
        $(".search-container").toggleClass("open");
        if ($(".search-container").hasClass("open")) {
            $(".search-container .search-input").focus();
        }
    });
    $(".search-close").click(function() {
        if ($(".search-container").hasClass("open")) {
            $(".search-container.open").removeClass("open");
        } else {
            $(".search-container").addClass("open");
        }
    });
    $('.search-overlay').click(function() {
        $(".search-container.open").removeClass("open");
    });
    $(".search-submit").click(function() {
        ShowSearchResults($(".search-input").val());
    });
    $(".search-submit-macro").click(function() {
        ShowSearchResults($(".search-input-macro").val());
    });
    $(".search-input").on("keypress", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            ShowSearchResults($(".search-input").val());
        }
    });
    $(".search-input-macro").on("keypress", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            ShowSearchResults($(".search-input-macro").val());
        }
    });
    $("#searchBox").on("keypress", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            ShowSearchResults($("#searchBox").val());
        }
    });

    var typingTimer; //timer identifier
    var doneTypingInterval = 500; //time in ms, .5 second for example

    $('.w-search-input').on("keyup", function() {
        clearTimeout(typingTimer);
        var enabled = $(this).data('enabled');

        if (enabled !== true)
            return null;

        var container = $("#quick-search");
        $(container).hide();

        var loader = $(container).find('.search-loader');

        var ul = $(container).find('ul');
        ul.empty();
        ul.hide();

        if ($(this).val().length >= 4) {
            $(loader).show();
            $(container).show();

            typingTimer = setTimeout(performQuickSearch, doneTypingInterval);
        } else {
            $(loader).hide();
        }
    });
    $('.search-input').on('keydown', function() {
        clearTimeout(typingTimer);
    });
}

function setAriaHidden(controlIdString, hiddenState) {
    var controlIds = controlIdString.split(" ");
    for (var i = 0; i != controlIds.length; ++i) {
        var myControl = $("#" + controlIds[i]);
        if (myControl.length) {
            myControl.attr("aria-hidden", hiddenState);
        }
    }
}

function ariaToggleExclusive(jQContainer, jQThis) {
    $(jQContainer).find("[aria-pressed=true]").not(jQThis).trigger("aria:toggle");
    jQThis.trigger("aria:toggle");
}

function getAutoMargin(jqObj) {
    var negativeMargin = parseInt(jqObj.css("margin-left")) * -1;
    return ($(window).outerWidth() - jqObj.outerWidth() + negativeMargin * 2) / 2;
}

function setFullWidth(jqObj) {
    var negativeMargin = getAutoMargin(jqObj) * -1;
    jqObj.css({
        "margin-left": negativeMargin,
        "margin-right": negativeMargin
    });
}

function pauseCycle() {
    if ($.fn.cycle) {
        $(".w-gallery").attr("data-playing", "false");
        $(".cycle-slideshow").cycle('pause');
    }
}

function playCycle() {
    if ($.fn.cycle) {
        $(".w-gallery").attr("data-playing", "true");
        $(".cycle-slideshow").cycle('resume');
    }
}

function changeCycleSentinel($gallery) {
    var $sentinel = $gallery.children(".cycle-sentinel");
    var $slide = $gallery.find(".cycle-slide-active");
    if ($slide.length && $sentinel.length) {
        $sentinel.html($slide.html());
        $sentinel.attr("class", $slide.attr("class"));
        $sentinel.removeClass("cycle-slide-active");
        $sentinel.addClass("cycle-sentinel");
    }
}

function setCycleEvents() {
    $(".cycle-custom-caption, .cycle-controls").on("click swipeleft swiperight", function(e) {
        e.stopPropagation();
    });
    $(".cycle-play").on("click", function() {
        var userPaused = $(".w-gallery").attr("data-user-paused") == "true";
        $(".w-gallery").attr("data-user-paused", (!userPaused).toString().toLowerCase());
    });
    $(".cycle-slide, .cycle-play").on("click swipeleft swiperight", function(e) {
        e.stopPropagation();
        if ($(".w-gallery").attr("data-playing") == "true") {
            pauseCycle();
        } else {
            playCycle();
        }
    });
    $(".w-gallery").on("cycle-update-view", function(e) {
        changeCycleSentinel($(this));
    });
}

function initCycleBanner() {
    $(".w-gallery").attr("data-playing", "true");
    $(".w-gallery").attr("data-user-paused", "false");
    setFullWidth($(".cycle-wrapper").not(".w-gallery"));
    setCycleEvents();
}

function isAndroidStockBrowser() {
    var rxaosp = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d‌​.]+)/);
    return isaosp = (rxaosp && rxaosp[1] < 537);
}

function setBackToTopOpacity(opacity) {
    $(".bottom-controls a").css("opacity", opacity);
}

function setMegaMenuSubMenuBoxHeight() {
    $('.w-mega').each(function (c, item) { $(item).find(' .w-level-1 > ul > li > a').matchHeight(); });
}

function setMegaMenuMaxHeight() {
    var windowHeight = $(window).height();
    var headerHeight = $(".w-header").outerHeight();
    $(".w-mega .w-level-1").each(function() {
        var maxHeight = windowHeight - headerHeight - 20;
        $(this).css("max-height", maxHeight);
    });
}

function setMegaMenuLayouts() {
    var $megas = $(".w-mega > .w-sub-menu.w-level-1");
    $megas.each(function(i) {
        var $boxes = $(this).children("ul").children("li");
        var boxNumber = $boxes.length;
        if (boxNumber < 5) {
            var firstWidth = $(".w-header-main .container-fluid").width() / 5;
            var newWidth = Math.floor(boxNumber * firstWidth);
            var boxWidth = (100 / boxNumber) + "%";

            $boxes.width(boxWidth);
            $(this).width(newWidth);
            setMegaMenuPosition($(this));
        }
    });
}

function setMegaMenuPosition($mega) {
    var windowWidth = $(window).width();
    var containerWidth = $(".w-header-main .container-fluid").outerWidth();
    var $parent = $mega.siblings("a");
    var parentWidth = $parent.outerWidth();
    var parentLeft = $parent.offset().left;
    var parentCenter = parentLeft + parentWidth / 2;
    var megaWidth = $mega.width();
    // .offset() is relative to window, but positioning of mega will be relative to the container. Generate the offset to take this into account. 
    var offset = (windowWidth - containerWidth) / 2;
    var newRight = containerWidth - parentCenter + offset - megaWidth / 2;
    if (newRight < 20) {
        newRight = 20;
    }
    $mega.css("left", "auto");
    $mega.css("right", newRight + "px");
}

function setStickyFooter() {
    if ($('footer').size() > 0) {
        $('body > .wrapper').css({ 'min-height': "calc(100vh - " + ($('footer').height() + $('header').height()) + "px)" });
    }
}

function setFullWidthHeight() {
    if ($('app-location').size() > 0) {
        if (window.appConfig.height) {
            $('app-location').height(window.appConfig.height);
        }
        else {
            var windowHeight = $(window).height();
            var headerHeight = $("header").outerHeight();

            if ($('.translated-rtl .w-header, .translated-ltr .w-header, .w-header-translate[aria-hidden=false] ~ .w-header').size() > 0) {
                headerHeight += 38;
            }
            if ($('.w-mobile-menu-button-item:visible').size()) {
                $('app-location').height(windowHeight - headerHeight - 60);
            } else {
                $('app-location').height(windowHeight - headerHeight);
            }
        }

        var rSpFw = ($('result .side-panel-wrapper').height() - $('result .side-panel-wrapper .filters-wrapper-top').height());
        if (rSpFw > 1) {
            $('result .side-panel .filters-wrapper').css({
                'max-height': rSpFw + 'px'
            })
        }
        $('side-bar .side-panel .filters-wrapper').css({
            'max-height': ($('side-bar .side-panel-wrapper').height() - 115) + 'px'
        })
        $('.filter-drop-down').css({
            'max-height': ($('app-location').height() - 95) + 'px'
        })
    }
}

function setGalleryHeight() {
    setTimeout(function () {
        var bodyHeight = $(".wrapper").outerHeight();
        $(".w-gallery .cycle-slide").css("max-height", bodyHeight + "px");
    }, 500)
}

function inactiveTasks() {
    setBackToTopOpacity(0.4);
}

function resizeTasks() {
    setBreadcrumbNextLineClass();
    setDynamicImages();
    setMore();
    setWhiteFeaturePadding();
    var device = getWindowType();
    if (device !== "mobile") {
        setHeights();
    }
    setNavigationScrollMaxWidth();
    checkDeviceChange();
    //setTopPadding();
    setMegaMenuLayouts();
    setMegaMenuMaxHeight();
    setMegaMenuSubMenuBoxHeight();
    setLocationsMapHeight();
    setGalleryHeight();
    setStickyFooter();
    setFullWidthHeight();
}

function scrollTasks() {
    setMobileBannerScrolling();
    setBodyScrollClass();
}

function setLocationsMapHeight() {
    var $map = $(".w-locations-page .sonic-container iframe");
    var $footer = $(".w-footer");
    if ($map.length && !$footer.length) {
        var headerHeight = $(".w-header").outerHeight();
        $map.css("height", "calc(100vh - " + headerHeight + "px)");
    }
    $('.show_footer button').click(function () {
        $('.w-locations-page').addClass('show-footer');
        return false;
    })
    $('.hide_footer button').click(function () {
        $('.w-locations-page').removeClass('show-footer');
        return false;
    })
}

function setMobileBannerScrolling() {
    var windowType = getWindowType();
    var userPaused = $(".w-gallery").attr("data-user-paused") == "true";
    if ("mobile" == windowType && !userPaused) {
        var offset = $(window).scrollTop();
        if (0 == offset) {
            playCycle();
        } else {
            pauseCycle();
        }
    }
}

function setBreadcrumbNextLineClass() {
    var breadcrumbs = $(".breadcrumbs > ul > li");
    var breadcrumbWidth = $(".breadcrumbs > ul").width();
    var finalWidth = 0;

    breadcrumbs.each(function(i) {
        var myElement = $(this);
        var myWidth = myElement.outerWidth();

        if (finalWidth + myWidth > breadcrumbWidth) {
            $(this).nextAll().addClass("next-line");
            $(this).addClass("next-line");
            return false;
        } else {
            $(this).removeClass("next-line");
            finalWidth += myWidth;
        }
    });
}

// Function used to put padding on the body behind the header. The padding is allowed to increase in size, but not decrease.
window.maxHeaderSize = 0;

function setTopPadding(override) {
    var headerHeight = $('.w-header-translate').outerHeight() + $(".w-header").outerHeight();
    if (headerHeight > window.maxHeaderSize || $('.w-scroll').size() === 0 || override) {
        window.maxHeaderSize = headerHeight;
        setTimeout(function () {
            $("body").css("padding-top", headerHeight);
            $('.w-header').addClass('loaded');
        }, 50)
    }
}

function setBodyScrollClass() {
    setTimeout(function() {
        var device = getWindowType();
        var isMobile = "mobile" == device;
        var isLocationsPage = $("body").hasClass("w-locations-page");
        var isSticky = isMobile ? $("body").hasClass("w-sticky-header-mobile") : $("body").hasClass("w-sticky-header");

        var addScroll = isSticky && $(window).scrollTop() > 100;
        if (isLocationsPage) {
            addScroll = true;
        }

        if (addScroll) {
            $('body').addClass('w-scroll');
            $('body').removeClass('w-no-scroll');
        } else {
            $('body').addClass('w-no-scroll');
            $('body').removeClass('w-scroll');
        }
        setTimeout(function () {
            setTopPadding();
            setMore();
        }, 300);
    }, 200);
}

app.accessibility_resize = function() {
    var self = {
        currentSize: 3,
        resizeElements: function() {
            var Elements = $();
            $("p,li,div,span,table,h1,h2,h3,h4,a,small,.information-bar-text").each(function() {
                var text = $(this).contents().filter(function() {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                if (text.length) {
                    Elements = Elements.add($(this));
                }
            });
            return Elements;
        },
        changeSize: function(amount) {
            self.currentSize = self.currentSize + amount;
            self.resizeElements().each(function() {
                var $this = $(this);
                var currentFont = parseInt($this.css("font-size"));
                fontsize = currentFont >= 19 ? currentFont : currentFont + 1;
                $this.css("font-size", currentFont + amount);
            });
            $(window).trigger("resize");
            if (self.currentSize === 3 || self.currentSize === '3') {
                window.localStorage.removeItem('accessibility_resize');
            } else {
                window.localStorage.setItem('accessibility_resize', self.currentSize);
            }
        },
        increase: function() {
            if (self.currentSize <= 6) {
                self.changeSize(1);
            }
        },
        decrease: function() {
            if (self.currentSize > 1) {
                self.changeSize(-1);
            }
        }
    };

    var amount = window.localStorage.getItem('accessibility_resize');
    if (amount && amount !== '3') {
        self.changeSize(amount - 3);
    }

    window.increase = self.increase;
    window.decrease = self.decrease;

    return self;
}();

$(document).ready(function () {
    var results = $('div.result'); 
    var term = $('input#searchBox').val();
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            var summaryElm = $(results[i]).find('p');
            var summaryText = $(results[i]).find('p').html();
            summaryText = highlightSearchSummary(term, summaryText);
            summaryElm.html(summaryText);
        }
    }
});

function highlightSearchSummary(term, summary) {
    if (!term || !summary) return summary;

    //trim the white space out
    term = term.trim();

    //split the term by space
    var terms = term.replace(' ', '|');    

    var pattern = new RegExp(terms, 'gi');
    return summary.replace(pattern, replaceMatch);
}

function replaceMatch(match) {
    return '<span class="match">'+match+'</span>';
}

function performQuickSearch() {
    var input = $('.w-search-input');

    var rootId = $(input).data('rootid');
    var authToken = $(input).data('authtoken');

    var container = $(".w-search-results-holder");
    var loader = $(container).find('.w-search-loader');
    var ul = $(container).find('ul.search-results');
    var term = $(input).val();
    var searchResultsPage = $(input).data('searchresultspage');
    $(loader).show();
    $(container).show();

    var quickSearchUrl = '/umbraco/api/search/GetResults?PageId='+rootId+'&Term='+term+'&Page=1&PageSize=5&Type=all&Offset=0&QuickSearch=true';

    $.ajax({
        url: quickSearchUrl,
        async: true,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, jqXHR) {
            if (data !== null) {
                var total = data.TotalItemCount;

                $.each(data.Results, function (i, val) {
                    val.Summary = '<span class="summary">' + highlightSearchSummary(term, val.Summary) + '</span>';
                    var bc = $("<div/>", { addClass: "w-search-results-item-title", role: "heading", html: val.Breadcrumbs });
                    var sm = $("<div/>", { addClass: "w-search-results-item-description", html: val.Summary });
                    var url = val.Url;
                    var tabTarget = val.ExternalResource ? "_blank" : "_self";
                    var a = $("<a/>", { addClass: "w-search-results-item", href: url, target: tabTarget, title: val.Name, html: bc.html() + sm.html() });
                    var li = $("<li/>").append(a);
                    $(ul).append(li);
                });

                $(ul).show();

                var heading = $(container).find(".w-search-results-total");

                var resultString = "result";
                if (total > 1) resultString += "s";

                var totalResult = "<span class=\"w-search-results-number\">" + total + "</span> " + resultString;
                if (total > 4) {
                    totalResult = "View all " + totalResult;
                } else
                    totalResult = "View " + totalResult;
                if (searchResultsPage !== "*") {
                    $(heading).html(totalResult).attr("href", searchResultsPage + "?q=" + encodeURI(term));
                }
            }
            $(loader).hide();
        },
        error: function() {
            $(loader).hide();
            $(container).hide();
        }
    });
}

deleteCookie('dcjq-accordion');
//setCookie('state', $("#sideMenuAccordion").dcAccordion('option', 'active'));
function deleteCookie(name) {
    setCookie(name, "", -1);
}

function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function ShowSearchResults(searchString) {
    $('form').find('input[type=text]').val(searchString);
    $('#bigsearch').submit();
}

function NavigateToTarget(link) {
    var hasChildern = link.parent().hasClass('has-children');
    if (hasChildern) {
        return false;
    } else {
        return true;
    }
}

// new header 
function getWindowType() {
    var windowWidth = $(window).width();
    var type = "mobile";
    if (windowWidth > 1199) {
        // desktop
        var type = "desktop";
    } else if (windowWidth > 991) {
        // tablet landscape
        var type = "tablet-landscape";
    } else if (windowWidth > 767) {
        // tablet portrait
        var type = "tablet-portrait";
    }
    return type;
}

function setImage($element, src) {
    if ($element.attr("src") != null) {
        $element.attr("src", src);
    } else {
        $element.css("background-image", "url('" + src + "')");
    }
}

function setDynamicImages() {
    var windowType = getWindowType();
    $(".w-dynamic-image").each(function() {
        var src = $(this).attr("data-" + windowType + "-src");
        if (src != null) {
            setImage($(this), src);
        }
    });
}

function setMore() {
    var $navigation = $(".w-navigation:visible");
    var $navigationItems = $('.w-navigation > ul > li');
    var $more = $navigation.children(".w-more");
    var moreWidth = $more.outerWidth(true);
    var spaceAvailable = $navigation.width() - 30;
    var $firstWrappingItem = getFirstWrappingItem(spaceAvailable - moreWidth, $navigationItems);
    var $firstWrappingItem2 = getFirstWrappingItem(spaceAvailable, $navigationItems);

    // if the last item can replace the more button
    if ($firstWrappingItem.index() != 0 && $firstWrappingItem2.index() == 0) {
        $firstWrappingItem = $firstWrappingItem2;
    }
    setItemVisibility($navigationItems, $firstWrappingItem.index());
    setMoreVisibility($more);
}

function setMoreVisibility($more) {
    if ($('.w-navigation > ul > li.w-hide').length > 0) {
        $more.addClass("w-show");
    } else {
        $more.removeClass("w-show");
    }
}

function setItemVisibility($hideItems, index) {
    $hideItems.removeClass("w-hide");
    if (index > 0) {
        $('.w-navigation > ul > li:eq(' + (index - 1) + ')').addClass("w-last");
        $('.w-navigation > ul > li:gt(' + (index - 1) + ')').addClass("w-hide");
    } else {
        $('.w-navigation > ul > li:last-child').addClass("w-last");
    }
}

function getFirstWrappingItem(width, $items) {
    var total = 0;
    var $item = $items.first();
    $items.each(function(i) {
        total += $(this).outerWidth(true);
        if (total > width) {
            $item = $(this);
            return false;
        }
    });
    return $item;
}

function setBackToTopPosition() {
    var $cc = $(".cookie-consent").not(".accepted");
    var $btt = $('#back-to-top');
    if ($cc.length) {
        var top = $cc.outerHeight();
        $btt.css("bottom", (top + 20) + "px");
    } else {
        var bttStyle = $btt.attr("style") || "";
        var hasDisplay = bttStyle != null;
        var isVisible = -1 != bttStyle.indexOf("display");
        var styleTag = isVisible ? "display: block" : "";
        $btt.attr("style", styleTag);
        $(window).trigger("scroll");
    }
}
$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}
$(document).ready(function() {
    if (isAndroidStockBrowser()) {
        $.reject({
            reject: { all: true, closeCookie: true }
        });
    } else {
        $.reject({
            closeCookie: true
        });
    }
    $('#runReject').click(function() {
        $.reject({
            reject: { all: true }
        });
        return false;
    });
    $(".cookie-consent button.btn-cookies").click(function(e) {
        var container = $(".cookie-consent");
        container.addClass("accepted");
        if ($(".cookie-consent button.btn-cookies")[0] != null) {
            if ($(".cookie-consent button.btn-cookies")[0].id == "acknowledgeCookies") {
                acknowledge = true;
            } else {
                acknowledge = false;
            }
            setTimeout(setBackToTopPosition, 1);
            $.ajax({
                url: '/umbraco/Surface/CookieConsentSurface/Accept',
                async: true,
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: '{"acknowledge":"' + acknowledge + '"}'
            });
        }
    });

    var searchQuery = $.urlParam('q');
    if (searchQuery != undefined) {
        var page = $('.accordionPanel div:contains("' + searchQuery + '")');
        page.addClass("in");
    }

});

$(document).ready(function() {
    $('.btn-dismiss-cookies').click(function () {
        setCookie('dismiss-cookies', '1', 1);
        $('.cookie-consent').hide();
    });
    if (getCookie('dismiss-cookies') === '1') {
        $('.cookie-consent').hide();
    } else {
        $('.cookie-consent').show();
    }
});

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();

    $('.accordionPanel').on('shown.bs.collapse', function() {
        setStickyFooter();
    });

    $('.accordionPanel').on('hidden.bs.collapse', function() {
        setStickyFooter();
    });
});

$(document).ready(function() {
    $('ul.letters li').click(function() {
        $('ul.letters li:first-child button').removeClass('btn-primary');
    });

    $('ul.letters li:first-child').click(function() {
        $('ul.letters li button').removeClass('btn-primary');
        $('ul.letters li:first-child button').addClass('btn-primary');
    });

});

function bioFeedTableSearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("biofeed-table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    setStickyFooter();
}

$(function () {
    var showExternalLinks = $('.show-external-links').size() > 0;
    $('a[href]').each(function () {
        var a = new RegExp('/' + window.location.host + '/');
        var b = new RegExp('http');
        if (!a.test(this.attributes.href.value) && b.test(this.attributes.href.value)) {
            if (showExternalLinks) {
                $(this).append($('<span class="external-icon"><i class="sh-icon sh-icon-expand-6" aria-label="External Link"></i></span>'));
                this.title = 'External Link: ' + this.attributes.href.value;
            }
            this.target = '_blank';
            this.rel = 'noopener';
        }
    });
});
/*
 * TODO: This is the start of keyboard navigation on header
$(function () {
    $('.w-navigation > ul > li > a').keydown(function (e) {
        if (e.keyCode === 40) {
            $(this).parent().addClass('active');
            $(this).parent().find('.w-sub-menu a:eq(0)').focus();
            e.stopPropagation();
            return false;
        } else if (e.keyCode === 38) {
            $(this).parent().removeClass('active');
            e.stopPropagation();
            return false;
        }
    });
    $('.w-sub-menu > ul > li > a').keydown(function (e) {
        if (e.keyCode === 40) {
            $(this).parent().next().find('a').focus();
            e.stopPropagation();
            return false;
        } else if (e.keyCode === 38) {
            $(this).parent().prev().find('a').focus();
            e.stopPropagation();
            return false;
        }
    });
});
*/

$(function () {
    $('.counter').each(function () {

        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
});

$(function () {
    if ($('.share-this-page').size() > 0) {
        $('.bc-icon.share').click(function () {
            $('.share-this-page').toggle();
        });
        var validateEmail = function (email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return true;
            }
            return false;
        };
        var updateForm = function () {
            $('.share-this-page button').removeAttr('disabled');
            if ($('#share_recipient_name').val() === '' ||
                $('#share_recipient_email').val() === '' ||
                !validateEmail($('#share_recipient_email').val()) ||
                $('#share_message').val() === '' ||
                $('#share_sender_name').val() === '' ||
                $('#share_sender_email').val() === '' ||
                !validateEmail($('#share_sender_email').val())) {
                $('.share-this-page button').attr('disabled', 'disabled');
            } 
        };
        $('.share-this-page input[type=text], .share-this-page textarea').keyup(function () {
            updateForm();
        });

        $('.share-this-page input[type=text], .share-this-page textarea').blur(function () {
            if (!$(this).val() || $(this).val() === '' || ['share_recipient_email', 'share_sender_email'].indexOf($(this).attr('id')) > -1 && !validateEmail($(this).val())) {
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
            updateForm();
        });

        $('.share-this-page input[type=checkbox]').change(function () {
            updateForm();
        });
        updateForm();
        $('.share-this-page form').submit(function () {
            $('.share-this-page button').attr('disabled', 'disabled');
            $.post('/umbraco/Surface/ShareThisPage/VerifyRecaptcha', $(this).serialize()).then(function (response) {
                if (response.result === true) {
                    $('.share-this-page').html('<h4>Thank You</h4><p>Your email has been sent.</p>');
                }
                else {
                    $('.share-this-page .error').text('There was an error sending your email.');
                    $('.share-this-page button').removeAttr('disabled');
                }
            },
            function () {
                $('.share-this-page .error').text('There was an error sending your email.');
                $('.share-this-page button').removeAttr('disabled');
            });
            return false;
        });
    }
});

window.tracking = {
    pageView: function (url) {
        var baseUrl = '';
        if ($('base').size()) {
            baseUrl = $('base').attr('href').replace(window.location.origin, '');
        } else {
            baseUrl = '/';
        }
        if (typeof (ga) === 'function') {
            ga('send', 'pageview', baseUrl + url);
        } else {
            //console.log('send', 'pageview', baseUrl + url);
        }
    },
    pageEvent: function (eventCategory, eventAction, eventLabel, eventValue, fieldsObject) {
        if (typeof (ga) === 'function') {
            ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);
        } else {
            //console.log('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);
        }
    }
}

// Scroll container for DocHub horizontal scrolling tables
// <<< START >>>

var ScrollController = (function ScrollController(scrollingElement) {
    
    var ongoingScroll = null;

    function scroll(direction) {
        if (!ongoingScroll) {
            return;
        }
        var totalScroll = 40;
        var totalInterval = 150;
        var scrollIntervals = 20;
        var scrollAmount = totalScroll / scrollIntervals;
        var tickTime = totalInterval / scrollIntervals;

        for (var i = 0; i < scrollIntervals; i++) {
            setTimeout(function() {
                var left = scrollingElement.scrollLeft;
                scrollingElement.scrollLeft = direction === 'left' 
                    ? left - scrollAmount 
                    : left + scrollAmount;
            }, tickTime * i);
        };
        
        setTimeout(function() {
            scroll(direction);
        }, totalInterval);
    }

    function startScroll(direction) {
       ongoingScroll = true;
       scroll(direction);
    }

    function stopScroll() {
        ongoingScroll = false;
    }

    function bind(element, direction) {
        element.addEventListener('mousedown', function(event) {
            event.stopPropagation();
            event.preventDefault();
            startScroll(direction);
        });
        element.addEventListener('touchstart', function(event) {
            event.stopPropagation();
            event.preventDefault();
            startScroll(direction);
        });
        element.addEventListener('mouseup', function(event) {
            event.stopPropagation();
            event.preventDefault();
            stopScroll();
        });
        element.addEventListener('touchend', function(event) {
            event.stopPropagation();
            event.preventDefault();
            stopScroll();
        });
    }

    return {
        scrollingElement: scrollingElement,
        bindLeft: function(element) { bind(element, 'left'); },
        bindRight: function(element) { bind(element, 'right'); },
        scrollLeft: function() { scroll('left'); },
        scrollRight: function() {scroll('right'); }
    };
});


function createMoreArrows(elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var parent = element.parentNode;
        var container = buildContainer(element);
        var left = buildLeftArrow(container);
        var right = buildRightArrow(container);
        parent.insertBefore(left, container);
        parent.insertBefore(right, container);

        // Setup events
        container.addEventListener('scroll', function(event) {
            updateArrowVisibility(left, right, container);
        });
        window.addEventListener('resize', function(event) {
            updateArrowVisibility(left, right, container);
        });

        //Set initial state
        updateArrowVisibility(left, right, container);
        var controller = new ScrollController(container);
        controller.bindLeft(left);
        controller.bindRight(right);
    }
}

function buildContainer(scrollingElement) {
    var container = document.createElement('div');
    container.className = 'scroll-container';
    scrollingElement.parentNode.insertBefore(container, scrollingElement);
    container.appendChild(scrollingElement);
    return container;
}

function buildLeftArrow(scrollingElement) {
    var left = document.createElement('a');
    left.innerText = '‹ More';
    left.className = 'more-arrow left'
    return left;
}

function buildRightArrow(scrollingElement) {
    var right = document.createElement('a');
    right.innerText = 'More ›';
    right.className = 'more-arrow right';
    return right;
}

function updateArrowVisibility(left, right, scrollingElement) {
        // Left 
        if (scrollingElement.scrollLeft > 0) {
            left.className = 'more-arrow left show';
        } else {
            left.className = 'more-arrow left';
        }

        //Right
        var position = scrollingElement.clientWidth + scrollingElement.scrollLeft; 
        if (scrollingElement.clientWidth == 0 || position >= scrollingElement.scrollWidth - 5) {
            right.className = 'more-arrow right'
        } else {
            right.className = 'more-arrow right show';
        }
}

document.addEventListener('DOMContentLoaded', function(event) {
    var tables = document.getElementsByTagName('table');
    createMoreArrows(tables);
    var formulas = document.querySelectorAll('.formula .math-tex');
    createMoreArrows(formulas);
});

// <<< END >>>

$(function () {
    if ($('.site-notification').length > 0) {
        var content = $('.site-notification .container');
        var hide = $("<a href='#'><i class='sh-icon-thick-arrow-up' role='button' aria-label='Hide Notifications' tabindex='0'></i></a>");
        var show = $("<a href='#'><i class='sh-icon-thick-arrow-down' role='button' aria-label='Show Notifications' tabindex='0'></i></a>");
        show.hide();
        hide.click(function () {
            doHide();
            window.localStorage.setItem('site-notification-hide', '1');
        });
        show.click(function () {
            doShow();
            window.localStorage.setItem('site-notification-hide', '0');
        });
        var doShow = function () {
            //content.css({ 'height': 'initial', 'overflow': 'visible' });
            content.removeClass('hide-site-notification');
            hide.show();
            show.hide();
            setTopPadding();
            resizeTasks();
        }
        var doHide = function () {
            //content.css({ 'height': 25, 'overflow': 'hidden' });
            content.addClass('hide-site-notification');
            hide.hide();
            show.show();
            setTopPadding();
            resizeTasks();
        }
        var hideShow = $('<div class="container text-right visible-xs" style="padding-right: 21px; font-size: 22px;"></div>');
        hideShow.append(hide);
        hideShow.append(show);
        $('.site-notification').append(hideShow);
        $('.site-notification').append($('<style> @media (max-width: 767px) { .hide-site-notification { height: 25px; overflow: hidden } } </style>'))
        var snh = window.localStorage.getItem('site-notification-hide');
        if (snh === '1') {
            doHide();
        }
    }
})