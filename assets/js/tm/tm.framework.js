// JSLint settings:
/*global
  clearTimeout,
  console,
  jQuery,
  setTimeout
*/

var TMF = (function ($, tm, window, document, undefined) {
    
    "use strict";

    tm.Helpers      = {};
    tm.Tabs         = {};
    tm.ScrollTo     = {};
    tm.Slider       = {};
    tm.Nav          = {};
    tm.Video        = {};
    tm.Audio        = {};
    tm.touch      = false;
    tm.vidPlaying = false;
    tm.Filter = {};
    tm.cssProps = {};
    tm.Cookie = {};
    tm.Swipe = {};
    tm.Swipe.sliders = [];


    var lastScrollY,
        lastWinWidth,
        ticking,
        asideTop = null,
        submenuTop = null,
        sliderReload = null;





    /* --------------------------------------------- *\
        tm VARIABLES.
    \*  --------------------------------------------- */

    var elements = [],
      html = $("html");

    // If you use console when IE doesn't have the "F12"
    // tools open, throws a "console not defined" error.
    tm.log = function () {
      // Safely log things, if need be.
      if (console && typeof console.log === 'function') {
        var i,
          ii;
        for (i = 0, ii = arguments.length; i < ii; i++) {
          console.log(arguments[i]);
        }
      }
    };





    /* --------------------------------------------- *\
        Config.
    \*  --------------------------------------------- */

    // tm.config = {
    //   urls: {
    //   }
    // };





    /* --------------------------------------------- *\
        Initialize Function.
    \*  --------------------------------------------- */

    tm.init = function () {
      //tm.log('TM.INIT --');

      tm.touchDetect();
      tm.menu();
      tm.searchInput();

      elements.push(
        {
          el: '#featured-content-slider',
          fn: tm.Slider.init
        },
        {
          el: '[data-video]',
          fn: tm.Video.init
        },
        {
          el: '[data-embedcode]',
          fn: tm.embededVideo
        },
        {
          el: '[data-audio]',
          fn: tm.Audio.init
        },
        {
          el: 'form.general',
          fn: tm.formAction
        },
        {
          el: '.section-navigation',
          fn: tm.sticky
        }
      );

      tm.cssProps.transform = tm.Helpers.getsupportedProp(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);

      tm.runIf(elements);

      if ($(".standard-container").length > 0) {
          $(".standard-container").fitVids();
          //{ customSelector: "iframe[src^='http://worshipmedia.tv']"}
      };
      
    };






    /* --------------------------------------------- *\
        If element is in DOM run associated function.
    \*  --------------------------------------------- */

    tm.runIf = function (elms) {

      //tm.log("TM.RUNIF --");
      var fn, el, pr, i, ii;

      for (i = 0, ii = elms.length; i < ii; i++) {
        fn = elms[i].fn;
        el = $(elms[i].el);
        pr = elms[i].pr;

        if (el.length) {
          fn(el,pr);
        }
      }

    };





    tm.touchDetect = function () {
      var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
      if(isTouch){
        tm.touch = true;
        window.addEventListener('load', function(){ FastClick.attach(document.body); }, false);
        $('html').addClass('touch');
      }else{
        tm.touch = false;
        $('html').addClass('no-touch');
      }
    };

    tm.isTouch = function () {
      return tm.touch;
    };


    
    tm.sticky = function(elm){
      var el = $(elm);
      if(tm.isTouch() === false){
        el.fixedsticky();
      }
    };



    /* --------------------------------------------- *\
        Menu Toggle
    \*  -------------------------------------------- */

    tm.menu = function () {
       $(document).on('click', '[data-toggle="mobile-menu"]', function(e){
        $('body').toggleClass('mobile-nav-visible');
      });
      $(document).on('click touchup', '.mobile-nav-visible .nav-slide-element', function(e){
        $('body').removeClass('mobile-nav-visible');
      });
    };


    tm.searchInput = function (elm) {
      var el = $(elm);
      $(document).on('click', '.search-open', function(e){
        e.preventDefault();

        var $link = $(this);

        // add class to the menu to dim everything else and show the search form
        $link.closest('.site-menu').addClass('visible-search');
        // wait .4s seconds until the animation finishes then focus the search inupt
        setTimeout(function(){ $link.next('form').find('input[type="text"]').focus() }, 400);
        // bind click event to everything except the search form
        $('html').one('click', function(){
          $link.closest('.site-menu').removeClass('visible-search');
          $('.search-form').unbind('click');
        });
        $('.search-form').on('click', function(e){
          e.stopPropagation();
        });
      });
    };


    /* --------------------------------------------- *\
        VIDEO
    \* --------------------------------------------- */

    tm.Video.init = function (elm) {
      var el = $(elm);
          
      $('body').on('click','[data-video]',function () {

          if($(this).data('video') === ""){
            if ($(this).data('embed') === "") {
              tm.Video.modalEmbed($(this));
              
            }else{
              tm.Video.modal($(this));
            }
          }else{
            tm.Video.embed($(this));
          }
      });

    };

    tm.Video.modal = function(elm){
        var el = elm,
            id = el.data('id'),
            title = el.data('title');

      var params = tm.Helpers.parseURL(window.location);
      window.open( "http://" + params.host + "/video/"+ id, "Video Player - " + title, "width=778,height=437","location=no","status=no");
    };

    tm.Video.modalEmbed = function(elm){
      var el = elm,
            id = el.data('embed'),
            title = el.data('title');

      var params = tm.Helpers.parseURL(window.location);
      window.open( "http://" + params.host + "/video/"+ id +"?q=embed", "Video Player - " + title, "width=778,height=437","location=no","status=no");       
    };


    tm.Video.embed = function(elm){

      var el = elm,         
          controls = $('.video-actions'),
          image = $('.video-placeholder').find("img"),
          videoHolder = $('.video-placeholder');

      
          var videoEmbed = $("#video-embed").html(),
              timecode = 0;

          videoHolder.html(videoEmbed);

          videoHolder.fitVids();

          var player = videoHolder.find('iframe');
          timecode = player.data('time');
          // var params = tm.Helpers.parseURL(player.attr('src'));
          // tm.log(params);
          var url = window.location.protocol + player.attr('src').split('?')[0];

          if (window.addEventListener) {
            window.addEventListener('message', onMessageReceived, false);
          } else {
            window.attachEvent('onmessage', onMessageReceived, false);
          }

          function onMessageReceived(e) {
              var data = JSON.parse(e.data);
              
              switch (data.event) {
                  case 'ready':
                      onReady();
                      break;
              }
          }

          function onReady(){
            if(timecode != ""){
              post('seekTo',timecode);
            }
          }

          function post(action, value) {
              var data = {
                method: action
              };
              
              if (value) {
                  data.value = value;
              }
              
              var message = JSON.stringify(data);
              player[0].contentWindow.postMessage(data, url);
          }
        
    };







    /* --------------------------------------------- *\
        AUDIO
    \* --------------------------------------------- */

    tm.Audio.init = function(elm){
      var el = $(elm);
      $('body').on('click','[data-audio]',function(e){
        e.preventDefault();
        var id = el.data('id'),
            title = el.data('title');
        tm.Audio.win(id,title);
      });
      
    };

    tm.Audio.win = function(id,title){
      var params = tm.Helpers.parseURL(window.location);
      if (params.segments[0] === "es") {
        window.open( "http://" + params.host + "/es/audio/"+ id, "Audio Player - " + title, "width=650,height=430","location=no","status=no");
      }else{
        window.open( "http://" + params.host + "/audio/"+ id, "Audio Player - " + title, "width=650,height=430","location=no","status=no");
      };
    };


    tm.formAction = function(elm){
      var timeout;
      $(elm).submit(function(ev) {
          // Prevent the form from actually submitting
          ev.preventDefault();

          var form = $(elm),
              btn = form.find('button'),
              btnTxt = btn.find('.button__text');

          if(form.find(".error").length > 0){
            form.find(".error").remove();
          }
          
          btn.attr('disabled','disabled');
          btnTxt.html('Sending').after("<span class='spinner'><i class='fa fa-spinner'></i></span>");

          // Get the post data
          var data = $(this).serialize();

          // Send it to the server
          $.post('/', data, function(response) {
              if (response.success) {
                  btn.removeAttr('disabled');
                  btn.removeClass('btn-light-blue');
                  btn.addClass('btn-light-grey');
                  btnTxt.html('Message Sent!');
                  btn.find('.spinner').remove();

                  timeout = setTimeout(function(){
                    var inputs = form.find('input[type=text]');
                    btn.find('.button__text').html("Send Now");
                    btn.find('.spinner').remove();
                    btn.removeAttr('disabled');
                    btn.removeClass('btn-light-grey');
                    btn.addClass('btn-light-blue');

                    inputs.each(function(){
                      $(this).val("");
                    });

                    form.find('textarea').val("");
                    form.find('input[type=text]').val("");
                    
                    window.clearTimeout(timeout);

                  },3000);
                  
              } else {
                  // response.error will be an object containing any validation errors that occurred, indexed by field name
                  // e.g. response.error.fromName => ['From Name is required']

                  btn.removeAttr('disabled');
                  btn.addClass('gui--action');
                  btnTxt.html('Resend');
                  btn.find('.spinner').remove();
                  if(response.error.fromName){
                    $("input[name=fromName]").after("<span class='error'>First & Last Name is required</span>");
                  }
                  if(response.error.fromEmail){
                    $("input[name=fromEmail]").after("<span class='error'>Email Address is required</span>");
                  }
                  if(response.error.message){
                    $("textarea[id=message]").after("<span class='error'>Please write a message!</span>");
                  }
                  //alert('An error occurred. Please try again.');
              }
          });
      });
    };


    // tm.Slider.init = function (elm) {
    //   var el = $(elm),
    //     $dragdealer = el;

    //   el.owlCarousel({
    //     itemsCustom: [
    //       [1200,3],
    //       [992,3],
    //       [768,2],
    //       [580,2],
    //       [0, 1]
    //     ],
    //     slideSpeed: 700,
    //     easing: $.bez([0.215, 0.61, 0.355, 1]), // custom cubic bezier easing string
    //     scrollPerPage: true, // scroll all visible items at once vs. one item per advance
    //     addClassActive: true, // add active class to each visible slide to set opacity/visibility
    //     pagination: true, // add pagination dots
    //     rewindNav: false // prevent slider from rewinding (not looping) back to beginning
    //   });

    //   var owl = el.data('owlCarousel');

    //   // prev/next buttons
    //   $(document).on('click', '.carousel-nav', function (e) {
    //     e.preventDefault();

    //     if($(this).attr('data-direction') == 'prev') {
    //       owl.prev();
    //     } else if($(this).attr('data-direction') == 'next') {
    //       owl.next();
    //     }
    //   });

    // };
    // 
    
    tm.Slider.init = function(){
      $(document).ready(function(){
        $('.bxslider').bxSlider({
          video: true,
          useCSS: false,
          auto: true,
          pause: 8000
        });
        $('#slider3').bxSlider({
          minSlides: 2,
          maxSlides: 7,
          slideWidth: 125,
          slideMargin: 10
        });
      });
    };

    /* --------------------------------------------- *\
        HELPERS.
    \*  --------------------------------------------- */

    tm.Helpers.getsupportedProp = function (proparray) {
      var root=document.documentElement; //reference root element of document
      for (var i=0; i<proparray.length; i++){ //loop through possible properties
          if (typeof root.style[proparray[i]] === "string"){ //if the property value is a string (versus undefined)
              return proparray[i]; //return that string
          }
      }
    };

    tm.Helpers.parseURL = function(url) {
         var a =  document.createElement('a');
         a.href = url;
         return {
             source: url,
             protocol: a.protocol.replace(':',''),
             host: a.hostname,
             port: a.port,
             query: a.search,
             params: (function(){
                 var ret = {},
                     seg = a.search.replace(/^\?/,'').split('&'),
                     len = seg.length, i = 0, s;
                 for (;i<len;i++) {
                     if (!seg[i]) { continue; }
                     s = seg[i].split('=');
                     ret[s[0]] = s[1];
                 }
                 return ret;
             })(),
             file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
             hash: a.hash.replace('#',''),
             path: a.pathname.replace(/^([^\/])/,'/$1'),
             relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [,''])[1],
             segments: a.pathname.replace(/^\//,'').split('/')
         };
      }

    tm.Helpers.isEmpty = function(value){
        return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
    };




    /* --------------------------------------------- *\
        Cookies.
    \*  --------------------------------------------- */

    tm.Cookie.setCookie = function ( name, value, days ) {
      var seconds = days * 86400;
      if (typeof(seconds) != 'undefined') {
        var date = new Date();
        date.setTime(date.getTime() + (seconds*1000));
        var expires = "; expires=" + date.toGMTString();
      }
      else {
        var expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
    };

     tm.Cookie.getCookie = function ( name ) {
      name = name + "=";
      var carray = document.cookie.split(';');

      for(var i=0;i < carray.length;i++) {
        var c = carray[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return null;
    };



    //tm.log("TM --");
    tm.init();
    return tm;

// jQuery, TM, window, document, undefined
}(jQuery, TMF || {}, this, this.document));