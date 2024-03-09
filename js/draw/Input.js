import { DRAW_BOX_HEIGHT, DRAW_BOX_WIDTH, DRAW_CTX } from "./App.js";

const TEXT_INPUT = $('#text-input');
const TEXT_BTN = $('#text-btn');

const TEXT_PATH_LIST = [];
const BOX = $('#modify-zone');

let isDragging = false;
let movingTextIndex = -1;

export function input() {
    addEvent();
}

function addEvent() {
    TEXT_BTN.click(()=> {
        TEXT_INPUT.fadeIn();
    })

    TEXT_INPUT.on("keyup", drawTextInCanvas);

    BOX.on("mousedown", onMouseDown);
    BOX.on("mousemove", onMouseMove);
    BOX.on("mouseup", onMouseUp);

}

function drawTextInCanvas(e) {
    const KEY_CODE = e.keyCode;
    const TEXT = e.target.value;
    
    if(KEY_CODE !== 13) return;

    const PATH = new Path2D();

    PATH.rect(250, 40 - 18, 18 * TEXT.length, 18);
    TEXT_PATH_LIST.push(
        {
            text : TEXT,
            path2d : PATH,
            loc : {x:250, y: 40}
        }
    )

    drawing();

    e.target.value = "";
    TEXT_INPUT.fadeOut();
}

function onMouseDown({offsetX, offsetY}) {
    const CTX = DRAW_CTX;

    for(const index in TEXT_PATH_LIST) {
        const PATH = TEXT_PATH_LIST[index].path2d;
        if(CTX.isPointInPath(PATH, offsetX, offsetY)) {
            isDragging = true;
            movingTextIndex = index;
        }
    }
}

function onMouseMove({offsetX, offsetY}) {
    if(!isDragging) return;
    const CTX = DRAW_CTX;
    
    CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

    const MOVING_TEXT = TEXT_PATH_LIST[movingTextIndex];
    
    MOVING_TEXT.loc.x = offsetX;
    MOVING_TEXT.loc.y = offsetY;

    const PATH = new Path2D();
    PATH.rect(MOVING_TEXT.loc.x, MOVING_TEXT.loc.y - 18, 18 * MOVING_TEXT.text.length, 18);

    MOVING_TEXT.path2d = PATH;

    drawing();
}

function onMouseUp() {
    isDragging = false;
    movingTextIndex = -1;
}

function drawing() {
    const CTX = DRAW_CTX;
    CTX.font = "18px Arial";

    TEXT_PATH_LIST.forEach((text)=> {
        CTX.fillText(text.text, text.loc.x, text.loc.y);
    })
}