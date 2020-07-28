// let element = document.body

function enableGesture(element) {
    // 存储起始位置
    let contexts = Object.create(null)
    const MOUSE_SYMBOL = Symbol('mouse')

    // 1. 监听 mousedown 事件
    if (document.ontouchstart !== null) {
        element.addEventListener('mousedown', event => {
            contexts[MOUSE_SYMBOL] = Object.create(null)
            start(event, contexts[MOUSE_SYMBOL])
        
            // 在 mousedown 中，监听 mousemove 和 mouseup 事件
            let mousemove = event => {
                move(event, contexts[MOUSE_SYMBOL])
            }
        
            let mouseend = () => {
                end(event, contexts[MOUSE_SYMBOL])
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseend)
            }
        
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseend)
        })
    }

    // 2. 监听 touch 事件
    element.addEventListener('touchstart', event => {
        for (let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null)
            start(touch, contexts[touch.identifier])
        }
    })

    element.addEventListener('touchmove', () => {
        for (let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier])
        }
    })

    element.addEventListener('touchend', () => {
        for (let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier])
            delete contexts[touch.identifier]
        }
    })

    element.addEventListener('touchcancel', () => {
        for (let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier])
            delete contexts[touch.identifier]
        }
    })

    // 判断 4 种常用手势
    // tap: start -> end
    // pan: start -> move -> panstart -> move -> panmove -> panend
    // flick: ...panmove -> high speed move -> flick
    // press: start -> (t>0.5) -> pressstart -> end -> pressend

    let start = (point, context) => {
        element.dispatchEvent(new CustomEvent('start', {
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY
        }))

        context.startX = point.clientX
        context.startY = point.clientY

        // movespeed
        context.moves = []

        // init 
        context.isTap = true
        context.isPan = false
        context.isPress = false

        context.timeoutHandle = setTimeout(() => {
            if (context.isPan) return

            context.isTap = false
            context.isPan = false
            context.isPress = true

            element.dispatchEvent(new CustomEvent('start', {}))
        }, 500)

    }

    let move = (point, context) => {
        let dx = point.clientX - context.startX
        let dy = point.clientY - context.startY

        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) element.dispatchEvent(new CustomEvent('presscancel', {}))
            context.isTap = false
            context.isPan = true
            context.isPress = false

            element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            }))
        }


        if (context.isPan) {
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            })

            context.moves = context.moves.filter(record => Date.now() - record.t < 300)
            
            let e = new CustomEvent('panmove')
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            })
            element.dispatchEvent(e)
        }

        // console.log('move', dx, dy)
    }

    let end = (point, context) => {
        // console.log('end', point.clientX, point.clientY)
        if (context.isPan) {
            let dx = point.clientX - context.startX
            let dy = point.clientY - context.startY
            let record = context.moves[0]
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t)
            // console.log(context.moves)
            // console.log(speed)

            let isFlick = speed > 2.5
            if (isFlick) {
                element.dispatchEvent(Object.assign(new CustomEvent('flick'), {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed,
                }))
            }

            let e = new CustomEvent('panend')
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed,
                isFlick
            })
            element.dispatchEvent(e)
        }

        if (context.isTap) {
            // 派发 tap
            const event = new CustomEvent('tap', {})
            element.dispatchEvent(event)
        }

        if (context.isPress) {
            const event = new CustomEvent('pressend', {})
            element.dispatchEvent(event)
        }

        clearTimeout(context.timeoutHandle)
    }

    let cancel = (point, context) => {
        const event = new CustomEvent('cancelled', {})
        element.dispatchEvent(event)
        clearTimeout(context.timeoutHandle)
    }
}

