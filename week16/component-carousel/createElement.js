import { enableGesture } from './gesture'

export function createElement(Cls, attributes, ...children) {
    // console.log(arguments)

    let o
    
    if (typeof Cls === 'string') {    // 解决小写问题
        o = new Wrapper(Cls)
    } else {
        o = new Cls({
            timer: {}
        })
    }
    
    // let o = new Cls
    // let o = new Cls({
    //     timer: {}
    // })

    

    for (let name in attributes) {
        // o[name] = attributes[name]
        o.setAttribute(name, attributes[name])
    }

    // console.log(children); // [] [] [] [child, child, child]   JSX 先子后父
    let visit = (children) => {
        for (let child of children) {

            if (typeof child === 'object' && child instanceof Array) {
                visit(child)
                continue
            }

            if (typeof child === 'string') {
                child = new Text(child)
            }
    
            
            o.appendChild(child)
            // o.children.push(child)
        }
    }

    visit(children)

    return o
}

export class Text {
    constructor(text) {
        // console.log('config', config)
        this.children = []
        this.root = document.createTextNode(text)
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

export class Wrapper {
    constructor(type) {
        // console.log('config', config)
        this.children = []
        this.root = document.createElement(type)
    }

    setAttribute(name, value) { // attribute
        this.root.setAttribute(name, value)

        if (name.match(/^on([\s\S]+)$/)) {
            console.log(RegExp.$1)
            let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
            this.addEventListener(eventName, value)
        }

        if (name === 'enableGesture') {
            enableGesture(this.root)
        }
    }

    appendChild(child) {
        this.children.push(child)
    }

    addEventListener() {
        this.root.addEventListener(...arguments)
    }

    get style() {
        return this.root.style
    }

    mountTo(parent) {
        parent.appendChild(this.root)

        for (let child of this.children) {
            child.mountTo(this.root)
        }
    }
}