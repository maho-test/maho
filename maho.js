// 미완성, 하고싶은 내용..!
// 시작부분-> 테스트부분 fade in 애니메이션(opacity, display) , 선택지 애니메이션
// 시작 시 로딩창 display none 상태가 되도록 조정하기.
// BF, WF 



var storyNow = 1;   // 현재 스토리 부분
var testNow = 0;   // 현재 선택지 진행도
var i;


// start 버튼 누르면 story 진행
function startTest() {
    $(".start").hide();
    $(".story").show();
    $("#jjal").hide();
    document.addEventListener('click', story1);
}
// ..

// 모바일, 웹 모두 화면 어디든 클릭시 다음으로 넘어감.
// EventListener는 동기적으로 바뀌어 적용되는게 아니라 한번만 적용되는 것.

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function delayStoryText(txt) {
    i = 0;
    document.getElementById("story-text").innerHTML = "";
    while(i<txt.length){
        await delay(50);
        document.getElementById("story-text").innerHTML += txt.charAt(i)+txt.charAt(i+1)+txt.charAt(i+2);
        i+=3;
    }
    document.addEventListener('click', story1);
}

async function delayTestText(txt) {
    i = 0;
    document.getElementById("test-text").innerHTML = "";
    while(i<txt.length){
        await delay(50);
        document.getElementById("test-text").innerHTML += txt.charAt(i)+txt.charAt(i+1)+txt.charAt(i+2);
        i+=3;
    }
    document.addEventListener('click', test);
}


// 시작부분 스토리 함수
async function story1(){
    if (storyText[storyNow]["type"] == "story") {
        $(".name-box").hide();
        var txt = storyText[storyNow]["text"];
        document.removeEventListener('click', story1);
        delayStoryText(txt);
    }else if (storyText[storyNow]["type"] == "chat") {
        $(".name-box").show();
        $(".name-box").html(storyText[storyNow]["speaker"]);
        var txt = storyText[storyNow]["text"];
        document.removeEventListener('click', story1);
        delayStoryText(txt);
    }else if (storyText[storyNow]["type"] == "image") {
        $("#jjal").show();
        $("#jjal").attr("src",storyText[storyNow]["src"]);
    }else {
        $("#jjal").hide();
        $(".story").css("transition",".5s");
        $(".story").css("background-color","black");
    }
    storyNow++;
    if (storyNow == 8) {
        document.removeEventListener("click", story1);
        document.addEventListener('click', test);
    }
}
// ..

// 테스트 부분 함수, 프로그레스바, 선택창까지 관리
async function test() {
    if (storyNow == 8) {
                $(".story").css("backgroundColor","white");
                $(".story").hide();
                $(".jjal").hide();
                $(".select-container").hide();
                $(".test").show();
            }
    if (storyText[storyNow]["type"] == "story") {
        $(".name-box").hide();
        var txt = storyText[storyNow]["text"];
        document.removeEventListener('click', test);
        delayTestText(txt);
        // $("#test-text").html(storyText[storyNow]["text"]);
    }else if (storyText[storyNow]["type"] == "chat") {
        $(".name-box").show();
        $(".name-box").html(storyText[storyNow]["speaker"]);
        var txt = storyText[storyNow]["text"];
        document.removeEventListener('click', test);
        delayTestText(txt);
        // $("#test-text").html(storyText[storyNow]["text"]);
    }else if (storyText[storyNow]["type"] == "image") {

        $(".jjal").show();

        $("#jjal2").attr("src","white.png");
        await delay(15);
        // $(".jjal").css("filter","blur(2px)");

        // setTimeout(()=>{
        //     $(".jjal").css("filter","blur(0px)");
        // },500)
        $("#jjal2").attr("src",storyText[storyNow]["src"]);
    }else if (storyText[storyNow]["type"] == "select") {
        testNow++;
        $(".name-box").hide();

        // 이 부분은 event 관리를 위해 test 내에 작성
        document.removeEventListener('click', test);
        var txt = q[testNow]["question"];
        i = 0;
        document.getElementById("test-text").innerHTML = "";
        
        while(i<txt.length){
            await delay(50);
            document.getElementById("test-text").innerHTML += txt.charAt(i)+txt.charAt(i+1)+txt.charAt(i+2);
            i+=3;
        }
        //...

        // $("#test-text").html(q[testNow]["question"]);
        $('.select').hide();
        $("#A").html(q[testNow]["A"]["answer"]);
        $("#B").html(q[testNow]["B"]["answer"]);
        $("#C").html(q[testNow]["C"]["answer"]);

        document.removeEventListener("click", test);
        document.addEventListener("click", showSelect);
    }else if (storyText[storyNow]["type"] == "imageoff"){
        $(".jjal").hide();
        // $("#test-text").html("");
    }
    else {
        $(".jjal").hide();
        $(".test").css("background-color","black");
    }
    storyNow++;
}
//..

// 질문 먼저 나오고 클릭시 선택지 나오도록 하는 함수
function showSelect(){
    document.removeEventListener("click", showSelect);
    $(".select-container").show();
    $(".select").show();
    document.getElementById("A").addEventListener('click', calPoint);
    document.getElementById("B").addEventListener('click', calPoint);
    document.getElementById("C").addEventListener('click', calPoint);
}

// 선택지 선택시 호출, 점수 부여, 저장 후 eventListener 다시 추가하기
// document.getElementById("A").addEventListener('click', calPoint);
// document.getElementById("B").addEventListener('click', calPoint);
// document.getElementById("C").addEventListener('click', calPoint);

var resultMaho;

