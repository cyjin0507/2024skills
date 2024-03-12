import { DRAW_BOX_HEIGHT, DRAW_BOX_WIDTH, DRAW_CTX } from "./App.js";
import { redrawImage } from "./Upload.js";

const TEXT_INPUT = $('#text-input');
const TEXT_BTN = $('#text-btn');
const RESET_BTN = $('#reset-btn');

const TEXT_PATH_LIST = [];
const BOX = $('#modify-zone');

let isDragging = false;
let movingTextIndex = -1;

let isPressingCTRLKey = false;

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
    window.addEventListener("keyup", onKeyUp);

    RESET_BTN.click(reset)
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
            loc : {x:250, y: 40},
            degree: 0,
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

        redrawImage();
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

    TEXT_PATH_LIST.forEach(data=> {
        const WIDTH = data.text.length * 18 + 8;
        const HEIGHT = 24;
        CTX.translate(data.loc.x + .5 * WIDTH, data.loc.y + .5 * HEIGHT);
        CTX.rotate(calcRadian(data.degree));
        CTX.fillText(data.text, -.5*WIDTH, -.5*HEIGHT, WIDTH, HEIGHT);
        CTX.rotate(calcRadian(data.degree) * -1);
        CTX.translate((data.loc.x + .5 * WIDTH) * -1, (data.loc.y + .5 * HEIGHT) * -1);
    })
}

// 점선 그려주는 함수
function drawingOutline() {
    const CTX = DRAW_CTX;
    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    const WIDTH = MOVING_TEXT.text.length * 18 + 8;
    const HEIGHT = 24;

    CTX.setLineDash([5]);
    CTX.beginPath();

    CTX.translate(MOVING_TEXT.loc.x + .5 * WIDTH, MOVING_TEXT.loc.y + .5 * HEIGHT);
    CTX.rotate(calcRadian(MOVING_TEXT.degree));

    CTX.rect(-.5*WIDTH - 5, -5.*HEIGHT + 90, WIDTH, HEIGHT);

    CTX.rotate(calcRadian(MOVING_TEXT.degree) * -1);
    CTX.translate((MOVING_TEXT.loc.x + .5 * WIDTH) * -1, (MOVING_TEXT.loc.y + .5 * HEIGHT) * -1);

    CTX.stroke();
    CTX.closePath();
}

// drawing 함수 총 집합체
function drawingRepetition() {
    const CTX = DRAW_CTX;
    CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    const PATH = new Path2D();

    if(MOVING_TEXT.degree == 0) {
        PATH.rect(MOVING_TEXT.loc.x - 4, MOVING_TEXT.loc.y - 19, MOVING_TEXT.text.length * 18 + 8, 24);
    } else if(MOVING_TEXT.degree == 180) {
        PATH.rect(MOVING_TEXT.loc.x + 4, MOVING_TEXT.loc.y + 19, MOVING_TEXT.text.length * 18 + 8, 24);            
    } else if(MOVING_TEXT.degree == 90) {
        PATH.rect(MOVING_TEXT.loc.x + 50, MOVING_TEXT.loc.y - 45, 28, MOVING_TEXT.text.length * 18 + 8);
    } else if(MOVING_TEXT.degree == 270) {
        PATH.rect(MOVING_TEXT.loc.x + 20, MOVING_TEXT.loc.y - 30, 28, MOVING_TEXT.text.length * 18 + 8);
    }

    MOVING_TEXT.path2d = PATH;

    redrawImage();
    drawingOutline();
    drawingText();
}

// 방향키 인식 함수
function onKeyDown(e) {
    e.preventDefault();
    if(movingTextIndex == -1) return

    const KEY_CODE = e.keyCode;

    movingTextByDirectionKey(KEY_CODE);
    rotateText(KEY_CODE);

    drawingRepetition();
}

function onKeyUp(e) {
    if(movingTextIndex == -1) return
    const KEY_CODE = e.keyCode;

    if(KEY_CODE == 17) {
        isPressingCTRLKey = false;
    }
}

function movingTextByDirectionKey(keyCode) {
    if(isPressingCTRLKey) return

    // 위 : 38 / 아래 : 40 / 왼 : 37 / 오 : 39

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];
    
    // if문은 캔버스 이탈방지
    if(keyCode == 38) {
        if(MOVING_TEXT.loc.y - 4 <= 18) {
            MOVING_TEXT.loc.y = 18;
            return;
        }
        MOVING_TEXT.loc.y -= 4;
    } else if(keyCode == 40) {
        if(MOVING_TEXT.loc.y + 4 >= DRAW_BOX_HEIGHT) {
            MOVING_TEXT.loc.y = DRAW_BOX_HEIGHT;
            return;
        }
        MOVING_TEXT.loc.y += 4;
    } else if(keyCode == 37) {
        if(MOVING_TEXT.loc.x <= 0) {
            MOVING_TEXT.loc.x = 0;
            return;
        }
        MOVING_TEXT.loc.x -= 4;
    } else if(keyCode == 39) {
        if(MOVING_TEXT.loc.x >= DRAW_BOX_WIDTH - (MOVING_TEXT.text.length * 18)) {
            MOVING_TEXT.loc.x = DRAW_BOX_WIDTH - (MOVING_TEXT.text.length * 18);
            return;
        }
        MOVING_TEXT.loc.x += 4;
    }
}

function rotateText(keyCode) {
    if(keyCode == 17) {
        isPressingCTRLKey = true;
    }
    if(!isPressingCTRLKey || keyCode != 37) return

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];

    MOVING_TEXT.degree += 90;
    if(MOVING_TEXT.degree >= 360) MOVING_TEXT.degree = 0;
}

function calcRadian(degree) {
    return degree * Math.PI / 180;
}

function reset() {
    TEXT_PATH_LIST.length = 0;
    movingTextIndex = -1;

    const CTX = DRAW_CTX;
    CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

    redrawImage();
}