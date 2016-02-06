'use strict';

import log from '@sled/log';

class AutoSlider {
  init(core) {
    this.work = false;
    this.interval = 5000;

    this.slides = core.modules.slides;
    this.slides.on('change', n => this.restart());

    if (!this.$) {
      log({ id: core.id }, '[ modules-dom ]', 'missing autoSlider');
    } else {
      this.autoSlider = this.$.firstElementChild;
      log({ id: core.id }, '[ modules-dom ]', 'succesfully integrate with dom-autoSlider');
    }
  }

  start(interval) {
    if (this.slides.$.children.length > 1) {
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
        this.progressBar();
      }, (interval || this.interval) + 25);
    }
  }

  progressBar() {
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

export default AutoSlider;
