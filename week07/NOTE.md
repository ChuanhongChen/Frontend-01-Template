# 完成toy-browser的最后两步：layout和Render

## layout

实现目标：HTML的4代布局里实现方式最简练的flex布局

## flex布局简介

### 基本应用

给 div 这类块状元素元素设置 display: flex 或者给 span 这类内联元素设置 display: inline-flex ，flex 布局即创建！其中，直接设置 display: flex 或者 display: inline-flex 的元素称为 flex 容器，里面的子元素称为 flex 子项。

### 相关属性

- 作用在容器的属性
  - flex-direction 伸缩流方向
  - flex-wrap 伸缩-换行
  - flex-flow伸缩流的方向与换行
  - justify-content 主轴对齐
  - align-items 侧轴上项目对齐方式
  - align-content 堆栈伸缩行
- 作用在容器内元素的属性
  - order 伸缩-顺序
  - flex-grow伸缩-扩展基数
  - flex-shrink 伸缩-收缩比率
  - flex-basis 伸缩-基准值
  - flex 伸缩性
  - align-self 侧轴上单个项目对齐方式

### layout的实现

两个轴分别是主轴Main Axis和交叉轴Cross Axis
通过每个轴5个变量来实现对应属性

- mainSize 主轴size width / height
- mainStart 主轴起点 left / right / top / bottom
- mainEnd 主轴终点 left / right / top / bottom
- mainSign 主轴符号位，用于 是否 reverse +1 / -1
- mainBase 主轴开始的位置 0 / style.width
- crossSize 交叉轴size width / height
- crossStart 交叉轴坐标起点 left / right / top / bottom
- crossEnd 交叉轴坐标终点 left / right / top / bottom
- crossSign 交叉轴符号位，用于 是否 reverse +1 / -1
- crossBase 交叉轴开始的位置 0 / style.width

先处理主轴，然后设定交叉轴，两个方向的尺寸需要根据具体情况对子项进行计算后反馈

## 渲染为图片

使用 npm 的 image库，根据处理好包含style的dom对象渲染图片，用递归方式一个个处理子元素并添加到图片画布上。


# 学习CSS标准

## CSS 基本语法

### CSS2.1 语法

- [Appendix G. Grammar of CSS 2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)
- [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)

### CSS2.1 总体结构

基本结构：

- @charset
- @import
- rules
  - @media
  - @page
  - rule


## CSS @ Rules

- [@charset](https://www.w3.org/TR/css-syntax-3/)
- [@import](https://www.w3.org/TR/css-cascade-4/)
- [@media](https://www.w3.org/TR/css3-conditional/)
- [@page](https://www.w3.org/TR/css-page-3/)
- [@counter-style](https://www.w3.org/TR/css-counter-styles-3/)
- [@keyframes](https://www.w3.org/TR/css-animations-1/)
- [@fontface](https://www.w3.org/TR/css-fonts-3/)
- [@supports](https://www.w3.org/TR/css3-conditional/)
- [@namespace](https://www.w3.org/TR/css-namespaces-3/)


## CSS 规则的结构

- Selector
	- [selectors-3](https://www.w3.org/TR/selectors-3/)
	- [selectors-4](https://www.w3.org/TR/selectors-4/)
- Key
	- Properties
	- Variables
		- [css-variables](https://www.w3.org/TR/css-variables/)
- Value
	- [css-values-4](https://www.w3.org/TR/css-values-4/)