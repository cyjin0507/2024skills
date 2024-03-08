import { addEvent, dataSort } from "./Control.js";

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