import { createElement, Text, Wrapper } from './createElement'

import { Timeline, Animation } from './animation'
import { ease } from './cubicBezier'


/////////////////////////////
export class Carousel {
  constructor(config) {
      this.children = []
      this.attributes = new Map()
      this.properties = new Map()
  }

  // set cls(v) { // property
  //     console.log('Parent::class', v)
  // }

  // set id(v) {
  //     console.log('Parent::id', v)
  // }

  setAttribute(name, value) { // attribute
      // console.log(name, value)
      // this.attributes.set(name, value)
      this[name] = value
  }

  appendChild(child) {
      // child.mountTo(this.root)
      this.children.push(child)
  }

  render() {

      let timeline = new Timeline

      timeline.start()
      
      let position = 0

      let nextPicStopHandler = null

      

      

      let children = this.data.map( (url, currentPosition) => {
          let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length
          let nextPosition = (currentPosition + 1) % this.data.length

          

          let offset = 0

          let onStart = () => {
              timeline.pause()
              clearTimeout(nextPicStopHandler)

              let currentElement = children[currentPosition]

              let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
              offset = currentTransformValue + 500 * currentPosition
              console.log(offset)
              
              
          }
          let onPanmove = event => {

              let lastElement = children[lastPosition]
              let currentElement = children[currentPosition]
              let nextElement = children[nextPosition]

              let dx = event.clientX - event.startX

              let currentTransformValue = - 500 * currentPosition + offset + dx
              let lastTransformValue = - 500 - 500 * lastPosition + offset + dx
              let nextTransformValue = 500 - 500 * nextPosition + offset + dx
              
              // console.log(currentTransformValue)

              

              lastElement.style.transform = `translateX(${lastTransformValue}px)`
              currentElement.style.transform = `translateX(${currentTransformValue}px)`
              nextElement.style.transform = `translateX(${nextTransformValue}px)`
          }

          let onPanend = event => {
              let direction = 0
              let dx = event.clientX - event.startX

              if (dx + offset > 250) {
                  direction = 1
              } else if (dx + offset < -250) {
                  direction = -1
              }

              console.log(event)
              console.log(direction)
              console.log(dx + offset)

              timeline.reset()
              timeline.start()

              let lastElement = children[lastPosition]
              let currentElement = children[currentPosition]
              let nextElement = children[nextPosition]

           
              let lastAnimation = new Animation(lastElement.style, 'transform', - 500 - 500 * lastPosition + offset + dx, - 500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)
              let currentAnimation = new Animation(currentElement.style, 'transform', - 500 * currentPosition + offset + dx, - 500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)
              let nextAnimation = new Animation(nextElement.style, 'transform', 500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)
              
              timeline.add(lastAnimation)
              timeline.add(currentAnimation)
              timeline.add(nextAnimation)

              position = (position - direction + this.data.length) % this.data.length

              nextPicStopHandler = setTimeout(nextPic, 3000)

              // current.style.transform = `translateX(${ offset * 500 - 500 * position }px)`
              //           last.style.transform = `translateX(${ offset * 500 - 500 - 500 * lastPosition }px)`
              //           next.style.transform = `translateX(${ offset * 500 + 500 - 500 * nextPosition }px)`

              //           position = (position - offset + this.data.length) % this.data.length
          }

          let element = <img src={url} onStart={ onStart } onPanmove={ onPanmove } onPanend={onPanend} enableGesture={true} />
          element.style.transform = 'translateX(0px)'
          element.addEventListener('dragstart', event => event.preventDefault())
          return element
      })



      let nextPic = () => {
          let nextPosition = (position + 1) % this.data.length

          let current = children[position]
          let next = children[nextPosition]

          let currentAnimation = new Animation(current.style, 'transform', -100 * position, -100 - 100 * position, 500, 0, ease, v => `translateX(${5 * v}px)`)
          let nextAnimation = new Animation(next.style, 'transform', 100 - 100 * nextPosition, -100 * nextPosition, 500, 0, ease, v => `translateX(${5 * v}px)`)

          timeline.add(currentAnimation)
          timeline.add(nextAnimation)

          position = nextPosition

          // 制造循环的小技巧
          // position = (position + 1) % this.data.length
          nextPicStopHandler = setTimeout(nextPic, 3000)
      }

      nextPicStopHandler = setTimeout(nextPic, 3000)


      return <div class="carousel">
          { children }
      </div>
  }

  mountTo(parent) {
      this.render().mountTo(parent)
  }

  // appendChild(child) { // children
  //     console.log('Parent::appendChild', child)
  // }
}