const CHART_CANVAS = document.querySelector('#chart');
const CANVAS_WIDTH = CHART_CANVAS.width;
const CANVAS_HEIGHT = CHART_CANVAS.height;

// 미관상 캔버스 내에서도 차트 영역만 따로 잡기위해서 (라벨 자리가 없기 때문)
const CHART_WIDTH_LENGTH = CANVAS_WIDTH - 60;
const CHART_WIDTH_TRANSVERSE = CANVAS_WIDTH - 120;
const CHART_HEIGHT = CANVAS_HEIGHT - 60;

const CTX = CHART_CANVAS.getContext('2d');

const MAX_VALUE = 500;
const INCREASE_VALUE = 50;

const TOP_PADDING = 20;
const RIGHT_PADDING = 20;

let frame = 0;

let chartData = [];
let chartType = "length";

// 파라미터로 버튼 클릭하여 분류된(정제된) 데이터가 넘어와서 이 함수에서는 그려주기만 한다.
// canvas animation 핵심
export function chartAnimation() {
    if(frame >= 1) {
        frame = 0;
        return;
    }

    // 0.05 수치를 조절하여 속도제어 가능
    frame = Math.min(1, frame + 0.05);
    
    if(chartType === "length") {
        drawChartTypeLength();
    }  else {
        drawChartTypeTransverse();
    }

    requestAnimationFrame(chartAnimation);
}

// 그래프의 선을 그려주는 역할을 하는 함수
function drawLineTypeLength() {

    for(let i=MAX_VALUE; i>=0; i-=INCREASE_VALUE) {
        const LINE_Y_POS = CHART_HEIGHT * (MAX_VALUE-i) / MAX_VALUE + TOP_PADDING;

        CTX.beginPath();

        CTX.rect(CANVAS_WIDTH - CHART_WIDTH_LENGTH, LINE_Y_POS, CANVAS_WIDTH, 1);
        CTX.fill();

        CTX.font = "14px Arial";
        CTX.fillText(i, 10, LINE_Y_POS + 8);

        CTX.closePath();
    }
}

// 본격적으로 그래프를 그려주는 함수
function drawChartTypeLength() {
    const CHART_THICK = 58;

    // 객체로 넘어오게 되는데 편하게 사용하기 위해서 그냥 key,value값 따로 배열로 변환하여 사용
    // 0번째가 오후 6시, 1번째가 오후 10시가 된다.
    const KEY_DATA = Object.keys(chartData);
    const FIGURE_DATA = Object.values(chartData);

    CTX.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    for(const index in KEY_DATA) {
        const BAR_X_POS = CHART_WIDTH_LENGTH / (KEY_DATA.length + 1) * (parseInt(index) + 1);
        const BAR_HEIGHT = CHART_HEIGHT * FIGURE_DATA[index] / MAX_VALUE;

        CTX.beginPath();
        CTX.rect(BAR_X_POS, CHART_HEIGHT - (BAR_HEIGHT * frame) + TOP_PADDING, CHART_THICK, BAR_HEIGHT * frame);
        CTX.fill();
        CTX.closePath();

        CTX.fillText(KEY_DATA[index], BAR_X_POS, CANVAS_HEIGHT - 12);
    }

    // 이 함수를 따로 호출할까도 고민해봤는데 따로 호출하면 시간 라벨이 불필요하게 계속 그려지는 것을 해결할 수가 없기 때문에..
    drawLineTypeLength();
}

function drawLineTypeTransverse() {
    for(let i=MAX_VALUE; i>=0; i-=INCREASE_VALUE) {
        const LINE_X_POS = CHART_WIDTH_TRANSVERSE * (MAX_VALUE-i) / MAX_VALUE + (CANVAS_WIDTH - CHART_WIDTH_TRANSVERSE - RIGHT_PADDING);

        CTX.beginPath();

        CTX.rect(LINE_X_POS, TOP_PADDING, 1, CHART_HEIGHT);
        CTX.fill();

        CTX.font = "14px Arial";
        CTX.textAlign = "center";
        CTX.fillText(MAX_VALUE - i, LINE_X_POS, CANVAS_HEIGHT - 20);
        CTX.textAlign = "left";

        CTX.closePath();
    }
}

function drawChartTypeTransverse() {
    const CHART_THICK = 58;

    // 객체로 넘어오게 되는데 편하게 사용하기 위해서 그냥 key,value값 따로 배열로 변환하여 사용
    // 0번째가 오후 6시, 1번째가 오후 10시가 된다.
    const KEY_DATA = Object.keys(chartData);
    const FIGURE_DATA = Object.values(chartData);

    CTX.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);


    for(const index in KEY_DATA) {
        const BAR_Y_POS = CHART_HEIGHT / (KEY_DATA.length + 1) * (parseInt(index) + 1);
        const BAR_WIDTH = CHART_WIDTH_TRANSVERSE * FIGURE_DATA[index] / MAX_VALUE;

        CTX.beginPath();
        CTX.rect(CANVAS_WIDTH - CHART_WIDTH_TRANSVERSE - RIGHT_PADDING, BAR_Y_POS, BAR_WIDTH * frame, CHART_THICK);
        CTX.fill();
        CTX.closePath();

        CTX.font = "14px Arial"
        CTX.fillText(KEY_DATA[index], 20, BAR_Y_POS + (CHART_THICK / 2 + 5));
    }

    // 이 함수를 따로 호출할까도 고민해봤는데 따로 호출하면 시간 라벨이 불필요하게 계속 그려지는 것을 해결할 수가 없기 때문에..
    drawLineTypeTransverse();
}

export function setChartData(data) {
    chartData = data;
    chartAnimation();
    drawChartTable();
}

export function setChartType(type) {
    chartType = type;
    chartAnimation();
}

const TABLE = $('.chart');

// 추가된 부분
function drawChartTable() {
    console.log(chartData);
    TABLE.html('')

    const KEY_DATA = Object.keys(chartData);
    const VALUE_DATA = Object.values(chartData);

    KEY_DATA.forEach((data, index)=> {
        TABLE.append(`
            <tr>
                <td>${data}</td>
                <td>${VALUE_DATA[index]}</td>
            </tr>
        `)
    })
}