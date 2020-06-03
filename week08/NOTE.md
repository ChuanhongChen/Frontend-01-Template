## CSS 选择器语法

### 简单选择器
- \*
- div svg|a
	- [SVG](http://www.w3.org/2000/svg)

		```html
		<!DOCTYPE html>
		<html>
		<head>
		  <meta charset="utf-8">
		  <title>namespace 用法</title>
		</head>
		<body>
		<svg width="100" height="28" viewBox="0 0 100 28" version="1.1"
		     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		  <desc>描述</desc>
		  <a xlink:href="http://www.w3.org">
		    <text y="100%">文本</text>
		  </a>
		</svg>
		<br/>
		<a href="javascript:void 0;">超链接</a>
		</body>
		</html>
		```
		```CSS
		@namespace svg url(http://www.w3.org/2000/svg);
		@namespace html url(http://www.w3.org/1999/xhtml);
		svg|a {
		  stroke:blue;
		  stroke-width:1;
		}
		
		html|a {
		  font-size:40px
		}
		```
- .class
- \#id
- [attr=value]
	- [attr]
		- 直接在方括号中放入属性名，是检查元素是否具有这个属性，只要元素有这个属性，不论属性是什么值，都可以被选中
	- [attr=val]
		- 精确匹配，检查一个元素属性的值是否是 val
	- [att~=val1 val2]
		- 多项匹配，检查一个元素的值是否是若干值之一，这里的 val 不是一个单一的值了，可以是用空格分隔的一个序列
	- [att|=val]
		- 开头匹配，检查一个元素的值是否是以 val 开头，它跟精确匹配的区别是属性只要以 val 开头即可，后面内容随意
- :hover
- ::before


### 复合选择器
- &lt;简单选择器&gt;&lt;简单选择器&gt;&lt;简单选择器&gt;
- \* 或者 div 必须写在最前面

### 复杂选择器
- &lt;复合选择器&gt;&lt;sp&gt;&lt;复合选择器&gt;
	- 子孙
	- 后代，表示选中所有符合条件的后代节点
- &lt;复合选择器&gt;">"&lt;复合选择器&gt;
	- 子选择器，只能选择子一级
	- 子代，表示选中符合条件的子节点
- &lt;复合选择器&gt;"~"&lt;复合选择器&gt;
	- sibling
	- 后继，表示选中所有符合条件的后继节点，后继节点即跟当前节点具有同一个父元素，并出现在它之后的节点
- &lt;复合选择器&gt;"+"&lt;复合选择器&gt;
	- sibling
	- 直接后继，表示选中符合条件的直接后继节点，直接后继节点即 nextSlibling
- &lt;复合选择器&gt;"||"&lt;复合选择器&gt;
	- selectors-4
	- table 里选中一列
	- 列选择器，表示选中对应列中符合条件的单元格
	
### 选择器列表
- 以 逗号 分隔的复杂选择器序列

## 选择器优先级
- [图解 css-specificity](http://www.standardista.com/css3/css-specificity/)
- [w3 css-specificity](https://www.w3.org/TR/2018/WD-selectors-4-20181121/#specificity-rules)
- [MDN css-specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- 结论：**[ inline-element,    id,    class | pseudo | attr,    type ]
:not 伪类不参与计算**
- exercise
	- div#a.b .c[id=x]
		- [0,1,3,1]
	- \#a:not(#b)
		- [0,2,0,0]
	- *.a
		- [0,0,1,0]
	- div.a
		- [0,0,1,1]

## 伪类
### 链接/行为
- :any-link
- :link :visited
- :hover
- :active
- :focus
- :target

### 树结构
- :empty
- :nth-child()
- :nth-last-child()
- :first-child :last-child :only-child

### 逻辑型
- :not 伪类
- :where :has

## 伪元素
- ::before
- ::after
- ::first-line
	- 元素的第一行
	- first-line 若有 float ，则会脱离文档流出去，然后又选中第一行，又脱离文档流出去，如此反复形成自指悖论了
- ::first-letter
	- 元素的第一个字母

## 优化 toy-browser CSS selector match
- 首先我们可以先观察
	- toy-browser 是根据 space 拆分选择器的。那么选择器我们需要处理特殊情况只有 
		- \#id.cls1.cls2.cl3
		- .cls1\#id.cls2
		- div.cls1.cls2
		- .cls1.cls2
	- 类型选择器有且只有一个（一对起止标签，一个类型上只能有一个唯一 id，表示一个元素）
	- id选择器有且只有一个（一对起止标签，即一个类型，表示一个元素）
		- 因为没有标识符，只能出现在开头
		- div.cls1.cls2
		- 不可能为
			- .cls1div.cls2
	- class 选择器可以有多个
- 所以我们可以第一步，先处理 id 选择器 + 类型选择器特殊情况
	
	```javascript
	function match(element, selector) {
	  if (!selector || !element.attributes) 
	    return false
	
	  let regId = /(#\w+)+/g
	  let resId = selector.match(regId)
	  
	  if (resId && resId[0].charAt(0) == "#") { // id选择器有标识符#，因此可以出现在任意位置，需要用正则去匹配
	    const attr = element.attributes.filter(attr => attr.name === "id")[0]
	    if (attr && attr.value === resId[0].replace("#", '')) {
	      return true
	    } else {
	      return false
	    }
	  } else if(selector.charAt(0) !== "#" && selector.charAt(0) !== "."){ // 只需要判断选择器开头是不是 非 id 选择器标识符 # 或者 class 选择器标识符 .
	    if (element.tagName === selector) {
	      return true
	    } else {
	      return false
	    }
	  }
	}

	```
- 处理多 class 选择器情况

	```javascript

	function match(element, selector) {
	
     // some code ...
	
	  let regClass = /(\.\w+)+/g
	  let resClass = selector.match(regClass)
	
     // some code ...
     
	
	  if (resClass) {
	    let resClassArr = [] // style class selector数组
	    for (let i = 0; i < resClass.length; i ++) { // 处理 .cls1#id.cls2 匹配出来 [".cls1", ".cls2"] 情况
	      let tempArr = resClass[i].split('.')	      for (let j = 1; j < tempArr.length; j ++) { // 索引从1开始，因为 ["", "cls1", "cls2"]
	        resClassArr.push(tempArr[j])
	      }
	    }
	    let classAttr = element.attributes.filter(attr => attr.name === "class")
	    let classAttrRes = []
	    // 元素 attr class 数组，classAttr:  [ { name: 'class', value: 'c2 c3' } ]
	    if (classAttr && classAttr[0]) {
	      classAttrRes = classAttr[0]["value"].split(" ")
	    }
	    let tempFlag = null
	    for (let i = 0; i < resClassArr.length; i ++) {
	      tempFlag = false
	      let k = 0
	      for (; k < classAttrRes.length; k ++) {
	        if (classAttrRes[k] === resClassArr[i]) { // 拿 style class selector 与 element class attribute 进行比较
	          tempFlag = true
	          break
	        }
	      }
	      if (!tempFlag && k === classAttrRes.length) { // 如果没有匹配到，并且匹配到最后一位
	        return false;
	      }
	    }
	  }
	
     // some code ...
     
	  return true
	}

	```
	
- 最后我们别忘了修改 specificity 的计算逻辑

	```javascript
	function specificity(selector) {
	  const p = [0, 0, 0, 0]
	  const selectorParts = selector.split(" ")
	  let regClass = /(\.\w+)+/g
	  let resClass = selector.match(regClass)
	  if (resClass && resClass.length) {
	    for (let i = 0; i < resClass.length; i ++) {
	      let tempArr = resClass[i].split('.')
	      for (let j = 1; j < tempArr.length; j ++) {
	        p[2] ++
	      }
	    }
	  }
	  for (let part of selectorParts) {
	
	    let regId = /(#\w+)+/g
	    let resId = part.match(regId)
	    if (resId && resId[0].charAt(0) == "#") {
	      p[1] += 1
	    } else if (part.charAt(0) !== "#" && part.charAt(0) !== "."){
	      p[3] += 1
	    }
	  }
	  console.log('selector', selector)
	  console.log('p', p)
	  return p
	}
	```