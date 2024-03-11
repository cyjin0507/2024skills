import { DRAW_BOX_HEIGHT, DRAW_BOX_WIDTH, DRAW_CTX } from "./App.js";
import { drawImageInCanvas } from "./Upload.js";

const TEXT_INPUT = $('#text-input');
const TEXT_BTN = $('#text-btn');

const TEXT_PATH_LIST = [];
const BOX = $('#modify-zone');

let isDragging = false;
let movingTextIndex = -1;

// App에서 호출
export function input() {
    addEvent();
}

function addEvent() {
    // 글상자버튼 클릭하면 인풋 생성
    TEXT_BTN.click(()=> {
        TEXT_INPUT.fadeIn();
    })

    // 엔터 인식해서 텍스트를 캔버스에 그려줌
    TEXT_INPUT.on("keyup", drawTextInCanvas);

    BOX.on("mousedown", onMouseDown);
    BOX.on("mousemove", onMouseMove);
    BOX.on("mouseup", onMouseUp);

    // 방향키 이벤트
    window.addEventListener("keydown", onKeyDown);

}

// 텍스트를 캔버스에 그려주는 함수
function drawTextInCanvas(e) {
    const KEY_CODE = e.keyCode;
    const TEXT = e.target.value;

    // 엔터가 아니면 실행 안함
    if(KEY_CODE !== 13) return;

    const PATH = new Path2D();

    PATH.rect(250, 40 - 18, 18 * TEXT.length, 18);
    TEXT_PATH_LIST.push(
        {
            text : TEXT,
            path2d : PATH,
            // 기본값
            loc : {x:250, y: 40}
        }
    )

    drawingText();

    e.target.value = "";
    TEXT_INPUT.fadeOut();
}

function onMouseDown({offsetX, offsetY}) {
    const CTX = DRAW_CTX;

    for(const index in TEXT_PATH_LIST) {
        const PATH = TEXT_PATH_LIST[index].path2d;
        if(CTX.isPointInPath(PATH, offsetX, offsetY)) {
            // 현재 드래그 중임을 인식함
            isDragging = true;
            // 어떤 인덱스의 요소를 드래그 중인지 저장
            movingTextIndex = index;

            drawingOutline();
        }
    }

    // 글자 외의 다른 캔버스 공간 클릭시 점선 해제
    if(!isDragging) {
        movingTextIndex = -1;

        CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

        drawImageInCanvas();
        drawingText();
    }
}

function onMouseMove({offsetX, offsetY}) {
    if(!isDragging) return;

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    // 캔버스 공간 내 이탈 방지
    if(offsetX <=0 || offsetX + (MOVING_TEXT.text.length * 18) >= DRAW_BOX_WIDTH
        || offsetY <= 18 || offsetY >= DRAW_BOX_HEIGHT) return;

    // 드래그 할때마다 계속해서 x,y 값 업데으트
    MOVING_TEXT.loc.x = offsetX;
    MOVING_TEXT.loc.y = offsetY;

    // 중복되는 drawing 관련 코드 종합체 함수
    drawingRepetition();
}

// 드래그 종료
function onMouseUp() {
    isDragging = false;
}


// 텍스트만 그려주는 함수
export function drawingText() {
    const CTX = DRAW_CTX;
    // font는 자간 일정 폰드면 상관없음 (Arial X) 왜냐면 자간이 다르면 가로 계산이 어려움
    CTX.font = "18px Dejavu Sans Mono";

    TEXT_PATH_LIST.forEach((text, index)=> {
        CTX.fillText(text.text, text.loc.x, text.loc.y);
    })
}

// 점선 그려주는 함수
function drawingOutline() {
    const CTX = DRAW_CTX;
    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    CTX.setLineDash([5]);
    CTX.beginPath();
    CTX.rect(MOVING_TEXT.loc.x - 4, MOVING_TEXT.loc.y - 19, MOVING_TEXT.text.length * 18 + 8, 24);
    CTX.stroke();
    CTX.closePath();
}

// drawing 함수 총 집합체
function drawingRepetition() {
    const CTX = DRAW_CTX;
    CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    const PATH = new Path2D();
    PATH.rect(MOVING_TEXT.loc.x - 4, MOVING_TEXT.loc.y - 19, MOVING_TEXT.text.length * 18 + 8, 24);

    MOVING_TEXT.path2d = PATH;

    drawImageInCanvas();
    drawingOutline();
    drawingText();
}

// 방향키 인식 함수
function onKeyDown(e) {
    e.preventDefault();
    if(movingTextIndex == -1) return

    const KEY_CODE = e.keyCode;
    // 위 : 38 / 아래 : 40 / 왼 : 37 / 오 : 39

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];
    
    // if문은 캔버스 이탈방지
    if(KEY_CODE == 38) {
        if(MOVING_TEXT.loc.y - 4 <= 18) {
            MOVING_TEXT.loc.y = 18;
            return;
        }
        MOVING_TEXT.loc.y -= 4;
    } else if(KEY_CODE == 40) {
        if(MOVING_TEXT.loc.y + 4 >= DRAW_BOX_HEIGHT) {
            MOVING_TEXT.loc.y = DRAW_BOX_HEIGHT;
            return;
        }
        MOVING_TEXT.loc.y += 4;
    } else if(KEY_CODE == 37) {
        if(MOVING_TEXT.loc.x <= 0) {
            MOVING_TEXT.loc.x = 0;
            return;
        }
        MOVING_TEXT.loc.x -= 4;
    } else if(KEY_CODE == 39) {
        if(MOVING_TEXT.loc.x >= DRAW_BOX_WIDTH - (MOVING_TEXT.text.length * 18)) {
            MOVING_TEXT.loc.x = DRAW_BOX_WIDTH - (MOVING_TEXT.text.length * 18);
            return;
        }
        MOVING_TEXT.loc.x += 4;
    }

    drawingRepetition();
}