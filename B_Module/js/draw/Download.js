import { imageFileName } from "./Upload.js";

const DOWNLOAD_BTN = $('#download-btn');

// 이건 뭐 설명할게 없는듯
export function download() {
    DOWNLOAD_BTN.click(()=> {
        const IMAGE_FILE_NAME = imageFileName;

        const a = document.createElement("a");

        let image = document.getElementById("draw-box")
            .toDataURL("image/png")
        a.setAttribute("href", image);
        a.setAttribute("download", IMAGE_FILE_NAME);
    
        a.click();
    })
}