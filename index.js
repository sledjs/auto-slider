let log = require('@sled/log');

module.exports = class AutoSlider {
  constructor($core) {
    this.work = false;
    this.interval = 1000;

    this.slides = $core.modules.slides;
    if (!$core.domModules.autoSlider) {
      log(`[${$core.id}]`, '[ modules-dom ]', 'missing autoSlider');
    }else {
      this.autoSlider = $core.domModules.autoSlider.firstElementChild;
      log(`[${$core.id}]`, '[ modules-dom ]', 'succesfully integrate with dom-autoSlider');
    }
  }

  start(interval) {
    if (this.slides.$slides.children.length > 1) {
      this.restarting = false;
      log('autoSlider ruszył');

      if (this.autoSlider) {
        this.autoSlider.style.transitionDuration = (interval || this.interval) + 'ms';
        this.autoSlider.style.webkitTransitionDuration = (interval || this.interval) + 'ms';
        setTimeout(_=>this.autoSlider.style.width = '100%', 10);
      }

      this.work = true;
      this.heart = setInterval(_=> {
        !this.slides.change(1) ? this.stop() : null;
        if (this.autoSlider) {
          new Promise(end => {
            this.autoSlider.style.webkitTransitionDuration = '0ms';
            this.autoSlider.style.transitionDuration = '0ms';
            this.autoSlider.style.width = '0';
            setTimeout(end, 25);
          }).then(_=> {
            this.autoSlider.style.transitionDuration = (interval || this.interval) + 'ms';
            this.autoSlider.style.webkitTransitionDuration = (interval || this.interval) + 'ms';
            this.autoSlider.style.width = '100%';
          });
        }
      }, (this.interval = interval || this.interval) + 25);
    }
  }

  restart(delay) {
    if (!this.restarting && this.work) {
      this.restarting = true;
      this.stop();
      log(`restart autoLoader ${this.interval + delay}ms `);
      setTimeout(_ => this.start(this.interval), delay);
    }
  }

  stop() {
    log('autoSlider został zatrzymany');
    if (this.autoSlider)
        this.autoSlider.style.width = 0;
    this.work = false;
    clearInterval(this.heart);
  }
};