// 선택지 버튼 클릭시 호출
function calPoint() {
    console.log(testNow);
    document.getElementById("A").removeEventListener('click', calPoint);
    document.getElementById("B").removeEventListener('click', calPoint);
    document.getElementById("C").removeEventListener('click', calPoint);

    progressBar(testNow);
    selected = this.id;
    $("#아무").val(parseInt($("#아무").val()) + q[testNow][selected]["score"]["아무"]);
    $("#세라").val(parseInt($("#세라").val()) + q[testNow][selected]["score"]["세라"]);
    $("#유리").val(parseInt($("#유리").val()) + q[testNow][selected]["score"]["유리"]);
    $("#비키").val(parseInt($("#비키").val()) + q[testNow][selected]["score"]["비키"]);
    $("#예리").val(parseInt($("#예리").val()) + q[testNow][selected]["score"]["예리"]);
    $("#네티").val(parseInt($("#네티").val()) + q[testNow][selected]["score"]["네티"]);
    $("#레미").val(parseInt($("#레미").val()) + q[testNow][selected]["score"]["레미"]);
    $("#메이").val(parseInt($("#메이").val()) + q[testNow][selected]["score"]["메이"]);
    $("#사랑").val(parseInt($("#사랑").val()) + q[testNow][selected]["score"]["사랑"]);
    $("#피치").val(parseInt($("#피치").val()) + q[testNow][selected]["score"]["피치"]);
    $("#체리").val(parseInt($("#체리").val()) + q[testNow][selected]["score"]["체리"]);
    $("#중성마녀").val(parseInt($("#중성마녀").val()) + q[testNow][selected]["score"]["중성마녀"]);
    $("#쇼콜라").val(parseInt($("#쇼콜라").val()) + q[testNow][selected]["score"]["쇼콜라"]);
    $("#바닐라").val(parseInt($("#바닐라").val()) + q[testNow][selected]["score"]["바닐라"]);
    
    // $(`#`+selected).addClass("selectActive")
    // $(`#`+selected).css("font-size","2.5rem");
    $(`#`+selected).css("transform","translate3d(0,0,30px)");

   
    $("#test-text").html("");

    if (testNow==9){
        setTimeout(()=>{
            $(".select-container").hide();
            $(`#`+selected).css("transform","translate3d(0,0,0)");
            $("#progress-bar-before").css("border-radius","15px");
            loading(3);
        },1500);
        // 끝이므로 결과 계산하기 + 로딩창 띄우기 + 결과창 띄우기
        // $(".test").hide();
        // $(".loading").show();
        var temp;
        temp = 0;

        for (const [k,v] of Object.entries(result)){
            var scoreOf = parseInt($("#"+k).val());
            if (temp == scoreOf){
                // 랜덤으로 선택하기 (같은경우에)
                let randNum = Math.floor(Math.random()*2);
                if (randNum == 0) {
                    resultMaho = k;
                }
            }
            else if (scoreOf > temp){
                resultMaho = k;
                temp = scoreOf;
            }
        }
        // 결과창 이미지, 정보 채우기, 그림자 없애기
        $(".content").css('box-shadow','0px 0px 0px 0px');
        $(".result_image").css("background-image", "url(" + result[resultMaho]["img"]+")");
        $(".line1").html("\""+result[resultMaho]["line1"] + "\"<br>");
        $(".line2").html("\"" + result[resultMaho]["line2"] + "\"");
        $("#r_name").html(resultMaho);
        $("#r_anima").html(result[resultMaho]["anime"]);
        $(".r_text").html(result[resultMaho]["personality"]);

        let BF = result[resultMaho]["BF"];
        let WF = result[resultMaho]["WF"]
        $("#BF-img").attr('src', result[BF]["img"]); $("#WF-img").attr('src', result[WF]["img"]);
        $("#BF-img").attr('alt', BF); $("#WF-img").attr('alt', WF);
        $("#BF").html(BF);
        $("#WF").html(WF);
        // $(".result").show();
        
    }
    else {
        // 바로 다음으로 진행
        setTimeout(()=>{
            $(".select-container").hide();
            $(`#`+selected).css("transform","translate3d(0,0,0)");
            document.addEventListener('click', test);
            test();
        },1500)


        // document.addEventListener('click', test);
        // setTimeout(()=>{
        //     document.addEventListener('click', test);
        // },300)
    }
    
}


//로딩 sec초 후 결과창 가는 함수
const loading = (sec)=>{
    const testPage = document.querySelector(".test");
    const loadingPage = document.querySelector(".loading");
    const resultPage = document.querySelector(".result");

    testPage.style.display = "none"
    loadingPage.style.display = "flex";
    setTimeout(()=>{
        loadingPage.style.display = "none";
        resultPage.style.display = "block";
    },sec*1000)
}
// ..

