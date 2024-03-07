// import { getJSON } from "../util/Util.js";

import { setChartData, chartAnimation, drawLine } from "./Draw.js";

async function App() {
    const VISITORS_DATA = await $.getJSON("./resources/json/visitors.json");
    
    // drawLine();
    setChartData(VISITORS_DATA.data[1].visitors[0].visitor);
    requestAnimationFrame(chartAnimation)
}



window.onload = () => {
    App();
}