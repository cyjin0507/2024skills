const GOODS_LIST_BOX = $('.goods-list');
const SORT_BTN = $('.chart-type-btn button');
const GROUP_SELECT = $('#group-select');

let goods_list = [];
let group_type = "all";

export async function getGoodsData() {
    const VISITORS_DATA = await $.getJSON("./resources/json/goods.json");
    goods_list = VISITORS_DATA.data;
    goodsDataCategorySort("sales_desc");
}

function drawList() {
    GOODS_LIST_BOX.html('');
    
    let cnt = 0;

    goods_list.forEach((goods, index)=> {
        if(group_type != "all") {
            if(goods.group != group_type) {
                // 수정
                cnt++;
                return;
            }
        }

        GOODS_LIST_BOX.append(`
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="./resources/images/${goods.img}" alt="Card image cap" height="160">
                <div class="card-body">
                    <h5 class="card-title">${goods.title} <span style="color:red">${index - cnt <= 2 ? "BEST" : ""}</span></h5>
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

export async function goodsDataCategorySort(category) {

    goods_list = goods_list.sort(function(a,b) {
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
        goodsDataCategorySort(e.target.dataset.type);
        SORT_BTN.removeClass('active');
        $(e.target).addClass('active');
    })

    GROUP_SELECT.change((e)=> {
        group_type = e.target.value;
        drawList();
    })
}