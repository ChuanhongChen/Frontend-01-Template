# 重学 CSS

## 动画与绘制

### Animation

- @keyframes 定义 【关键帧】
- animation: 使用

```css
@keyframes mykf {
    from { background: red; }
    to { background: blue; }
}
div {
    animation: mykf 5s infinite;
}
```

#### Property

- animation-name 时间曲线（@keyframes 定义的关键帧）
- animation-druation 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延迟
- animation-iteration-count 动画的播放次数
- animation-direction 动画的方向

```css
@keyframes mykf2 {
  from { top: 0; transition:top ease}
  50% { top: 30px;transition:top ease-in }
  75% { top: 10px;transition:top ease-out }
  to { top: 0; transition:top linear}
}
```

### Transition

- transition-property 要变换的属性
- transition-duration 变换的时长
- transition-timing-function 时间曲线
- transition-delay 延迟

### cubic-bezier

[贝塞尔曲线](http://cubic-bezier.com)  

推荐使用 `ease` 曲线

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Simulation</title>
    <style>
    	.ball {
          width:10px;
          height:10px;
          background-color:black;
          border-radius:5px;
          position:absolute;
          left:0;
          top:0;
          transform:translateY(180px);
        }
  	</style>
</head>
<body>
    <label>运动时间：<input value="3.6" type="number" id="t" />s</label><br/>
    <label>初速度：<input value="-21" type="number" id="vy" /> px/s</label><br/>
   	<label>水平速度：<input value="21" type="number" id="vx" /> px/s</label><br/>
    <label>重力：<input value="10" type="number" id="g" /> px/s²</label><br/>
    <button onclick="createBall()">来一个球</button>
    <script>
    	function generateCubicBezier (v, g, t){
            var a = v / g;
            var b = t + v / g;

            return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
                [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];
        }

        function createBall() {
            var ball = document.createElement("div");
            var t = Number(document.getElementById("t").value);
            var vx = Number(document.getElementById("vx").value);
            var vy = Number(document.getElementById("vy").value);
            var g = Number(document.getElementById("g").value);
            ball.className = "ball";
            document.body.appendChild(ball)
            ball.style.transition = `left linear ${t}s, top cubic-bezier(${generateCubicBezier(vy, g, t)}) ${t}s`;
            setTimeout(function(){ 
                ball.style.left = `${vx * t}px`; 
                ball.style.top = `${vy * t + 0.5 * g * t * t}px`; 
            }, 100);
            setTimeout(function(){ document.body.removeChild(ball); }, t * 1000);
        }
    </script>
</body>
</html>
```

## 渲染与颜色

### 颜色

#### CMYK 和 RGB

#### HSL 和 HSV

Hue  色相

Saturation  纯度

Lightness  明度

value  色值

### 形状

- border
- box-shadow
- border-radius

CSS 属性不要滥用，不要用 border 等去写三角形、五角星等可以用矢量图来表示的图形，可以使用 **data uri + svg** 来画任何矢量图形。



> CSS Property 分类【见脑图】



----

# 重学 HTML

## HTML 的定义： XML 与 SGML

- DTD 与 XML namespace

  [DTD](http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)

  ​	[xhtml-lat1.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml1-lat1.ent)

  ​	`&nbsp;`  `\u00A0`

  ​	`no-break space` 不间断空格，任何 HTML 中都不推荐使用 `&nbsp;` 代替 `white-space`，推荐使用以下解决方案：

  ```html
  <pre>hello                    world</pre>
  <div style="white-space: pre-wrap;">hello        中国</div>
  ```

  ​	[xhtml-symbol.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent)

  ​	`&lambda;`  &lambda;  `\u03BB`

  ​	[xhtml-special.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent)

  ​	<font color="#ff3333">应知应会</font>

  | Entity |        |   HTML   | JavaScript |
  | :----: | :----: | :------: | :--------: |
  |  quot  | &quot; | `&quot;` |  `\u0022`  |
  |  amp   | &amp;  | `&amp;`  |  `\u0026`  |
  |   lt   |  &lt;  |  `&lt;`  |  `\u003c`  |
  |   gt   |  &gt;  |  `&gt;`  |  `\u003e`  |

  [XML](http://www.w3.org/1999/xhtml)

## HTML 标签 - 语义

可参考 [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/sections.html)

| Tag     | Description                                                  |
| ------- | ------------------------------------------------------------ |
| header  | 通常出现在前部，表示导航或者介绍性的内容。                   |
| nav     | 导航链接的部分。                                             |
| aside   | 表示跟文章主体不那么相关的部分，它可能包含导航、广告等工具性质的内容。 |
| article | 它表示具有一定独立性质的文章。                               |
| main    | 整个页面只出现一个，表示页面的主要内容，可以理解成特殊的 div。 |
| section | 一个文档或应用程序的通用部分。                               |
| time    | 时间                                                         |
| address | 表示“文章（作者）的联系方式”，address 明确地只关联到 article 和 body。 |
| footer  | 通常出现在尾部，包含一些作者信息、相关链接、版权信息等。     |

## HTML 语法

### 合法元素

- Element：<tagName>......</tagName>
- Text：text
- Comment：<!-- Comments -->
- DocumentType：<!Doctype html>
- ProcessingInstruction：<?a 1?>
- CDATA：<![CDATA[]]>

### 字符引用

- lt
- gt
- quot
- amp



------



# 重学 DOM

## DOM

[W3C]()

### Node

- Element：元素型节点，跟标签对应。namespace 划分
  - HTMLElement
  - SVGElement
  - ...
- Document：文档根节点
- CharacterDate：字数数据
  - Text：文本节点
  - Comment：注释
  - ProcessingInstruction：处理信息
- DocumentFragment：文档片段 ---- 批量添加处理元素
- DocumentType：文档类型

### 导航类操作

|   Node (推荐)   |        Element         |
| :-------------: | :--------------------: |
|   parentNode    |     ParentElement      |
|   childNodes    |        children        |
|   firstChild    |   firstElementChild    |
|    lastChild    |    lastElementChild    |
|   nextSibling   |   nextElementSibling   |
| previousSibling | previousElementSibling |

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

> *tips*

**所有的 DOM 元素默认只有一个父元素，不能两次被插入到 DOM trees 中，同一个节点先插入到 DOM trees 中 A 位置，再插入到 B 位置，会默认从 A 位置 remove 掉。**

**childNodes 是一个 living Collection，执行 removeChild 或者其他修改操作后，childNodes 会实时改变。**

### 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数。
- contains 检查一个节点是否包含另一个节点的函数。
- isEqualNode 检查两个节点是否完全相同。
- isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用 `===`。
- cloneNode 复制一个节点，如果传入参数为 `true`，则会连同子元素做深拷贝。

## Events

- addEventListener

  - type 事件名称

  - listener 事件处理函数

    > 事件处理函数不一定是函数，也可以是个 JavaScript 具有 handleEvent 方法的对象。

    ```js
    var o = {
      handleEvent: event => console.log(event)
    };
    document.body.addEventListener("keydown", o, false);
    ```

  - useCapture 捕获冒泡（`true`|`false`）/ options 

    - once：只执行一次。
    - passive：承诺此事件监听不会调用 preventDefault，这有助于性能。
    - useCapture：是否捕获（否则冒泡）。

    ```html
    <div id="a" style="width: 500px; height: 300px; background-color: pink;">
        <div id="b" style="width: 500px; height: 200px; background-color: aqua;"></div>
    </div>
    <script>
    	let a = document.getElementById("a");
        let b = document.getElementById("b");
        a.addEventListener("click", function() {
            console.log("a >>> 捕获");
        }, true);
        a.addEventListener("click", function() {
            console.log("a >>> 冒泡");
        }, false);
        b.addEventListener("click", function() {
            console.log("b >>> 捕获");
        }, true);
        b.addEventListener("click", function() {
            console.log("b >>> 冒泡");
        }, false);
        /*
         a >>> 捕获
         b >>> 捕获
         b >>> 冒泡
         a >>> 冒泡
        */ 
    </script>
    ```

    [capture](https://github.com/angleecn/relearningFE/issues/3)

    当我们点击一个元素时，首先拿到的是坐标，从外到里捕获，直到找到 EventTarget，从里到外冒泡。