// 스토리 진행용 스토리 객체
var storyText = {
    1: {"type" : "story",
        "text" : "어느날 눈을 떠보니.. "},
    2: {"type" : "image",
        "src" : "mascot.png"},
    3: {"type" : "story",
        "text" : "요괴가 눈앞에서 날라다니고 있었다. "},
    4: {"type" : "chat",
        "speaker" : "빈짱",
        "text" : "난 요괴가 아니라 요정이라구..! 내 이름은 빈짱! 잘 부탁해!"},
    5: {"type" : "chat",
        "speaker" : "나",
        "text" : "(...?)"},
    6: {"type" : "story",
        "text" : "요정의 말을 듣고, 나는 마법소녀가 되어 세상을 지키기 시작했다.."},
    7: {"type" : "black"},
    // 8번부터 test div 이용.
    8: {"type" : "story",
        "text" : "20XX.03.09 월요일 아침..."},
    9: {"type" : "story",
        "text" : "아침이네..."},
    10: {"type" : "image",
        "src" : "morning.png"},
    11: {"type" : "select"},
    12: {"type" : "image",
        "src":"goschool.png"},
    13: {"type" : "image",
        "src": "classroom2.png"},
    14: {"type" : "story",
        "text": "학교에 도착했다."},
    15: {"type" : "story",
        "text": "체육시간이다. 체육관으로 가자."},
    16: {"type" : "image",
        "src": "gym.jpg"},
    17: {"type" : "story",
        "text": "..."},
    18: {"type" : "select"},
    19: {"type" : "image",
        "src": "classroom2.png"},
    20: {"type" : "story",
        "text": "교실에 돌아와보니..."},
    21: {"type" : "image",
        "src": "bullies.png"},
    22: {"type" : "story",
        "text": "무서운 언니들이 내 자리에 서 있었다."},
    23: {"type" : "select"},
    24: {"type" : "image",
        "src": "hallway.jpg"},
    25: {"type" : "chat",
        "speaker" : "나",
        "text" : "후.. 겨우 돌려 보냈네. 화장실이나 가야지.."},
    26: {"type" : "chat",
        "speaker" : "나",
        "text" : "...?"},
    27: {"type" : "story",
        "text" : "창 밖에서 나를 부르는 소리가 들린다."},
    28: {"type" : "image",
        "src" : "propose3.png"},
    29: {"type" : "select"},
    30: {"type" : "image",
        "src": "hallway.jpg"},
    31: {"type" : "story",
        "text": "대답을 하려던 차에 교실 쪽에서 큰 소리가 났다."},
    32: {"type" : "image",
        "src": "classroom2.png"},
    33: {"type" : "image",
        "src": "monsterscene.png"},
    34: {"type" : "chat",
        "speaker" : "괴수",
        "text" : "크와아앙-!"},
    35: {"type" : "select"},
    36: {"type" : "story",
        "text": "괴수와 싸우게 된 나... 잠깐 한눈 판 사이에...?"},
    37: {"type" : "select"},
    38: {"type" : "image",
        "src": "monsterscene2.png"},
    39: {"type" : "select"},
    40: {"type" : "image",
        "src": "classroom2.png"},
    41: {"type" : "chat",
        "speaker" : "나",
        "text" : "후... 근데 아까 들렸던 찰칵 소리가 신경쓰이네.."},
        // 사진 바뀌는 애니메이션 좀 필요할듯
    42: {"type" : "image",
        "src": "classroom_sunset.jpg"},
    43: {"type" : "story",
        "text": "집에 얼른 가야겠다.."},
    44: {"type" : "story",
        "text": "귀가하려 하는데 누군가 말을 걸어왔다."},
    45: {"type" : "image",
        "src": "friend.jpg"},
    46: {"type" : "chat",
        "speaker" : "Jisu",
        "text" : "후후.. 오늘 재밌는 사진을 찍었는데요...? 같이 보실래요?"},
    47: {"type" : "image",
        "src": "camera.png"},
    48: {"type" : "select"},
    49: {"type" : "image",
        "src": "classroom_sunset.jpg"},
    50: {"type" : "chat",
        "speaker" : "나",
        "text" : "오늘 하루 왜이러지... 지친다."},
    51: {"type" : "story",
        "text": "앗... 또 누가 말을 걸어온다."},
    52: {"type" : "image",
        "src": "hansome.png"},
    53: {"type" : "select"}
}
// ..

