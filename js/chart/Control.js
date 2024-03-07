import { getChartData } from "./App.js";
import { setChartData } from "./Draw.js";

const LEAGUE_BTN = $('.league-btn button');
const DAY_BTN = $('.day-btn button');

let league = "나이트리그";
let day = "월";

export function addEvent() {
    LEAGUE_BTN.click(changeLeague);
    DAY_BTN.click(changeDay);
}

function changeLeague(e) {
    league = e.target.dataset.league;
    dataSort();

    LEAGUE_BTN.removeClass('active')
    $(e.target).addClass('active')
}

function changeDay(e) {
    day = e.target.dataset.day;
    dataSort();

    DAY_BTN.removeClass('active')
    $(e.target).addClass('active')
}

export async function dataSort() {
    const VISITORS_DATA = await getChartData();
    const SORT_DATA = VISITORS_DATA.data.find(data=>data.name==league).visitors.find(data=>data.day==day).visitor;

    setChartData(SORT_DATA);
}