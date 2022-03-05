import { Story, Test, Question, Result, Character } from '../maho/text/text.js';
const story = Story[Symbol.iterator]();
const test = Test[Symbol.iterator]();
const questionText = Question[Symbol.iterator]();
const questionAnswer = Question[Symbol.iterator]();
const scoreBoard = Character.reduce((target, key) => {
	target[key] = 0;
	return target;
}, {});
var winner;
//시작 화면 -> 스토리 -> 테스트 -> (로딩창) -> 결과창
const startStory = () => {
	$('.start').hide();
	$('.story').show();
	$('#jjal').hide();
	document.addEventListener('click', nextStory);
	nextStory();
};
	//시작화면의 start버튼에 onclick
document.querySelector('#start-btn').addEventListener('click', startStory);
const nextStory = () => {
	//이터레이터 설정
	const storyNow = story.next();
	const storyNowValue = storyNow.value;

	//마지막 스토리 -> test로 넘어가기
	if (storyNow.done) {
		document.removeEventListener('click', nextStory);
		startTest();
	}
	//type별 스토리 진행
	if (storyNowValue) {
		switch (storyNowValue.type) {
			case 'story':
				$('.name-box').hide();
				displayStoryText(storyNowValue['text']);
				break;
			case 'chat':
				$('.name-box').show();
				$('.name-box').html(storyNowValue['speaker']);
				displayStoryText(storyNowValue['text']);
				break;
			case 'image':
				$('#jjal').show();
				$('#jjal').attr('src', storyNowValue['src']);
				break;
			case 'black':
				$('#jjal').hide();
				$('.story').css('transition', '.5s');
				$('.story').css('background-color', 'black');
				break;
		}
	}
	//텍스트 채워주는 함수
	function displayStoryText(txt) {
		document.getElementById('story-text').innerHTML = '';
		document.removeEventListener('click', nextStory);
		let i = 0;
		for (let letter of txt) {
			const v = ++i;
			setTimeout(() => {
				document.getElementById('story-text').innerHTML += letter;
				if (v >= txt.length) {
					document.addEventListener('click', nextStory);
				}
			}, v * 20);
		}
	}

	//test 전환 함수
};
const startTest = () => {
	//화면 전환
	$('.story').hide();
	$('.jjal').hide();
	$('.select-container').hide();
	$('.test').show();
	//이벤트리스너 전환
	document.addEventListener('click', nextTest);
	nextTest();
};
const nextTest = () => {
	let testNow = test.next();
	let testNowValue = testNow.value;

	//type별 스토리 진행
	if (testNowValue) {
		switch (testNowValue.type) {
			case 'story':
				$('.name-box').hide();
				displayTestText(testNowValue['text']);
				break;
			case 'chat':
				$('.name-box').show();
				$('.name-box').html(testNowValue['speaker']);
				displayTestText(testNowValue['text']);
				break;
			case 'image':
				$('.jjal').show();
				$('#jjal2').attr('src', './images/white.png');
				//이 부분 15ms인데 비동기를 굳이 넣어야 할까
				setTimeout(() => {
					$('#jjal2').attr('src', testNowValue['src']);
				}, 15);
				break;
			case 'select':
				const questionNow = questionText.next().value;
				displayTestText(questionNow['question'], true);
				$('.name-box').hide();
				// $('.select').hide();
				$('#A').html(questionNow['A']['answer']);
				$('#B').html(questionNow['B']['answer']);
				$('#C').html(questionNow['C']['answer']);
				document.removeEventListener('click', nextTest);
				break;
			case 'imageoff':
				$('.jjal').hide();
				break;
		}
	}

	//텍스트 채워주는 함수
	function displayTestText(txt, select) {
		document.getElementById('test-text').innerHTML = '';
		document.removeEventListener('click', nextTest);
		let i = 0;
		for (let letter of txt) {
			const v = ++i;
			setTimeout(() => {
				document.getElementById('test-text').innerHTML += letter;
				if (v >= txt.length && !select) {
					document.addEventListener('click', nextTest);
				}
				if(v >= txt.length &&select){
					document.addEventListener('click', showSelect);
				};
			}, v * 20);
		}
	}
	//선택지 띄우기
	function showSelect() {
		document.removeEventListener('click', showSelect);
		$('.select-container').show();
		$('.select').show();
		document.getElementById('A').addEventListener('click', answer);
		document.getElementById('B').addEventListener('click', answer);
		document.getElementById('C').addEventListener('click', answer);
	}
	//선택지 고르기
	function answer(event) {
		let questionNow = questionAnswer.next();
		const answerID = event.target.id;
		//이벤트리스너 해제
		document.getElementById('A').removeEventListener('click', answer);
		document.getElementById('B').removeEventListener('click', answer);
		document.getElementById('C').removeEventListener('click', answer);
		//프로그레스바 진행
		//여기서 9 대신에 다른 숫자 넣어줘야해.
		const gauge = document.querySelector("#progress-bar-before");
    	gauge.style.width = `${(gauge.style.width.replace("%","")*1) + (100/Question.length)}%`;
		//점수 매기기
		for (let characterName of Character) {
			scoreBoard[characterName] +=
				questionNow.value[answerID]['score'][characterName];
		}
		//클릭 애니메이션
		$(`#` + answerID).css('transform', 'translate3d(0,0,20px)');
		$('#test-text').html('');
		setTimeout(() => {
			$('.select-container').hide();
			$(`#` + answerID).css('transform', 'translate3d(0,0,0)');
			document.addEventListener('click', nextTest);
			//종료 구현
			if (Question[Question.length - 1] === questionNow.value) {
				startResult();
				console.log('end');
			} else {
				nextTest();
			}
		}, 1500);
	}
};
const startResult = () => {
	console.log(scoreBoard);
	const testPage = document.querySelector('.test');
	const loadingPage = document.querySelector('.loading');
	const resultPage = document.querySelector('.result');

	//이벤트리스너 삭제
	testPage.style.display = 'none';
	loadingPage.style.display = 'flex';

	//결과창 컨텐츠 채우기

	//최고 점수 찾기, 최고동점이면 랜덤
	let maxscore = 0;
	let winner = '';
	for (let score in scoreBoard) {
		let maxScore = maxscore;
		if (scoreBoard[score] >= maxScore) {
			maxscore = scoreBoard[score];
			if (scoreBoard[score] === maxScore) {
				const sameScore = [score, winner];
				winner = sameScore[Math.round(Math.random())];
			} else {
				winner = score;
			}
		}
	}

	// 결과창 이미지, 정보 채우기, 그림자 없애기
	$('.content').css('box-shadow', '0px 0px 0px 0px');
	$('.result_image').css(
		'background-image',
		'url(' + Result[winner]['img'] + ')'
	);
	$('.line1').html('"' + Result[winner]['line1'] + '"<br>');
	$('.line2').html('"' + Result[winner]['line2'] + '"');
	$('#r_name').html(winner);
	$('#r_anima').html(Result[winner]['anime']);
	$('.r_text').html(Result[winner]['personality']);

	let BF = Result[winner]['BF'];
	let WF = Result[winner]['WF'];
	$('#BF-img').attr('src', Result[BF]['img']);
	$('#WF-img').attr('src', Result[WF]['img']);
	$('#BF-img').attr('alt', BF);
	$('#WF-img').attr('alt', WF);
	$('#BF').html(BF);
	$('#WF').html(WF);

	$('#result-name').val(winner);
	$('#image-link').val('https://magicalgirl.kr/' + Result[winner]['img']);

	//로딩창 후 결과로
	setTimeout(() => {
		loadingPage.style.display = 'none';
		resultPage.style.display = 'block';
	}, 3 * 1000);
};