// 문제와 선택지별 점수(마법소녀 점수 그렇다: 2 보통, 모르겠음, 다른 마법소녀에 비해 정도가 덜함: 1 아니다: 0)
// 각 질문지별 평균점수는 0.7~1.3 이내로 오차, 최대한 1로
var X=1;
var q = {
    1: {
        "question" : "나의 아침은?",
        "A" : {
            "answer" : "'늦지만 않으면 되지..' 최대한 잔다.",
            "score" : {"아무": 1, "세라": 1, "유리": 0, "비키": 1, "예리": 0, "네티": 1, "레미": 2, "메이": 0, "사랑": 1, "피치": 0, "체리": 2, "중성마녀": 0, "쇼콜라": 2, "바닐라": 0}
        },
        "B" : {
            "answer" : "아침을 먹으며 점심이 뭐 나올지 생각한다. 등등 다른 재밌는 상상을 한다.",
            "score" : {"아무": 1, "세라": 2, "유리": 2, "비키": 1, "예리": 1, "네티": 2, "레미": 1, "메이": 1, "사랑": 1, "피치": 1, "체리": 1, "중성마녀": 0, "쇼콜라": 1, "바닐라": 1}
        },
        "C" : {
            "answer" : "알람이 울리기도 전에 깨서 학교 갈 준비를 한다.",
            "score" : {"아무": 1, "세라": 0, "유리": 1, "비키": 1, "예리": 2, "네티": 0, "레미": 0, "메이": 2, "사랑": 1, "피치": 2, "체리": 0, "중성마녀": 2, "쇼콜라": 0, "바닐라": 2}
        }
    },
    2: {
        "question" : "피구를 할 때 나는?",
        "A" : {
            "answer" : "승부는 승부. 피구왕 통키에 빙의해 '진심볼'을 던진다.",
            "score" : {"아무": 1, "세라": 0, "유리": 2, "비키": 2, "예리": 0, "네티": 1, "레미": 2, "메이": 0, "사랑": 2, "피치": 1, "체리": 1, "중성마녀": 1, "쇼콜라": 2, "바닐라": 0}
        },
        "B" : {
            "answer" : "적당히 참여해야지... 열심히 피한다.",
            "score" : {"아무": 1, "세라": 2, "유리": 1, "비키": 1, "예리": 2, "네티": 1, "레미": 1, "메이": 1, "사랑": 1, "피치": 1, "체리": 2, "중성마녀": 1, "쇼콜라": 1, "바닐라": 1}
        },
        "C" : {
            "answer" : "밴치에 앉아서 친구들이 피구하는 모습을 지켜본다.",
            "score" : {"아무": 1, "세라": 1, "유리": 0, "비키": 0, "예리": 1, "네티": 1, "레미": 0, "메이": 2, "사랑": 0, "피치": 1, "체리": 0, "중성마녀": 1, "쇼콜라": 0, "바닐라": 2}
        }
    },
    3: {
        "question" : "험악한 여고생 언니들이 틴트 좀 빌리자고 한다. 하지만 돌려줄 것 같진 않다.",
        "A" : {
            "answer" : "*같지만 일단 참는다. '나는 마법소녀니까~'",
            "score" : {"아무": 1, "세라": 0, "유리": 2, "비키": 0, "예리": 2, "네티": 1, "레미": 2, "메이": 1, "사랑": 0, "피치": 2, "체리": 1, "중성마녀": 0, "쇼콜라": 0, "바닐라": 1}
        },
        "B" : {
            "answer" : "주님 저 애를 죽이겠습니다. 용서해주세요. (주먹으로 해결한다.)",
            "score" : {"아무": 2, "세라": 0, "유리": 1, "비키": 3, "예리": 0, "네티": 1, "레미": 0, "메이": 0, "사랑": 3, "피치": 0, "체리": 0, "중성마녀": 2, "쇼콜라": 3, "바닐라": 0}
        },
        "C" : {
            "answer" : "'언니들과 싸울 순 없지만 내 틴트도 소중한걸...'  울먹이기 시작한다.",
            "score" : {"아무": 0, "세라": 3, "유리": 0, "비키": 0, "예리": 1, "네티": 1, "레미": 1, "메이": 2, "사랑": 0, "피치": 1, "체리": 2, "중성마녀": 0, "쇼콜라": 0, "바닐라": 2}
        }
    },
    4: {
        "question" : "전교생이 쳐다보는 중에 사랑을 고백하는 반 친구! 당신은?",
        "A" : {
            "answer" : "\"고... 고멘!\" 당당히 거부한다.",
            "score" : {"아무": 2, "세라": 1, "유리": 1, "비키": 1, "예리": 1, "네티": 2, "레미": 2, "메이": 0, "사랑": 2, "피치": 2, "체리": 1, "중성마녀": 1, "쇼콜라": 2, "바닐라": 0}
        },
        "B" : {
            "answer" : "'**...' 속으로 욕한 후 무시한다.",
            "score" : {"아무": 1, "세라": 0, "유리": 2, "비키": 1, "예리": 1, "네티": 0, "레미": 0, "메이": 1, "사랑": 1, "피치": 0, "체리": 0, "중성마녀": 2, "쇼콜라": 1, "바닐라": 1}
        },
        "C" : {
            "answer" : "위경련이 온 척 쓰러져 상황을 모면한다.",
            "score" : {"아무": 0, "세라": 2, "유리": 0, "비키": 1, "예리": 1, "네티": 1, "레미": 1, "메이": 2, "사랑": 0, "피치": 1, "체리": 2, "중성마녀": 0, "쇼콜라": 0, "바닐라": 2}
        }
    },
    5: {
        "question" : "교실에 갑자기 괴수가 난입했다. 클래스 메이토가 위험하다. 당신의 선택은?",
        "A" : {
            "answer" : "'와타시.. 부끄러운걸..'  (탈의실에 달려가 변신!)",
            "score" : {"아무": 2, "세라": 1, "유리": 2, "비키": 1, "예리": 2, "네티": 1, "레미": 1, "메이": 2, "사랑": 1, "피치": 1, "체리": 2, "중성마녀": 0, "쇼콜라": 1, "바닐라": 2}},
        "B" : {
            "answer" : "'친구들을 지켜야해! 한시가 바빠!' (친구들이 지켜보든 말든 화려하게 변신!)",
            "score" : {"아무": 1, "세라": 2, "유리": 1, "비키": 2, "예리": 1, "네티": 1, "레미": 2, "메이": 1, "사랑": 2, "피치": 2, "체리": 1, "중성마녀": 0, "쇼콜라": 2, "바닐라": 1}
        },
        "C" : {
            "answer" : "'호에에-' 친구들을 따라 도망친다.",
            "score" : {"아무": 0, "세라": 0, "유리": 0, "비키": 0, "예리": 0, "네티": 1, "레미": 0, "메이": 0, "사랑": 0, "피치": 0, "체리": 0, "중성마녀": 3, "쇼콜라": 0, "바닐라": 0}
        }
    },
    6: {
        "question" : "정말 싫어하는 애가 괴수에게 잡아 먹히려 한다. 도우면 나도 위험해질 수 있다.",
        "A" : {
            "answer" : "괴수한테 마법을 날리는 척하면서 그 녀석에게 날린다.",
            "score" : {"아무": 0, "세라": 0, "유리": 1, "비키": 2, "예리": 0, "네티": 1, "레미": 1, "메이": 0, "사랑": 2, "피치": 0, "체리": 0, "중성마녀": 4, "쇼콜라": 2, "바닐라": 1}
        },
        "B" : {
            "answer" : "저런 애 때문에 위험에 처할 순 없지. 일단 상황을 지켜본다. ",
            "score" : {"아무": 1, "세라": 1, "유리": 2, "비키": 0, "예리": 1, "네티": 1, "레미": 0, "메이": 2, "사랑": 0, "피치": 1, "체리": 1, "중성마녀": 0, "쇼콜라": 0, "바닐라": 2}
        },
        "C" : {
            "answer" : "'생명은 그 무엇과도 바꿀 수 없다구-!' 그 애를 구하기 위해 돌진한다.",
            "score" : {"아무": 2, "세라": 2, "유리": 0, "비키": 1, "예리": 2, "네티": 1, "레미": 2, "메이": 1, "사랑": 1, "피치": 2, "체리": 2, "중성마녀": 0, "쇼콜라": 1, "바닐라": 0}
        }
    },
    7: {
        "question" : "싸움이 끝난 후, 괴수의 목숨구걸! 살려달라 한다. 살려줄 것인가? ",
        "A" : {
            "answer" : "'문 티아라 액션(필살기)'을 가한 후 무자비하게 돌아선다.",
            "score" : {"아무": 1, "세라": 0, "유리": 2, "비키": 3, "예리": 1, "네티": 1, "레미": 0, "메이": 1, "사랑": 3, "피치": 0, "체리": 0, "중성마녀": 2, "쇼콜라": 2, "바닐라": 1}
        },
        "B" : {
            "answer" : "\"호에에에.. 앞으로는 착하게 살도록 하세요..\" 일장 연설을 하고 돌아선다.",
            "score" : {"아무": 2, "세라": 1, "유리": 0, "비키": 0, "예리": 2, "네티": 2, "레미": 1, "메이": 2, "사랑": 0, "피치": 2, "체리": 2, "중성마녀": 0, "쇼콜라": 0, "바닐라": 2}
        },
        "C" : {
            "answer" : "'귀여운 면이 있군.' 괴수쿤과 친구를 먹는다.",
            "score" : {"아무": 0, "세라": 2, "유리": 1, "비키": 0, "예리": 0, "네티": 0, "레미": 2, "메이": 0, "사랑": 0, "피치": 1, "체리": 1, "중성마녀": 0, "쇼콜라": 1, "바닐라": 0}
        }
    },
    8: {
        "question" : "애매하게 친한 친구가 내 마법 소녀/소년 변신 모습을 찍은 사진을 건넨다.",
        "A" : {
            "answer" : "뾰로롱-☆ 기억을 지워보려고 시도한다. 다만 잘 될 진 모르겠다.",
            "score" : {"아무": 2, "세라": 0, "유리": 2, "비키": 0, "예리": 2, "네티": 1, "레미": 0, "메이": 2, "사랑": 1, "피치": 0, "체리": 1, "중성마녀": 0, "쇼콜라": 0, "바닐라": 1}
        },
        "B" : {
            "answer" : "뾰로롱-☆ 친구를 마법소녀같이 만든 후 사진을 찍어 입막음한다.",
            "score" : {"아무": 1, "세라": 1, "유리": 1, "비키": 2, "예리": 0, "네티": 1, "레미": 2, "메이": 0, "사랑": 2, "피치": 1, "체리": 0, "중성마녀": 2, "쇼콜라": 2, "바닐라": 0}
        },
        "C" : {
            "answer" : "\"나 사실... 마법소녀야.\" 솔직하게 밝힌다.",
            "score" : {"아무": 0, "세라": 2, "유리": 0, "비키": 1, "예리": 1, "네티": 1, "레미": 1, "메이": 1, "사랑": 0, "피치": 2, "체리": 2, "중성마녀": 0, "쇼콜라": 1, "바닐라": 2}
        }
    },
    9: {
        "question" : "방과 후 집에 가기전에 내가 좋아하는 애가 갑자기 말을 걸어온다. 이때 나는?",
        "A" : {
            "answer" : "손주 이름은 Alice로 한다. (결혼까지 생각한다.)",
            "score" : {"아무": 1, "세라": 2, "유리": 0, "비키": 2, "예리": 0, "네티": 2, "레미": 2, "메이": 0, "사랑": 1, "피치": 2, "체리": 1, "중성마녀": 2, "쇼콜라": 2, "바닐라": 0}
        },
        "B" : {
            "answer" : "'그저 말을 걸어온 것 뿐이야..' (기대하지 않는다.)",
            "score" : {"아무": 0, "세라": 0, "유리": 2, "비키": 0, "예리": 1, "네티": 0, "레미": 0, "메이": 1, "사랑": 1, "피치": 0, "체리": 0, "중성마녀": 0, "쇼콜라": 0, "바닐라": 1}
        },
        "C" : {
            "answer" : "흥!! 딱히 기쁜 건 아니거든! (살짝 기대한다.)",
            "score" : {"아무": 2, "세라": 1, "유리": 1, "비키": 1, "예리": 2, "네티": 1, "레미": 1, "메이": 2, "사랑": 1, "피치": 1, "체리": 2, "중성마녀": 0, "쇼콜라": 1, "바닐라": 2}
        }
    }
}
// ..

