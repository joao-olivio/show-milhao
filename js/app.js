$(document).ready(function () {
	var currentStage = 0;
	var staticTemplate = undefined;
	var configurationFile = undefined;
	var randomizedQuestions = [];
	var audio = new Audio('img/plateia/Applause.wav');
	var abertura = new Audio('img/abertura.mp3');
	var audioUniversitarios = new Audio('img/universitarios.mp3');
	var rightQuestion = new Audio('img/true.mp3');
	var wrongQuestion = new Audio('img/Errou.mp3');
	var audioPerguntas = new Audio('img/perguntas.mp3');
	var jaPulou = false;
	var fim = new Audio('img/fim.mp3');

	var acertos = 0;

	var video = document.getElementById('coelho-pula');
	video.onended = function () {
		video.pause();
		video.currentTime = 0;
		$('.rabbit-modal').modal('hide');
		nextQuestion();
	}

	abertura.onended = function () {
		$('.abertura-modal').modal('hide');
	}

	$('.plateia-modal').on('shown.bs.modal', function() {
		audio.play();
	});

	$('.rabbit-modal').on('shown.bs.modal', function() {
		video.play();
	});

	$('.abertura-modal').on('shown.bs.modal', function() {
		abertura.play();
		setTimeout(function () {
			abertura.pause();
			abertura.currentTime = 0;
			$('.two').hide();
			$('.bt-iniciar').fadeIn();
		}, 40000);
	});


	$('.bt-iniciar').on('click', function () {
		$('.abertura-modal').modal('hide');
			audioPerguntas.play();
	});

	$('.universitarios-modal').on('shown.bs.modal', function() {
		audioUniversitarios.play();
	});

	$('.milhao-modal').on('hide.bs.modal', function() {
		fim.pause();
		fim.currentTime = 0;
		$('.abertura-modal').modal();
	 })

	$('.abertura-modal').on('hide.bs.modal', function() {
		abertura.pause();
		abertura.currentTime = 0;
		reset();
	});

	$('.abertura-modal').modal();
	$('.bt-iniciar').hide();


	$.get( "template/question-page.hbs", function(data) {
		staticTemplate = data;
		$.getJSON("config/cfg.json", function (data2) {
			configurationFile = data2;
			render();
			var laguraDaJanela = $(window).width() - 641;
			$('.tio-silvio').css('width',laguraDaJanela);
		});
	});

	function reset () {
		acertos = 0;
		randomizedQuestions = [];
		jaPulou = false;

		render();
	}


	/**
	 * Renderiza o xoguinho
	 * @return {undefined}
	 */
	function render () {
		if(!staticTemplate && !configurationFile) return;
		var source   = $(staticTemplate).html();
		var template = Handlebars.compile(source);

		if(acertos > 4) {
			fim.play();
			$('.milhao-modal').modal();
			return;
		}

		var nextValue = findNextQuestion(configurationFile.length);
		
		randomizedQuestions.push(nextValue);

		var ctx = configurationFile[nextValue];
		if(!ctx) return;
		var result = template(ctx);

		$('#changeable-container').html(result);
		$('body').off('click','.resposta');
		$('body').on('click', '.resposta', responde);
		audioPerguntas.play();
	}

	function findNextQuestion (v1) {
		if(v1 < 0) {
			reset();
			return;
		}

		var quantidadeDeTentativas = v1; // Este arquivo contem a quantidade de questões...
		var nextValue = getRandomInt(0,configurationFile.length);
		
		if(randomizedQuestions.indexOf(nextValue) > -1) { // significa que eu já tenho esse número sorteado
			findNextQuestion(--v1);
		} else {
			return nextValue;
		}
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}


	$('body').on('click', '.btn-pular', callJump);
	$('body').on('click', '.btn-universitarios', CallInterns);
	$('body').on('click', '.btn-plateia', callPlateia);

	function responde () {
		var el = $(this);
		if(el.attr('data-right') === 'true') {
			addFeedback(el);
		} else {
			addFeedback(el, 'error');
		}
	}

	function addFeedback(jqElement) {
		var secondParam = arguments[1];
		if(!secondParam) {
			//quer dizer o usuário acertou..
			jqElement.addClass('right-question');
			rightQuestion.play();
			setTimeout(function () {
				currentStage ++;
				jqElement.addClass('right');
				jqElement.removeClass('right-question');
				setTimeout(function () {
					acertos++;
					render();
				}, 2000);
			}, 3000);
		} else {
			//quer dizer que o usuário errou.
			jqElement.addClass('wrong-question');
			wrongQuestion.play();
			setTimeout(function () {
				currentStage = 0;
				jqElement.removeClass('wrong-question');
				jqElement.addClass('error');

				setTimeout(function () {
					console.log('ERRROW');
					$('.abertura-modal').modal();
				}, 2000);
			}, 5000);
		}
	}

	/**
	 * Chama a proxima pergunta
	 * @return {undefined}
	 */
	function nextQuestion () {
		render();
	}

	function callJump () {
		if(jaPulou) return;
		$('.rabbit-modal').modal();
		jaPulou = true;
	}

	/**
	 * Também conhecido como chamar os universitários
	 */
	function CallInterns () {
		$('.universitarios-modal').modal();

		setTimeout(function () {
			$('.universitarios-modal').modal('hide');
			audioUniversitarios.pause();
			audioUniversitarios.currentTime = 0;
		}, 5500);
	}

	/**
	 * Chama a plateia..
	 * @return {undefined} retorna nada.
	 */
	function callPlateia () {
		$('.plateia-modal').modal();

		setTimeout(function () {
			$('.plateia-modal').modal('hide');
			audio.pause();
			audio.currentTime = 0;
		}, 3500);
	}
});
