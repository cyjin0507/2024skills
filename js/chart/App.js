import { addEvent, dataSort } from "./Control.js";
import { setChartData, chartAnimation, drawLine } from "./Draw.js";

function App() {
    dataSort();

    addEvent();
}

export async function getChartData() {
    const VISITORS_DATA = await $.getJSON("./resources/json/visitors.json");
    return VISITORS_DATA;
}

window.onload = () => {
    App();
}