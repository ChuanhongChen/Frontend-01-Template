// 获取container下所有节点
const list = document.getElementById("container").children

const result = []
for (let i of list) {
    // 根据data-tag筛选出css标准
    if (i.getAttribute('data-tag').match(/css/)) {
        result.push({
            name: i.children[1].innerText,
            url: i.children[1].children[0].href
        })
    }
}

let iframe = document.createElement("iframe");
document.body.innerHTML = "";
document.body.appendChild(iframe);
// 收集 CSS 属性相关标准
function happen(element, event) {
    return new Promise(function (resolve) {
        let handler = () => {
            resolve();
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler);
    })
}

void async function () {
    for (let standard of standards) {
        iframe.src = standard.url;
        console.log(standard.name);
        await happen(iframe, "load");
    }
}();