// BF: 만나면 친해지는.. WF: 만나면 싸우는..
var result = {
    "아무": {
        "img":"amu.png",
        "anime": "캐릭캐릭 체인지",
        "line1" : "다들, 처음에는 겉모습만 보고선 판단하지만 어쩌면 진정한 모습은 의외로 겉모습과 전혀 다를지도 몰라.",
        "line2" : "나의 마음을 언록!",
        "personality" : "쿨하고 무관심해보이지만 사실은 소심하고 정이 많아요.<br>어느 사람을 만나든 잘 대화하고 맞춰줘요.<br>자신의 성격, 가치관에 대해 많은 고민을 해요. 나를 아직 제대로는 몰라요.<br>주위 사람들에게 약간 짓궂게 대하고, 속마음을 숨기는 면이 있어요.<br>친구, 가족을 잘 이해하고 공감해주는 따뜻한 마음의 소유자에요. 부탁도 잘 거절 못해요.<br>말재간이 약간 없는 편이라 오해를 낳을 수 있어요. 때로는 상대를 아끼는 마음을 전달해봐요.<br>솔직하지 못해요. 진지한 감정표현은 낯간지럽고, 칭찬은 부끄러워요.<br>자신에 대해 조금 매몰차요. 남을 아껴주는 만큼 나도 아껴주면 좋겠어요.<br>연인, 썸 문제에서는 쉽게 휘청대요.",
        "BF":"네티",
        "WF":"메이"
    },
    "세라": {
        "img":"sera.jpg",
        "anime": "세일러 문, 세일러문",
        "line1" : "달빛의 요정이여! 빛으로 얍!",
        "line2" : "정의의 이름으로 널 용서하지 않겠다!",
        "personality" : "밝고 활발하고 주변사람에게 먼저 다가가요. 엉뚱하고 톡톡 튀는 매력으로 모르는 사람이랑도 잘 친해져요.<br>개성이 넘치고 감정표현을 잘 해요. <br>타인을 감싸주는 포용력을 가졌어요. 주변에 친구가 많은 인기 있는 타입!<br>눈물이 많고 좀 덜렁대요. 또 다소 충동적이에요.<br>희생정신, 봉사정신이 있어요. 따뜻한 마음씨를 가져서 남에게 상처주는 것을 두려워해요.<br>좋아하는 일에 열정을 갖고 임하지만, 쉽게 싫증을 느끼기도 해요.<br>순수하고 천진난만한 면이 있어요. 거짓말을 잘 못하고 금방 티가 나요.<br>연애에도 관심이 많고 낭만적인 사랑을 원해요.",
        "BF":"유리",
        "WF":"사랑"
    },
    "유리": {
        "img":"yuri.jpg",
        "anime": "세일러 머큐리, 세일러문",
        "line1" : "머큐리 요정이여~ 빛으로 얍!",
        "line2" : "시험시간 제곱 플러스 수업시간 제곱 플러스 루트 스트레스 곱하기 괄호열고 방해한 시간 제곱 괄호닫고...",
        "personality" : "조용하고 얌전한 느낌이에요. 그렇지만 강단 있게 할 말은 해요!<br>겉보기에는 쿨해 보이지만 착하고 상냥해요. 친구들을 뒤에서 잘 챙겨줘요.<br>활발하고 엉뚱한 모습도 많이 보여주는 편이에요. 옆에서 보면 즐거워요.<br>뭐든지 잘하는 만능캐! 처음 하는 일도 잘 배워요. 그리고 성실하기까지!<br>현실적으로 생각하고, 분석적으로 문제를 해결하는 것을 좋아해요.<br>완벽주의적 성향이 있어요. 스스로의 신념과 규칙에 따라 행동해요. <br>예의 없게 행동하는 것을 싫어해요. 사람 간에 예의는 필수!<br>낭만적인 사랑을 꿈꾸지만, 대시받으면 좀 부담스러워하고 철벽을 치는 편이에요.",
        "BF":"세라",
        "WF":"네티"
    },
    "비키": {
        "img":"viki.jpg",
        "anime": "세일러 마스, 세일러문",
        "line1" : "마스 요정이여 빛으로 얍!",
        "line2" : "불꽃보다 더 뜨거운 벌을 내리겠어!",
        "personality" : "똑 부러지고 당당한 성격! 모두를 설레게 하는 걸크러시 느낌이 있어요.<br>약간 불같아요. 잠자코 있는 날 건드리면 똑같이 갚아줄 거에요.<br>평소에는 괜히 장난치고 친구의 말에 딴지를 걸어요. 그래도 진지한 모습을 가지고 있어서 힘든 일이 있을 때 정말 의지가 돼요.<br>주변 친구들을 아끼고 인간관계를 중시해요. 정이 많아 크게 스트레스를 받기도 해요.<br>쿨하고 시원시원한 면이 있어서 카리스마가 있고 사람들이 따라요. 동경받는 타입!<br>강인한 정신력을 갖고 있고, 행동력이 강해요. 높은 추진력으로 원하는 일을 잘 이끌어요.<br>감이 좋은 편이에요. 예상한 게 보통 들어맞아요.<br>새로운 것에 관심이 많으며 도전하는 편이에요.<br>연애에 관심이 있지만, 잘 안된다고 느끼면 쿨하게 포기할 줄 알아요.",
        "BF":"체리",
        "WF":"예리"
    },
    "예리": {
        "img":"yeri.png",
        "anime": "잔느, 신의 괴도 잔느",
        "line1" : "체크 메이트!",
        "line2" : "강한 마음과 진정한 아름다움을 그리고.. 용기를!",
        "personality" : "활발하고 용감해요. 남을 위해 먼저 나설 수 있어요.<br>사실은 외로움이 많은 편이에요. 의지가 되는 사람이 자신의 주변에 있길 바래요.<br>일부러 강한 척을 하고 힘든 일이 있어도 굳이 티를 내진 않아요. 또, 생각이 많아요.<br>가까운 사람들과 갈등이 생기는 것은 매우 아픈 일이에요. 정이 많고 연약한 면이 있어서 관계에서 쉽게 상처를 받아요.<br>소외당하는 사람들의 편에 서는 따뜻한 마음씨를 가졌어요. 힘들어 하는 사람을 쉽게 지나치지 못해요.<br>자기 주장을 강하게 하지 않고 양보를 잘 하고 겸손해요.<br>원칙보다는 자기 신념을 중시하는 편이에요.<br>새로운 것보다는 익숙한 것에서 편안함, 안정감을 느끼길 바래요.<br>다른 사람의 눈치를 좀 살펴요. 가끔 멀리 떠나고 싶어져요.",
        "BF":"사랑",
        "WF":"비키"
    },
    "네티": {
        "img":"neti.png",
        "anime": "샐리, 천사소녀 네티",
        "line1" : "주님, 오늘도 정의로운 도둑이 되는걸 허락해주세요!",
        "line2" : "루루팡! 루루피! 루루~얍!",
        "personality" : "밝고 활발한 성격이지만 약간 내향적이에요.<br>덜렁대는 게 심해요. 약간 허당! 그래도 자기가 맡은 일에 책임감이 강해요.<br>자신의 기분, 생각을 잘 알아주는 사람에게 끌려요. 따로 말 안해도 잘 알아줬으면 좋겠어요.<br>친구가 많은 타입은 아니에요. 그래도 진짜 나를 알고 이해해주는 친한 친구가 있어요.<br>관심의 중심에 서는 건 바라지 않지만, 어느 정도 관심받고 싶어해요.<br>상상력도 풍부하고 창의성 있는 사람이에요. 알록달록한 풍선 같아요.<br>감정적이고, 감정 기복이 심한 편이에요. 그리고 충동적인 면이 있어요.<br>운동신경이 좋고 손재주가 있어요.<br>낭만적인 순간, 로망 있는 연애를 꿈꿔요. 사랑에 빠지면 잘 헤어나오지 못해요.",
        "BF":"아무",
        "WF":"유리"
    },
    "레미": {
        "img":"remi.png",
        "anime": "도레미, 꼬마마법사 레미",
        "line1" : "역시 난 세상에서 가장 불행한 미소녀야! 뿌! 뿌! 뿌!",
        "line2" : "삐리카 삐리랄라 산뜻하게",
        "personality" : "같이 있으면 항상 즐거워요. 활기를 불어 넣는 비타민C 같은 상큼한 존재!<br>친화력이 매우 좋아서 누구와도 쉽게 친해져요. 인싸 중에 인싸에요.<br>덜렁대는 데에 프로에요! 지각, 책 두고오기 등 작은 실수를 일삼아요.<br>참견쟁이인 면이 조금 있어요. 그래도 귀여운 정도로만 그래요.<br>사람들에게 상냥한 편이고 유쾌해서 많이 사랑받는 타입이에요.<br>자신감이 있고 표현력이 좋아요. 리액션, 감정 표현도 잘하는 편..!<br>관계를 소중히 생각하고, 친구간 문제가 생기면 속으로 걱정이 많아져요.<br>열정이 있어 좋아하는 일에 열심이지만, 싫증도 잘 내는 성격이에요.<br>금사빠인 면이 있고 연애에 관심이 많아요. 하지만 적극적으로 표현하진 못해요.",
        "BF":"메이",
        "WF":"피치"
    },
    "메이": {
        "img":"mei.jpg",
        "anime": "장메이, 꼬마마법사 레미",
        "line1" : "빠이빠이 폰포이 푸아푸아푸~~",
        "line2" : "빠이빠이 폰포이 부드럽게~",
        "personality" : "순하고 상냥하며, 조심스럽고 내향적인 성격을 갖고 있어요. 조곤조곤 말을 하고 차분해요.<br>관찰력이 좋고 눈치가 있는 편이에요. 근데 가끔 엉뚱하게 핀트를 못 잡을 때가 있어요.<br>귀엽고 아기자기한 걸 엄청 좋아해요. 껴안고 곁에 두고 싶어요.<br>자신의 의사를 똑바로 전달하지 못해 곤란할 때가 있어요. 부탁도 잘 거절 못하는 타입이에요.<br>그렇다고 이용할 생각은 NO! 속으로는 주관과 고집이 있어요.<br>낯을 가리지만, 주위 사람들을 잘 챙기고 소중히 여겨요.<br>예의를 지킬 줄 알고 배려가 있고 속이 깊어요.<br>정이 많아서 사람들과의 이별을 힘들어해요. 이별을 미리 걱정하기도 해요.<br>추억을 소중히 여겨요. 그리고 작은 일에도 감사하고 행복을 느껴요.",
        "BF":"레미",
        "WF":"아무"
    },
    "사랑": {
        "img":"sarang.jpg",
        "anime": "유사랑, 꼬마마법사 레미",
        "line1" : "사랑 사랑 참사랑",
        "line2" : "파멜 푸라루크 높이높이!",
        "personality" : "시원하고 맑은 푸른 바다 같아요. 터프하고 화끈한 면을 가졌어요.<br>친구에게 팩트폭력을 가하고, 거칠게 말할 때가 있어요. 하지만 뒤에서 후회하곤 해요.<br>바닷속을 알 수 없듯, 속깊은 고민이나 이야기를 잘 하지 않아요.<br>의젓하고 성숙하다는 소리를 들어요. 아픔을 잘 감내할 줄 알아요.<br>어중간 한 건 싫어요. 무슨 일이든 확실히 정해져야 의욕이 생겨요.<br>좋아하는 것에서는 약간 꼰대가 돼요! 날 따라야 제대로 즐길 수 있어요.<br>운동을 잘하고 활동적이에요.<br>의리를 중시해요. 으리으리한 의리! 의리를 못 지키는 친구에겐 불 같아요.<br>연애에 별 관심이 없고, 한다면 내가 좋아하는 사람이 좋아요.",
        "BF":"예리",
        "WF":"세라"
    },
    "피치": {
        "img":"peach.jpg",
        "anime": "웨딩 피치",
        "line1" : "???: 사랑에 빠진 자를 만나면 그 자를 반드시 없애라.",
        "line2" : "사랑의 멋짐을 모르는 당신은 불쌍해요.",
        "personality" : "밝고 명랑한 주인공 포지션! 항상 샤방샤방 빛이나요.<br>좀 엉뚱하고 단순한 면이 있어요. 그런 명랑함에 사람들이 놀라요.<br>상냥해서 사람들을 많이 챙겨요. 다만 그런 상냥함이 독이 될 때가 있어요.<br>사람에 대한 믿음을 갖고 있어요. 악당마저도 사랑을 통해 달라질 수 있어요!<br>성실하고 생활력, 자립심이 있어요. 자신의 생활 환경, 할 일을 잘 챙겨요.<br>단조롭지 않은, 모험적인 일을 즐겨요. 호기심이 있고 용기를 갖췄어요.<br>연애에 관심이 많고 사랑에 헌신적이에요. 사랑을 위해 어떠한 역경도 불사해요.",
        "BF":"바닐라",
        "WF":"레미"
    },
    "체리": {
        "img":"cherry.png",
        "anime": "카드캡터 체리",
        "line1" : "너와의 계약에 따라 체리가 명한다. 봉인해제!",
        "line2" : "호에~~~",
        "personality" : "낙천적이고 밝은 성격을 가졌어요. 몽글몽글한 성격으로 사람들을 끌어들여요.<br>주관이 세지 않아요. 그리고 기가 눌리면 말을 잘 못해요.<br>친한 사람이 짓궂게 굴어도 싸우거나 하지 않아요. 순둥순둥하고 관용적이에요.<br>가끔 우물쭈물하고 우유부단한 경향이 있어요.<br>마음이 약해서 주위 일들에 안타까워하고, 사람에게 상처를 주는 걸 많이 무서워해요.<br>유령이 무서워요. 그런 장난 치면 입을 봉인시킬거에요-☆<br>상대의 거짓말을 잘 구분 못해요. 순진하고 잘 믿어요.<br>낙천적인 성격을 가졌고 따뜻한 마음씨로 세상을 봐요.<br>여러 타입의 사람과도 잘 지낼 수 있어요. 자신을 잊지 않고 말이죠.<br>성숙하고 포용적이에요. 그리고 언쟁이 생겨도 언성을 잘 높이지 않아요.",
        "BF":"비키",
        "WF":"쇼콜라"
    },
    "중성마녀": {
        "img":"makaojoma.jpg",
        "anime": "짱구, 핸더랜드의 대모험",
        "line1" : "사이좋게 지내요.",
        "line2" : " ",
        "personality" : "마법소녀보다는 악당이 어울려요! 마법소녀? 그게모야-?",
        "BF":"중성마녀",
        "WF":"중성마녀"
    },
    "쇼콜라": {
        "img":"chocolat.png",
        "anime": "슈가슈가룬",
        "line1" : "말 안듣는 녀석들은 날려버린다!",
        "line2" : "슈가슈가룬 쇼코룬 당신의 하트를 픽업!",
        "personality" : "쿨하고 털털한 성격의 소유자! 시원시원하고 뒤끝이 없어요.<br>매사 당당하고 신념이 확고해요. 답답한 건 싫어요.<br>행동력이 강해서 바라는 일을 잘 이루어 내요.<br>문제 상황에서도 강단 있게 잘 대처해요. 크게 당황하거나 좌절하지는 않아요.<br>자기 주관과 고집이 센 편이에요. 주변 사람의 조언을 잘 듣지 않아요.<br>내 일에 간섭하는 사람 못 참아요. 내 삶은 내가 사는 거에요.<br>승부욕이 강해서 간단한 게임을 해도 이기고 싶어요. 사실 뭘 하든 기본은 하는걸요.<br>즉흥적인 면이 있고, 스릴 있는 활동도 즐겨요.<br>호불호가 강하고 사람한테도 호불호가 확실해요. 하지만 그런 만큼 사랑도 강해요.<br>연애에서 애매한 관계, 애매한 밀당은 싫어요. 애매하면 짤이에요.",
        "BF":"비키",
        "WF":"체리"
    },
    "바닐라": {
        "img":"vanilla.jpg",
        "anime": "슈가슈가룬",
        "line1" : "슈가슈가룬 바니룬 하트, 하트를 주시겠어요?",
        "line2" : "언제나 모두한테 사랑받는 사람은 모르는 일이야!",
        "personality" : "상냥하고 다정하고 순진한 성격이에요. 부드럽고 담백한 바닐라 아이스 같아요.<br>소극적이지만 친구를 위해 진심어린 말을 아끼지 않아요.<br>우정을 아끼고 진실한 사랑을 원해요. 영원한 우정과 사랑에 대한 동경이 있어요.<br>어떤 집단에서 주목받지 않는 건 상관없지만, 주위 사람들은 항상 관심을 놓지 않아 줬으면 해요.<br>외롭다는 감정에 약하고 겁이 많아요.<br>성실하고 책임감 있는 성격이에요. 재능이 있고 장점이 많아도 항상 겸손해요.<br>내면이 단단하지만 틀어지면 완전 변해요. 삐뚤어지기 전에 다들 잘 하도록 하세요.<br>안정감을 바래요. 집이 좋고, 오랜 친구를 보는 게 좋아요.<br>나를 믿어주고 지지해주는 사람이 있으면 누구보다도 일을 잘 할 수 있어요! 진짜로..!<br>경쟁, 싸움을 잘 즐기지 않아요. 다른 한 쪽의 아픔까지도 생각해요.",
        "BF":"피치",
        "WF":"비키"
    },
}


