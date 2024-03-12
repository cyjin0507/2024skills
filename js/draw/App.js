import { input } from "./Input.js";
import { upload } from "./Upload.js";

export const DRAW_BOX = document.querySelector('#draw-box');
export const DRAW_CTX = DRAW_BOX.getContext('2d');

export const DRAW_BOX_WIDTH = DRAW_BOX.width;
export const DRAW_BOX_HEIGHT = DRAW_BOX.height;

function App() {
    input();
    upload();

    // var x = 100;
    // var y = 100;
    // var degree = 100;
   
    // var width = 30;
    // var height = 30;
    // var radian = degree * Math.PI / 180;
    // DRAW_CTX.fillStyle = "red";
    // console.log(radian);

    // for(let i=0; i<4; i++) {
    //     DRAW_CTX.translate(x + .5 * width, y + .5 * height);
    //     DRAW_CTX.rotate(radian);
    //     DRAW_CTX.fillRect(-.5*width, -.5*height, width, height);
    //     DRAW_CTX.fill();
    //     DRAW_CTX.rotate(radian * -1);
    //     DRAW_CTX.translate((x + .5 * width) * -1, (y + .5 * height) * -1);
    // }
}

window.onload = () => {
    App();
}