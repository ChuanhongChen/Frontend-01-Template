# Proxy

[MDN Prox](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## reactive

观察者模式: class based

reactive: 代理模式

## 组件设计

### 对象与组件

- 对象
  - Properties
  - Methods
  - Inherit

- 组件
  - Properties
  - Methods
  - Inherit
  - Attribute
  - Config & State
  - Event
  - Lifecycle
  - Children

### Component

### Attribute vs Property

#### 01

- Attribute 强调描述性
- Property 强调从属关系

'''
Attribute:
<my-component attribute=“v” />
myComponent.getAttribute(“a”)
myComponent.setAttribute(“a”,“value”);
Property:
myComponent.a = “value”;
'''

#### 02

'''
<a href="//m.taobao.com" ></div>
<script>
var a = document.getElementByTagName('a’); 
a.href // “http://m.taobao.com”，这个 URL 是 resolve 过的结果
a.getAttribute(‘href’) // “//m.taobao.com”，跟 HTML 代码中完全一致
</script>
'''

#### 03

'''
<input value = "cute" />
<script>
var input = document.getElementByTagName(‘input’); // 若 property 没有设置，
则结果是 attribute 
input.value // cute 
input.getAttribute(‘value’); // cute 
input.value = ‘hello’; // 若 value 属性已经设置，则 attribute 不变，property 变化，
元素上实际的效果是 property 优先
input.value // hello 
input.getAttribute(‘value’); // cute 
</script>
'''

## Lifecycle以vue为例

![Lifecycle](https://cn.vuejs.org/images/lifecycle.png)

## Children

Content 型 Children 与 Template 型 Children

'''
<my-button><img src=“{{icon}}”/>{{title}}</my-button>
<my-list>
<li><img src=“{{icon}}”/>{{title}}</li>
</my-list>
'''
