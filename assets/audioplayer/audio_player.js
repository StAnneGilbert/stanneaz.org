/* Created by Adam Randlett
   @adamrandlett
   No unauthorized usage of this script please!
*/
var AUDIO_PLAYER = function(elmobj, callback){
  this.ui_unibody = document.createElement('ul');
  //this.ui_unibody_parts = "<li><div class='play-btn'><i class='icon-play ap__play'></i><i class='icon-pause ap__pause' style='display:none;'></i></div></li><li><div class='sep for-play'></div></li><li><div class='time-current'>00:00</div></li><li><div class='sep for-time'></div></li><li class='container' ><div class='progress-bar-container'><div class='progress-bar-wrapper'><div class='seek-bar' ></div><div class='play-bar transition' ></div><div class='load-bar transition'></div></div></div></li><li><div class='sep for-duration'></div></li><li><div class='time-duration'>00:00</div></li><li><div class='sep for-volume'></div></li><li><div class='volume-btn'><i class='icon-volume'></i></div></li><li style='display:none;'><div class='volume-bar-container'><div class='volume-bar'></div></div></li>";
  this.ui_unibody_parts = "<li><div class='play-btn'><i class='icon-play ap__play'></i><i class='icon-pause ap__pause' style='display:none;'></i></div></li><li><div class='sep for-play'></div></li><li><div class='time-current'> 00:00 </div><div class='time-duration'> 00:00 </div></li><li class='container' ><div class='progress-bar-container'><div class='progress-bar-wrapper'><div class='seek-bar' ></div><div class='play-bar transition' ></div><div class='load-bar transition'></div></div></div></li><li class='ap__close'><i class='icon-resize-shrink'></i></li>";
  this.audio_object;
  this._touch = false;
  this.ctr = {
    play: '',
    pause: '',
    progressBar: '',
    loadBar: '',
    scrub: '',
    track: '',
    volumeBtn: '',
    cTimeRef: ''
  };

  this.init = function(audio_obj_ref){
    console.log("AUDIO_PLAYER INITIATED -- ");
    this.audio_object = audio_obj_ref;
    this.stripAudioElement( this.audio_object );
    this.touchDetect();

    this.addControls();
    this.audio_object.pause();
  };

  this.touchDetect = function(){
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
    if(isTouch){
      this._touch = true;
    }else{
      this._touch = false;
    }
  };


  /* Add custom controls to the DOM next to audio_object */
  this.addControls = function(){
    this.ui_unibody.setAttribute("class","AudioPlayer AudioPlayer-unibody");
    this.ui_unibody.style.display = 'none';
    this.ui_unibody.innerHTML = this.ui_unibody_parts;
    this.insertAfter(this.audio_object, this.ui_unibody);
    // Connect Control Elements
    this.ctr.playpause =    this.ui_unibody.querySelector('.play-btn');
    this.ctr.play =         this.ui_unibody.querySelector('.ap__play');
    this.ctr.pause =        this.ui_unibody.querySelector('.ap__pause');
    this.ctr.progressBar =  this.ui_unibody.querySelector('.play-bar');
    this.ctr.scrub =        this.ui_unibody.querySelector('.seek-bar');
    this.ctr.loadBar =      this.ui_unibody.querySelector('.load-bar');
    this.ctr.track =        this.ui_unibody.querySelector('.progress-bar-wrapper');
    //this.crt.volumeBtn =    this.ui_unibody.querySelector('.volume-btn');
    this.ctr.cTimeRef =     this.ui_unibody.querySelector('.time-current');
    this.ctr.dTimeRef =     this.ui_unibody.querySelector('.time-duration');

    this.ctr.progressBar.style.width = 0+'%';
    this.ctr.loadBar.style.width = 0+'%';

    this.setEvents();

    callback(this.ui_unibody);
  };

  this.setEvents = function(){
    this.audio_object.addEventListener('play', this.extraEventData(this.uiSetPause,this.ctr.play, this.ctr.pause), false);
    this.audio_object.addEventListener('pause', this.extraEventData(this.uiSetPlay,this.ctr.play, this.ctr.pause), false);
    this.audio_object.addEventListener('ended', this.extraEventData(this.uiSetEnd,this.ctr.play, this.ctr.pause, this.ctr.progressBar), false);


    this.ctr.playpause.addEventListener('click', this.extraEventData(this.togglePlay, this.audio_object), false);
    this.ctr.scrub.addEventListener('click', this.extraEventData(this.setPlayProgress,this.ctr.track,this.ctr.progressBar,this.audio_object), false);
    this.ctr.scrub.addEventListener('mousedown', this.extraEventData(this.setPlayProgress,this.ctr.track,this.ctr.progressBar,this.audio_object), false);

    this.audio_object.addEventListener('progress', this.extraEventData(this.updateLoadState, this.ctr.loadBar), false);
    this.audio_object.addEventListener('timeupdate', this.extraEventData(this.updateProgress, this.ctr.progressBar, this.setProgressTime, this.ctr.cTimeRef,this.ctr.dTimeRef), false);

    if(this._touch){

      //this.ctr.play.addEventListener('touchend', this.extraEventData(this.togglePlay, this.audio_object), false);

      //this.ctr.scrub.addEventListener('touchstart',this.extraEventData(this.setPlayProgress,this.ctr.track,this.ctr.progressBar,this.audio_object),false);
      //this.ctr.scrub.addEventListener('touchmove',this.extraEventData(this.setPlayProgress,this.ctr.track,this.ctr.progressBar,this.audio_object),false);
      //this.ctr.scrub.addEventListener('touchend',this.extraEventData(this.setPlayProgress,this.ctr.track,this.ctr.progressBar,this.audio_object),false);
    }
  }

  this.togglePlay = function(e,audioObj){
    //console.log(e);
    if(audioObj.paused || audioObj.ended){
      if(audioObj.ended){
        audioObj.currentTime = 0;
      }
      audioObj.play();
    }else{
      audioObj.pause();
    }
  }

  this.uiSetPause = function(e,playBtn, pauseBtn){
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
  }

  this.uiSetPlay = function(e,playBtn, pauseBtn){
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  }

  this.uiSetEnd = function(e,playBtn, pauseBtn, pb){
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  }

  this.updateLoadState = function(e,lb){
    var maxLoaded = 0.0,
        audioObj = e.target;
    if(audioObj.buffered.length > 0){
        maxLoaded = audioObj.buffered.end(audioObj.buffered.length - 1);
    }
    var percentLoaded = maxLoaded / audioObj.duration;
    lb.style.width = percentLoaded * 100 + "%";
  }

  this.updateProgress = function(e,pb,pt,cTimeRef,dTimeRef){
    var audioObj = e.target,
        length = audioObj.duration,
        secs = audioObj.currentTime,
        played = (secs / length) * 100,
        timeLeft = formatTime(length - secs);
        currentTime = formatTime(secs)

    pb.style.width = played + "%";
    cTimeRef.innerHTML = currentTime;
    dTimeRef.innerHTML = timeLeft;

  }

  function formatTime(seconds){
    seconds = Math.round(seconds);
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }


  this.setPlayProgress = function(e,tr,pb,audioObj){

    var findPosX = function(obj) {
      var curleft = obj.offsetLeft;
      while(obj = obj.offsetParent) {
        curleft += obj.offsetLeft;
      }
      return curleft;
    }

     var xpos = e.pageX,
         newPercent = Math.max(0, Math.min(1, (xpos - findPosX(tr)) / tr.offsetWidth));
     audioObj.currentTime = newPercent * audioObj.duration;
     pb.style.width = newPercent * (tr.offsetWidth -2) + "px";


  }

  this.insertAfter = function(refElement, newElement){
    refElement.parentNode.insertBefore(newElement, refElement.nextSibling);
  };

  this.extraEventData = function(orig){
    var args = [].slice.call( arguments, 1);
    return function(){
      return orig.apply( this, [].slice.call( arguments ).concat(args));
    }
  }

  /* This hides <audio> element from view. */
  this.stripAudioElement = function(elm){
    elm.removeAttribute("controls");
    elm.style.display = 'none';
  };

  this.init(elmobj);
  // jQuery, MVMT, window, document, undefined
};