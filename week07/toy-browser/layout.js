function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (let prop in element.computedStyle) {
        const p = element.computedStyle.value
        element.style[prop] = element.computedStyle[prop].value

        if (element.style[prop].toString().match(/px$/)) {
            // 把px的文本直接处理为整数
            element.style[prop] = parseInt(element.style[prop])
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            // 把纯数字的文本也处理为整数
            element.style[prop] = parseInt(element.style[prop])
        }
    }

    return element.style
}

function layout(element) {

    if (!element.computedStyle) { return }

    const elementStyle = getStyle(element)

    if (elementStyle.display !== 'flex') {
        //只考虑flex布局
        return
    }

    const items = element.children.filter(e => e.type === 'element')

    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0)
    })

    let style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })

    //处理默认值
    if (!style.flexDirection || style.flexDirection === 'auto') { style.flexDirection = 'row' }
    if (!style.alignItems || style.alignItems === 'auto') { style.alignItems = 'strech' }
    if (!style.justifyContent || style.justifyContent === 'auto') { style.justifyContent = 'flex-start' }
    if (!style.flexWrap || style.flexWrap === 'auto') { style.flexWrap = 'nowrap' }
    if (!style.alignContent || style.alignContent === 'auto') { style.alignContent = 'center' }

    let mainSize, // 主轴size width / height
        mainStart, // 主轴起点 left / right / top / bottom
        mainEnd, // 主轴终点 left / right / top / bottom
        mainSign, // 主轴符号位，用于 是否 reverse +1 / -1
        mainBase, // 主轴开始的位置 0 / style.width
        crossSize, // 交叉轴size
        crossStart, // 交叉轴坐标起点
        crossEnd, // 交叉轴坐标终点
        crossSign, // 交叉轴符号位，用于 是否 reverse
        crossBase; // 交叉轴开始的位置

    if (style.flexDirection === 'row') {
        //行：方向为当前文档水平流方向，元素从左往右排列。这个是默认值
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1 //正号只是为了代码好读
        mainBase = 0
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    } else if (style.flexDirection === 'row-reverse') {
        //元素从右往左，其他和row一样。
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1
        mainBase = style.width
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    } else if (style.flexDirection === 'column') {
        //列：方向为当前文档垂直流方向，元素从上至下排列
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1
        mainBase = 0
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    } else if (style.flexDirection === 'column-reverse') {
        //元素从下往上，其他和row一样。
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1
        mainBase = style.height
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }

    if (style.flexWrap !== 'wrap-reverse') {
        //宽度不足时，nowrap不换行
        // 1 2 3 | 4 5 6
        //wrap 换行
        // 1 2 3 |
        // 4 5 6 |
        crossBase = 0
        crossSign = +1
    } else {
        //换行从下往上开始，比如
        // 4 5 6 |
        // 1 2 3 |
        let temp = crossStart
        crossStart = crossEnd
        crossEnd = temp
        crossSign = -1
    }
    let isAutoMainSize = false
    // 没有设置 mainSize 直接撑开
    if (!style[mainSize]) { // 计算子项的mainSize
        elementStyle[mainSize] = 0
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let itemStyle = getStyle(item)
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
            }
            isAutoMainSize = true
        }
    }

    const flexLine = []
    const flexLines = [flexLine]

    let mainSpace = elementStyle[mainSize]
    let crossSpace = 0

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        // 单个元素 mainSize
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0
        }

        if (itemStyle.flex) {
            // flex 子项 display 为 flex，直接塞进当前行，mainSpace 不作处理，后续自适应
            //flex: none | auto | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            //flex 容器 flex-wrap: no-wrap && isAutoMainSize，mainSpace 为0，允许撑大，强行分进第一行
            mainSpace -= itemStyle[mainSize]
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        } else {
            // 当前flex子项尺寸大于 flex容器，修正
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            // 当前flex子项大于flex容器剩余空间 mainSpace，另起一行
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace
                // 创建新行
                flexLine = []
                flexLines.push(flexLine)
                flexLine.push(item)

                mainSpace = style[mainSize]
                crossSpace = 0
            } else { // 没超过就直接添加元素入行
                flexLine.push(item)
            }
            // 处理交叉轴，取 flex 子项最大 crossSize
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            // 计算并修正flex容器剩余 mainSpace
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace
    }

    if (mainSpace < 0) {
        //若剩余空间 mainSpace 为负数，所有 flex 元素为 0，默认flex-shrink 为1，等比压缩所有元素
        const scale = style[mainSize] / (style[mainSize] - mainSpace)
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const itemStyle = getStyle(item)

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale

            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]
        }
    } else {
        flexLines.forEach(function (items) {
            const mainSpace = items.mainSpace
            let flexTotal = 0
            //找出所有 flex 子项也为 flex 元素
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                const itemStyle = getStyle(item)

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex
                    continue
                }
            }

            if (flexTotal > 0) {
                // 填充flexLine 剩余空间mainSpace
                let currentMain = mainBase

                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const itemStyle = getStyle(item)

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd]
                }
            } else {
                //不存在 flex 子项也为 flex，把主轴方向剩余尺寸按比例分配给这些元素
                let currentMain, gap;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase
                    gap = 0
                }
                if (style.justifyContent === 'flex-end') {
                    //与默认文档流方向相反
                    currentMain = mainSpace * mainSign + mainBase
                    gap = 0
                }
                if (style.justifyContent === 'center') {
                    //居中对齐
                    currentMain = mainSpace / 2 * mainSign + mainBase
                    gap = 0
                }
                if (style.justifyContent === 'space-between') {
                    //两端对齐。between 是中间的意思，意思是多余的空白间距只在元素中间区域分配
                    gap = mainSpace / (items.length - 1) * mainSign
                    currentMain = mainBase
                }
                if (style.justifyContent === 'space-around') {
                    //around环绕，每个 flex 子项两侧都环绕互等宽的空白间距，最边缘两侧的空白只有中间空白宽度一半
                    gap = mainSpace / items.length * mainSign
                    currentMain = gap / 2 + mainBase
                }
                if (style.justifyContent === 'space-evenly') {
                    //evenly平均。每个 flex 子项两侧空白间距完全相等
                    gap = mainSpace / (items.length + 1) * mainSign
                    currentMain = gap + mainBase
                }
                for (let i = 0; i < items.length; i++) {
                    //循环计算 flex 子项位置
                    const item = items[i]
                    const itemStyle = getStyle(item)
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd] + gap
                }
            }
        })
    }

    if (!style[crossSize]) {
        //默认交叉轴高时每一行的行高之和，行高则是每一行最大的crossSize —— 当前行的crossSpace
        crossSpace = 0
        elementStyle[crossSize] = 0
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
        }
    } else {
        //指定了 crossSize的情况下，要减去每行crossSpace，得出剩余的crossSpace
        crossSpace = style[crossSize]
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize]
    } else {
        crossBase = 0
    }

    let lineSize = style[crossSize] / flexLines.length

    let gap

    if (style.alignContent === 'flex-start') {
        crossBase += 0
        gap = 0
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace
        gap = 0
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2
        gap = 0
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0
        gap = crossSpace / (flexLines.length - 1)
    }
    if (style.alignContent === 'space-around') {
        gap = crossSpace / (flexLines.length)
        crossBase += crossSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0
        gap = 0
    }

    flexLines.forEach(function (items) {
        // 根据 stretch 判断是否要拉伸
        let lineCrossSize = style.alignContent === 'stretch' ?
                            items.crossSpace + crossSpace / flexLines.length :
                            items.crossSpace

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const itemStyle = getStyle(item)
            // 根据行高 flex-align 和 item-align，确定元素具体位置
            // align-self指控制单独某一个flex子项的垂直对齐方式
            // align-items属性，表示子项们，优先级比align-self低
            const align = itemStyle.alignSelf || style.alignItems 

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize)

                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + gap)
    })
}


module.exports = layout;