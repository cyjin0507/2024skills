import { DRAW_BOX_HEIGHT, DRAW_BOX_WIDTH, DRAW_CTX } from "./App.js";
import { drawingText } from "./Input.js";

const UPLOAD_BTN = $('#image-add-btn');
const DELETE_BTN = $('#delete-btn');
let imageURL = "";

const IMG = new Image();

export let imageFileName = "";

export function upload() {
    addEvent();
}

function addEvent() {
    const CTX = DRAW_CTX;
    
    UPLOAD_BTN.on('change', getImageFiles);

    DELETE_BTN.click(()=> {
        imageURL = "";
        CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);

        IMG.src = "";
        drawingText();
    })
}

function getImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;

    console.log(files);

    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 7) {
            imageFileName = file.name;

            uploadFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                imageURL = e.target.result;
                drawImageInCanvas();
                UPLOAD_BTN.value = "";
            };
            reader.readAsDataURL(file);
        }
    });
}

function drawImageInCanvas() {
    const CTX = DRAW_CTX;
    CTX.clearRect(0,0,DRAW_BOX_WIDTH,DRAW_BOX_HEIGHT);
   
    IMG.src = imageURL;

    IMG.onload = () => {
        console.log(IMG);
        CTX.drawImage(IMG, 0, 0);
    }
}

export function redrawImage() {
    const CTX = DRAW_CTX;
    CTX.drawImage(IMG, 0, 0);
}