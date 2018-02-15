// basic application
var
  Application = (function() {
    var 
      inst = {
        "state": {
          dom: {},
          app: {}
        },
        "configure": {
          "dom": function(obj) {
            var 
              dom = inst.state.dom;
            Object.keys(obj).forEach(function(key) {
              dom[key] = document.getElementById(
                obj[key].replace('#', '')
              );
            });
          },
          "app": function(obj) {
            inst.state.app = obj;
          }
        },
        "init": function(conf) {
          if (typeof conf === "object") {
            Object.keys(conf).forEach(function(key) {
              inst.configure[key](conf[key]);
            });
          }
          // show the root node
          inst.state.dom.root.classList.remove("hidden");
          // pre-calc as much as possible
          inst.setup();
          // start it up
          inst.runApp();
        },
        "setup": function() {
          var 
            state = inst.state,
            app = state.app,
            layout,
            x,y,z;
          console.log("state", state);
          // TODO: create stuff once:
          layout = inst.initLayout(state.dom.content);
          // set state of animation
          app.animationState = {
            'layout': layout
          };
        },
        "initLayout": function(container) {
          console.log("initLayout", container);
          var 
            content = [],
            layout = {};
          content.push('<div class="background">');
          
          content.push('</div>');
          container.innerHTML = content.join('');
          return layout;
        },
        "runApp": function() {
          var 
            dom = inst.state.dom,
            animation = inst.state.app.animation;
          // hide loading msg
          dom.loading.classList.add("hidden");
          // show content
          dom.content.classList.remove("hidden");
          inst.startAnimating(animation.fps, animation.sample);
        },
        "startAnimating": function(fps, sampleFreq) {
          var 
            state = inst.state.app.animationState;
          // init animation state
          state.fpsInterval = 1000 / fps;
          state.lastDrawTime = performance.now();
          state.lastSampleTime = state.lastDrawTime;
          state.frameCount = 0;
          // start animating
          inst.animate(state.lastDrawTime);
        },
        // use requestAnimationFrame to limit state calc/repaints to frame-rate
        "animate": function(now) {
          try {
            var 
              app = inst.state.app,
              maxFrame = app.animation.stopFrame || 0,
              state = app.animationState,
              fpsInterval = state.fpsInterval,
              // calc elapsed time since last loop
              elapsed = now - state.lastDrawTime;
            // are we requested to stop after N frames? ( debugging )
            if (state.stop || (maxFrame && (state.frameCount > maxFrame))) {
              console.log("animate stop @ " + state.frameCount + ", msg: " + state.stop);
            } else {
              // request another frame
              state.requestID = requestAnimationFrame(inst.animate);
              // if enough time has elapsed, draw the next frame
              if (elapsed > fpsInterval) {
                // Get ready for next frame by setting lastDrawTime=now
                state.lastDrawTime = now;
                // draw
                inst.drawNextFrame(now);
                // inc frame counter
                state.frameCount++;
              }
            }
          } catch (e) {
            if (state.requestID) {
              cancelAnimationFrame(state.requestID);
              state.requestID = false;
            }
            console.error(e);
          }
        },
        // once per frame, calc and show the next state
        "drawNextFrame": function(now) {
          inst.nextState(now);
          inst.showState(now);
        },
        // calc the next state
        "nextState": function(now) {
          var 
            app = inst.state.app,
            animation = app.animation,
            state = app.animationState,
            x,y,z;
            
          // TODO: update state...
          
        },
        // show the previously calculated state
        "showState": function(now) {
          var
            content = [],
            app = inst.state.app,
            state = app.animationState,
            x,y,z;
          
          // TODO: repaint once...
          //inst.state.dom.content.innerHTML = content.join('');
        },
        // random int from min to max ( inclusive )
        "randomFromRange": function(min, max) {
          if (min === max) return min;
          var 
            len = max - min,
            result = Math.floor(
              (Math.random() * len) + min
            );
          return result;
        },
        // random item from set
        "randomChoice": function(set) {
          return set[
            inst.randomFromRange(0, set.length)
          ];
        }
      };
    return inst;
  })();
