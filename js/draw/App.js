import { download } from "./Download.js";
import { input } from "./Input.js";
import { upload } from "./Upload.js";

export const DRAW_BOX = document.querySelector('#draw-box');
export const DRAW_CTX = DRAW_BOX.getContext('2d');

export const DRAW_BOX_WIDTH = DRAW_BOX.width;
export const DRAW_BOX_HEIGHT = DRAW_BOX.height;

function App() {
    input();
    upload();
    download();
}

window.onload = () => {
    App();
}