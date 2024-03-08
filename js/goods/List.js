import { getGoodsData } from "./App.js";

const GOODS_LIST_BOX = $('.goods-list');
const SORT_BTN = $('.chart-type-btn button');

let goods_list = [];

function drawList() {
    GOODS_LIST_BOX.html('');
    
    goods_list.forEach((goods)=> {
        GOODS_LIST_BOX.append(`
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="./resources/images/${goods.img}" alt="Card image cap" height="160">
                <div class="card-body">
                    <h5 class="card-title">${goods.title}</h5>
                    <p class="card-text">
                        가격 : ${goods.price}원 <br />
                        그룹 : ${goods.group} <br />
                        판매량 : ${goods.sale}개
                    </p>
                    <button class="btn btn-primary">수정제안</button>
                </div>
            </div>
        `)
    })

}

export async function goodsDataSort(category) {
    const GET_GOODS_LIST = await getGoodsData();

    goods_list = GET_GOODS_LIST.sort(function(a,b) {
        if(category == "sales_asc") {
            return a.sale - b.sale;
        } else if(category == "sales_desc") {
            return b.sale - a.sale;
        } else {
            return parseInt((b.price).replace(',')) - parseInt((a.price).replace(','));
        }
    })

    drawList();
}

export function sortAddEvent() {
    SORT_BTN.click((e)=> {
        goodsDataSort(e.target.dataset.type);
        SORT_BTN.removeClass('active');
        $(e.target).addClass('active')
    })
}