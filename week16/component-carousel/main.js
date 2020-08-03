import { createElement, Text, Wrapper } from './createElement'

import { Carousel } from './Carousel.js'

// class Child {
//     constructor(config) {
//         this.children = []
//         this.root = document.createElement('div')
//     }

//     setAttribute(name, value) { // attribute
//         this.root.setAttribute(name, value)
//     }

//     appendChild(child) {
//         child.mountTo(this.root)
//     }

//     mountTo(parent) {
//         parent.appendChild(this.root)
//     }

// }

// let component = <Parent id="a" cls="b">
//     <Child></Child>
//     <Child></Child>
//     <Child></Child>
// </ Parent>

// let component = <Div id="a" cls="b" style="width: 100px;height: 100px;background-color:lightblue">
//     <Div></Div>
//     <Div></Div>
//     <Div></Div>
// </ Div>

// let component = <div id="a" cls="b" style="width: 100px;height: 100px;background-color:lightblue">
//     <div></div>
//     <p></p>
//     <div></div>
//     <div></div>
// </ div>

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]} />

// component.id = 'c'
component.mountTo(document.body)

/*

var component = createElement(
    Parent,
    {
        id: "a",
        class: "b"
    },
    createElement(Child, null),
    createElement(Child, null),
    createElement(Child, null)
)


*/

// console.log(component)

// component.setAttribute('id', 'a')