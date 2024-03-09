import { DRAW_BOX_HEIGHT, DRAW_BOX_WIDTH, DRAW_CTX } from "./App.js";
import { drawingText } from "./Input.js";

const UPLOAD_BTN = $('#image-add-btn');
const RESET_BTN = $('#reset-btn');
let imageURL = "";

export function upload() {
    addEvent();
}

function addEvent() {
    const CTX = DRAW_CTX;
    
    UPLOAD_BTN.on('change', getImageFiles);

    RESET_BTN.click(()=> {
        imageURL = "";
        CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

        drawingText();
    })
}

function getImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;


    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 7) {
            uploadFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                imageURL = e.target.result;
                drawImageInCanvas();
            };
            reader.readAsDataURL(file);
        }
    });
}

export function drawImageInCanvas() {
    const CTX = DRAW_CTX;
    const IMG = new Image();
    IMG.src = imageURL;

    CTX.drawImage(IMG, 100, 100);
}