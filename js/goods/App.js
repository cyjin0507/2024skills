import { goodsDataSort, sortAddEvent } from "./List.js";

function App() {
    goodsDataSort("sales_desc");
    sortAddEvent();
}

export async function getGoodsData() {
    const VISITORS_DATA = await $.getJSON("./resources/json/goods.json");
    return VISITORS_DATA.data;
}

window.onload = () => {
    App();
}