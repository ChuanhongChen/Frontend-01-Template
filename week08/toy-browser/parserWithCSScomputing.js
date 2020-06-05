// 收集 CSS 规则
const css = require('css')
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{ type: "document", children: [] }]

// css rules 对应 css里指定给某些选择器的每一对大括号的内容，包括选择器
let rules = []
function addCSSRules(text) {
    const ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
    if (!selector || !element.attributes){
        return false
    }

    let regClass = /(\.\w+)+/g
    let resClass = selector.match(regClass)

    let regId = /(#\w+)+/g
    let resId = selector.match(regId)

    if (resClass) {
        // 匹配到类选择器时，准备两个数组进行比较
        // 这个是style class selector数组
        let resClassArr = []
        for (let i = 0; i < resClass.length; i++) {
            // 处理 .cls1#id.cls2 匹配出来 [".cls1", ".cls2"] 情况
            let tempArr = resClass[i].split('.')
            for (let j = 1; j < tempArr.length; j++) {
                // 索引从1开始，因为 ["", "cls1", "cls2"]
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
        for (let i = 0; i < resClassArr.length; i++) {
            tempFlag = false
            let k = 0
            for (; k < classAttrRes.length; k++) {
                if (classAttrRes[k] === resClassArr[i]) {
                    // 拿 style class selector 与 element class attribute 进行比较
                    tempFlag = true
                    break
                }
            }
            if (!tempFlag && k === classAttrRes.length) {
                return false;
            }
        }
    }

    if (resId && resId[0].charAt(0) == "#") { // id选择器有标识符#，因此可以出现在任意位置，需要用正则去匹配
        const attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === resId[0].replace("#", '')) {
            return true
        } else {
            return false
        }
    } else if (selector.charAt(0) !== "#" && selector.charAt(0) !== ".") { // 只需要判断选择器开头是不是 非 id 选择器标识符 # 或者 class 选择器标识符 .
        if (element.tagName === selector) {
            return true
        } else {
            return false
        }
    } else if (resClass && resClass.length) {
        return true
    }
    return false
}

function specificity(selector) {
    // 计算选择器优先级
    const p = [0, 0, 0, 0]
    const selectorParts = selector.split(" ")
    let regClass = /(\.\w+)+/g
    let resClass = selector.match(regClass)
    if (resClass && resClass.length) {
        for (let i = 0; i < resClass.length; i++) {
            let tempArr = resClass[i].split('.')
            for (let j = 1; j < tempArr.length; j++) {
                p[2]++
            }
        }
    }
    for (let part of selectorParts) {
        let regId = /(#\w+)+/g
        let resId = part.match(regId)
        if (resId && resId[0].charAt(0) === "#") {
            p[1] += 1
        } else if (part.charAt(0) !== "#" && part.charAt(0) !== ".") {
            p[3] += 1
        }
    }
    return p
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1]
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2]
    }
    return sp1[3] - sp2[3]
}

function computeCSS(element) {
    const elements = stack.slice().reverse()

    if (!element.computedStyle){
        element.computedStyle = {}
    }

    for (let rule of rules) {
        const selectorParts = rule.selectors[0].split(" ").reverse()

        if (!match(element, selectorParts[0])){
            continue
        }

        let matched = false

        let j = 1

        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length) {
            matched = true
        }
        if (matched) { // 匹配成功
            const sp = specificity(rule.selectors[0])
            const computedStyle = element.computedStyle
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
            }
        }
    }
}

function emit(token) {

    let top = stack[stack.length - 1]

    if (token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        }

        element.tagName = token.tagName

        for (let p in token) {
            if (p != "type" && p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCSS(element)

        top.children.push(element)
        element.parent = top

        if (!token.isSelfClosing){
            stack.push(element)
        }

        currentTextNode = null
        // console.log('push', element)
    } else if (token.type === "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match")
        } else {
            // console.log('pop', stack.pop())
            /** 遇到 style 标签时，执行添加 CCS 规则的操作 */
            if (top.tagName === "style") {//添加内联style
                addCSSRules(top.children[0].content)
            }
            layout(top)
            stack.pop()
        }
        currentTextNode = null
    } else if (token.type === "text") {
        if (currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
        // console.log(top.children)
    }
}

const EOF = Symbol("EOF")

function data(c) {
    if (c === "<") {
        return tagOpen
    } else if (c === EOF) {
        emit({ type: "EOF" })
        return
    } else {
        emit({
            type: "text",
            content: c
        })
        return data
    }
}


function tagOpen(c) {
    if (c === "/") {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c)
    } else {}
}


function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c)
    } else if (c === ">") {
    } else if (c === EOF) {}
}


function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName(c)
    } else if (c === "/") {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c.toLowerCase()
        return tagName
    } else if (c === ">") {
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}


function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === ">" || c === "/" || c === EOF) {
        return afterAttributeName(c)
    } else if (c === "=") {
        return
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c)
    }
}

function afterAttributeName(c) {
    if (c === "/") {
        return selfClosingStartTag
    } else if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    } else if (c === "=") {
        return beforeAttributeValue
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {
        return
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c)
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c)
    } else if (c === "=") {
        return beforeAttributeValue
    } else if (c === "\u0000") {
    } else if (c === "\"" || c === "\'" || c === "<") {
        return attributeName
    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue
    } else if (c === "\"") {
        return doubleQuotedAttributeValue
    } else if (c === "\'") {
        return singleQuotedAttributeValue
    } else if (c === ">") {
        emit(currentToken)
    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === "\u0000") {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === "\u0000") {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === "/") {
        return selfClosingStartTag
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {
    } else {}
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === "/") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === "\u0000") {
    } else if (c === "\"" || c === "\'" || c === "<" || c === "=" || c === "`") {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}


function selfClosingStartTag(c) {
    if (c === ">" || c === "/") {
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    } else if (c === "EOF") {
    } else {}
}

module.exports.parseHTML = function parseHTML(html) {

    let state = data

    for (let c of html) {
        state = state(c)
    }

    state = state(EOF)

    // return rules
    return stack[0]
}