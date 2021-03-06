class TimeLine {
    constructor() {
      this.animation = [];
      this.requestID = null;
      this.state = 'inited';
      this.tick = () => {
        let t = Date.now() - this.startTime;
  
        let animations = this.animation.filter(
          (animation) => !animation.finished,
        );
  
        for (const animation of animations) {
          let {
            object,
            property,
            template,
            duration,
            delay,
            timingFunction,
            addTime,
            valueFromProgression,
          } = animation;
  
          let progression = timingFunction((t - delay - addTime) / duration); // 0-1之间的数字
  
          if (t > duration + delay + addTime) {
            progression = 1;
            animation.finished = true;
          }
  
          let value = valueFromProgression(progression);
          object[property] = template(value);
        }
  
        if (animations.length) {
          this.requestID = requestAnimationFrame(this.tick);
        }
      };
    }
  
    pause() {
      if (this.state !== 'playing') {
        return;
      }
      this.state = 'pause';
      this.pauseTime = Date.now();
      if (this.requestID !== null) {
        cancelAnimationFrame(this.requestID);
      }
    }
  
    resume() {
      if (this.state !== 'pause') {
        return;
      }
      this.state = 'playing';
      this.startTime += Date.now() - this.pauseTime;
      this.tick();
    }
  
    start() {
      if (this.state !== 'inited') {
        return;
      }
      this.state = 'playing';
      this.startTime = Date.now();
      this.tick();
    }
  
    restart() {
      if (this.state === 'playing') {
        this.pause();
      }
      this.animation = [];
      this.requestID = null;
      this.state = 'playing';
      this.startTime = Date.now();
      this.pauseTime = null;
      this.tick();
    }
  
    add(animation, addTime) {
      console.log(animation);
      this.animation.push(animation);
      animation.finished = false;
      if (this.state === 'playing') {
        animation.addTime =
          addTime !== void 0 ? addTime : Date.now() - this.startTime;
      } else {
        animation.addTime = addTime !== void 0 ? addTime : 0;
      }
    }
  }
  
  class Animation {
    constructor(
      object,
      property,
      start,
      end,
      duration,
      delay,
      timingFunction,
      template,
    ) {
      this.object = object;
      this.template = template;
      this.property = property;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.delay = delay || 0;
      this.timingFunction = timingFunction;
    }
  
    valueFromProgression = (progression) => {
      return this.start + progression * (this.end - this.start);
    };
  }
  
  class ColorAnimation {
    constructor(
      object,
      property,
      start,
      end,
      duration,
      delay,
      timingFunction,
      template,
    ) {
      this.object = object;
      this.template =
        template ||
        ((v) => {
          return `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`;
        });
      this.property = property;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.delay = delay || 0;
      this.timingFunction = timingFunction;
    }
  
    valueFromProgression = (progression) => {
      return {
        r: this.start.r + progression * (this.end.r - this.start.r),
        g: this.start.g + progression * (this.end.g - this.start.g),
        b: this.start.b + progression * (this.end.b - this.start.b),
        a: this.start.a + progression * (this.end.a - this.start.a),
      };
    };
  }
  
  let linear = (t) => t;
  let ease = cubicBezier(0.24, 0.1, 0.25, 1);
  
  let el = document.getElementById('el');
  let el2 = document.getElementById('el2');
  let tl = new TimeLine();
  
  tl.add(
    new Animation(el.style, 'transform', 0, 200, 5000, 0, linear, (v) => {
      return `translate(${v}px)`;
    }),
  );
  
  tl.start();
  
  document.getElementById('pause-btn').addEventListener('click', () => {
    tl.pause();
  });
  
  document.getElementById('resume-btn').addEventListener('click', () => {
    tl.resume();
  });
  
  document.getElementById('el2-start-btn').addEventListener('click', () => {
    tl.add(
      new ColorAnimation(
        el.style,
        'backgroundColor',
        {
          r: 0,
          g: 0,
          b: 0,
          a: 1,
        },
        {
          r: 255,
          g: 0,
          b: 0,
          a: 1,
        },
        5000,
        0,
        linear,
      ),
      // 0,
    );
  });
  