$(document).ready(function () {
	var currentStage = 0;
	var staticTemplate = undefined;
	var configurationFile = undefined;

	$.get( "template/question-page.hbs", function(data) {
		staticTemplate = data;
		$.getJSON("config/cfg.json", function (data2) {
			configurationFile = data2;
			render();
			var laguraDaJanela = $(window).width() - 641;
			$('.tio-silvio').css('width',laguraDaJanela);
		});
	});

	


	/**
	 * Renderiza o xoguinho
	 * @return {undefined}
	 */
	function render () {
		if(!staticTemplate && !configurationFile) return;
		console.log(configurationFile);
		var source   = $(staticTemplate).html();
		var template = Handlebars.compile(source);
		var ctx = configurationFile[currentStage];
		if(!ctx) return;
		var result = template(ctx);

		$('#changeable-container').html(result);
		$('body').off('click','.resposta');
		$('body').on('click', '.resposta', responde);
	}


	$('body').on('click', '.btn-pular', callJump);
	$('body').on('click', '.btn-universitarios', CallInterns);
	$('body').on('click', '.btn-plateia', callPlateia);

	function responde () {
		$('body').off('click','.resposta');
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
			setTimeout(function () {
				currentStage ++;
				jqElement.addClass('right');
				jqElement.removeClass('right-question');
				setTimeout(function () {
					render();
				}, 2000);
			}, 3000);
		} else {
			//quer dizer que o usuário errou.
			jqElement.addClass('wrong-question');
			setTimeout(function () {
				currentStage = 0;
				console.log('resetPage');
				jqElement.removeClass('wrong-question');
				jqElement.addClass('error');
			}, 5000);
		}
	}

	/**
	 * Chama a proxima pergunta
	 * @return {undefined}
	 */
	function nextQuestion () {
		currentStage ++;
		render();
	}

	function callJump () {
		$('.rabbit-modal').modal();
		/*setTimeout(function () {
			$('.rabbit-modal').modal('hide');
			nextQuestion();
		}, 4000);
		*/
	}

	/**
	 * Também conhecido como chamar os universitários
	 */
	function CallInterns () {
		var answerArray = $('.resposta[data-right="false"]');
		answerArray.sort(function () {return 0.5 - Math.random()});

		var r1 = answerArray[0];
		var r2 = answerArray[1];

		$(r1).addClass('disabled');
		$(r2).addClass('disabled');

		$('body').off('click',r1);
		$('body').off('click',r2);
	}

	/**
	 * Chama a plateia..
	 * @return {undefined} retorna nada.
	 */
	function callPlateia () {

	}
});
