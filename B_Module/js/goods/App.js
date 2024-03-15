import { goodsDataCategorySort, sortAddEvent, getGoodsData } from "./List.js";

function App() {
    getGoodsData();
    sortAddEvent();
}



window.onload = () => {
    App();
}