// 개발 편의를 위한 함수
function 임시초기화() {
    $(".page").hide();
    $(".start").show();
    $(".select-container").hide();
    

    // 결과창 확인할 때 사용
    // 결과창 이미지, 정보 채우기
    // var resultMaho ="유리";
    // $(".result").show();
    // $(".result_image").css("background-image", "url(" + result[resultMaho]["img"]+")");
    // $(".line1").html("\""+result[resultMaho]["line1"] + "\"<br>");
    // $(".line2").html("\"" + result[resultMaho]["line2"] + "\"");
    // $("#r_name").html(resultMaho);
    // $("#r_anima").html(result[resultMaho]["anime"]);
    // $(".r_text").html(result[resultMaho]["personality"]);

    // let BF = result[resultMaho]["BF"];
    // let WF = result[resultMaho]["WF"]
    // $("#BF-img").attr('src', result[BF]["img"]); $("#WF-img").attr('src', result[WF]["img"]);
    // $("#BF-img").attr('alt', BF); $("#WF-img").attr('alt', WF);
    // $("#BF").html(BF);
    // $("#WF").html(WF);
    // $(".start").hide();
    // $(".content").css('box-shadow','0px 0px 0px 0px');
}
임시초기화();

//progress-bar
const progressBar = (testNum)=>{
    const gauge = document.querySelector("#progress-bar-before");
    if (window.matchMedia("max-width:600px").matches){
        gauge.style.height = `${testNum * 72 / 10}vw`
    } else{
        gauge.style.height = `${testNum * 30 / 10}rem`

    }
}