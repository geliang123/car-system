'use strict';

var DHBufferPool = function() {
    this.frameArray = null;
    this.startTime = null;
    this.firstFrameTime = null;
    this.timer = null
    this.onFrame = null
    this.nrDelay = null

    // audio
    this.sampleRate = null
    this.sampleIn = null
    this.channel = null
    this.intv = null

    // drop
    this.flag = null
    this.count = null
    this.renderTick = null
    this.lastTick = null
    this.dropTick = null

    this.interval = null


};

DHBufferPool.prototype.setOption = function(option) {
    // ....
}

DHBufferPool.prototype.startBuffering = function() {
    console.log('startBuffering');
    this.frameArray = new Array();
    this.sampleRate = 8000
    this.sampleIn = 16;
    this.channel = 1;
    this.flag = 0;
    this.count = 0;
    this.renderTick = 0;
    this.lastTick = 0;
    this.nrDelay = 5 * 320;
    this.intv = 35;
    this.dropTick = 0;

    this.interval = setInterval(function() {
        this.consume();
    }.bind(this), 1);
}

DHBufferPool.prototype.stopBuffering = function() {
    clearInterval(this.interval);
    this.frameArray.splice(0, this.frameArray.length);
}

DHBufferPool.prototype.addFrame = function(frame) {
    //console.log('addFrame');
    //console.log(frame);
    if (this.renderTick == 0) {
        this.renderTick = performance.now();
    }
    // drop frame
    if (this.renderTick >= this.dropTick + 100) {
        this.dropTick = this.renderTick;
        //console.log('drop!');
        return ;
    }
    //this.frameArray.push(frame)
    this.frameArray.unshift(frame)
}

DHBufferPool.prototype.consume = function() {
    var curTick = performance.now();
    //console.log('1111111111111111111111111111 curTick=' + curTick + ' lastTick=' + this.lastTick);
    if (this.renderTick > 0) {
        if (curTick < this.renderTick + 120) {
            return;
        }
    } else {
        return;
    }

    if (this.lastTick + this.intv > curTick) {
        return;
    }

    this.lastTick = performance.now();
    //console.log('2222222222222222222222222222222 lastTick=' + this.lastTick);
    if (this.frameArray.length < 4) return;
    var frame1 = this.frameArray.pop();
    var frame2 = this.frameArray.pop();
    //var frame3 = this.frameArray.pop();
    //var frame4 = this.frameArray.pop();
    var framenew = new Int16Array(frame1.length*2);
    framenew.set(frame1, 0);
    framenew.set(frame2, frame1.length);
    //framenew.set(frame3, frame1.length*2);
    //framenew.set(frame4, frame1.length*3);
    //console.log('feed curTick=' + curTick + ' length=' + this.frameArray.length + ' len=' + frame1.length);

    if (this.onFrame) {
        //console.log(frame);
        this.onFrame (framenew);
    }
}
