var correctImg = '<div class="showAnswerTickMark showAns"><img src="assets/images/tikMark.png" /></div>';
var incorrectImg= '<div class="showAnswerCrossMark showAns"><img src="assets/images/crossMark.png" /></div>';
var isMusic1Playing = false;
var isMusic2Playing = false;
var $audio1 = $("#audioPlayer1");
var $audio2 = $("#audioPlayer2");
var slider = document.getElementById("myRange");

var lastAudio = 0;

var totalItems = $('.item').length;
var currentIndex = $('div.active').index() + 1;

function fnTemplate1_v1(_div){	
	var slide = $(_div);
	
	$audio1[0].currentTime = 0;
	// $("#slider").slider({"value": 0});
	slider.value = 0;
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	// isMusic1Playing = true;
    $('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();
	


	setAudio($(slide).attr('data-audioSrc'));
	$(slide).find('.option').off('click');
	$(slide).find('.option').on('click',function(){	
		
		$audio1[0].pause();
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		// isMusic1Playing = true;
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide()
		var result = $(this).attr('data-Answer');
		if(result == 'incorrect'){
			fnAudio(this);			
			$(this).append(incorrectImg);
			setTimeout(function(){
				$(slide).find('.showAnswerCrossMark').fadeOut();
				$(slide).find('.showAnswerCrossMark').remove();
			}, 2000);
		}else if(result == 'correct'){
			$(slide).find('.option').addClass('optDisable').off('click');
			$(this).append(correctImg);
			$('.showAnsBtn').addClass('disabled');
			$(slide).find('.showAnswerTickMark').fadeIn('slow');
			fnAudio(this);	
			$(slide).find(".option[data-Answer='incorrect']").addClass('disabled');
		}
		
	});

	if($(slide).find('div.showAns').length == 0){
		$('.showAnsBtn').removeClass('disabled');
	}else{
		$('.showAnsBtn').addClass('disabled');
		$('div.active').find('.option').off('click');
	}
	
}



function fnReloadScreen(){
	$('div.active').find('.showAns').remove();
	$('div.active').find('.option').removeClass('disabled optDisable').on('click');
	stopAudio();
	fnTemplate1_v1($('div.active'));
}

function fnAudio(obj){
	var titleAudioPath = $(obj).attr('data-audioSrc');		
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	var playPromise = $audio2[0].play();

    if (playPromise !== undefined) {
      playPromise.then(function(value) {
        // Automatic playback started!
        // Show playing UI.
        $audio1[0].currentTime = 0;        
		$("#slider").slider({"value": 0});
		$audio1[0].pause();		
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
      })
      .catch(function(error){
        // Auto-play was prevented
        // Show paused UI.
      });
    }	
}
function showAns(){	
	isMusicPlaying = false;
	
	$audio1[0].pause();
	$audio2[0].pause();
	stopAudio();
	isMusic1Playing = false;
	
	$('div.active').find('.option[data-Answer="correct"]').append(correctImg);
	$('div.active').find('.option[data-Answer="incorrect"]').addClass('disabled');
	$('div.active').find('.option').addClass('optDisable').off('click');
	$(this).addClass('disabled');
}

function setAudio(_src){	
	if(_src == ""){
		$('.controlsDiv').addClass('hide');
	}else{
		$('.controlsDiv').removeClass('hide');
	}
	$audio1[0].setAttribute('src', _src);	
	$audio1[0].load();	
}

/* Title Audio function */
function fnTitleAudioClick(obj){
	if($(obj).hasClass('disabled')){
		return false;
	}
	//$audio1[0].currentTime = 0;
	//$("#slider").slider({"value": 0});
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
    $('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();
	var titleAudioPath = $(obj).attr('data-audioSrc');	
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	$audio2[0].play();
	isMusic1Playing = false;
	isMusic2Playing = true;

}


function fnUpdateTimer(){	
	var progressValue = Math.round(($audio1[0].currentTime/$audio1[0].duration) * 100);	
	slider.value = progressValue;
}



function fnStartAudio(_state){	
	$audio2[0].pause();	
	if(_state == 'play'){
		$('#pButton .playImg').hide();
    	$('#pButton .pauseImg').show();
		$audio1[0].play();
		isMusic1Playing = true;
	}else{
		$('#pButton .playImg').show();
    	$('#pButton .pauseImg').hide();
		$audio1[0].pause();
		lastAudio = 0;
		isMusic1Playing = false;
	}
	$audio1[0].addEventListener('timeupdate', fnUpdateTimer);	
}

function stopAudio(){
	$audio1[0].pause();
	$('#pButton .playImg').show();
    $('#pButton .pauseImg').hide();
	$audio1[0].currentTime = 0;
	slider.value = 0;
	isMusic1Playing = false;
	$audio2[0].pause();
	isMusic2Playing = false;
	lastAudio = 0;
	
	
}

function fnSetPlayer(){
	if(currentIndex == 1){
		$('.backBtn').addClass('disabled');
	}

	if(totalItems == 1){
		$('.navigationControls, .nextBtn, .reloadBtnScreen, .backBtn, .pageNumber').addClass('hide');
	}

	if($('.title').attr('data-audioSrc') == ""){
		$('.title').addClass('hide');
		$('.headingTitle').removeClass('col-xs-10').addClass('col-xs-11');
	}


	$audio1[0].addEventListener('playing', function(){
		lastAudio = 1;
		isMusic1Playing = true;
	});

	$audio2[0].addEventListener('playing', function(){
		lastAudio = 2;
		isMusic2Playing = true;
	});

	$audio1[0].addEventListener('pause', function(){
		isMusic1Playing = false;
	});

	$audio2[0].addEventListener('pause', function(){
		isMusic2Playing = false;
	});

	$audio2[0].addEventListener('ended', function(){
		lastAudio = 0;
	});
	$audio1[0].addEventListener('ended', function(){
		lastAudio = 0;
		isMusic1Playing = false;	
		$audio1[0].currentTime = 0;
		slider.value = 0;
		$audio1[0].pause();
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
	});

	slider.addEventListener("input", function() {
	  // console.log(">> input "+slider.value);
	  // $audio1[0].pause();
	  $audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	  var setTime = Math.round((slider.value * $audio1[0].duration)/100);
		$audio1[0].currentTime = setTime;
	}, false);
	slider.addEventListener("change", function() {
		// console.log("change >> "+isMusic1Playing);
		if(isMusic1Playing){
			$audio1[0].play();
			$audio1[0].addEventListener('timeupdate', fnUpdateTimer);	
		}
	}, false);

	$('#myCarousel').on('slid.bs.carousel', function() {
	   currentIndex = $('div.active').index() + 1;
	   $('.pageNumber').html(currentIndex+' of '+totalItems);
	   if(currentIndex == 1){
	   		$('.backBtn').addClass('disabled');
	   }else{
	   		$('.backBtn').removeClass('disabled');
	   }

	   if(currentIndex == totalItems){
	   		$('.nextBtn').addClass('disabled');
	   }else{
	   		$('.nextBtn').removeClass('disabled');
	   }
	   
	   // need to edit template function name here:
	   fnTemplate1_v1($('div.active'));
	});
}