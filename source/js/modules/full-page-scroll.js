import throttle from 'lodash/throttle';
import TextAnimate from './text_animate.js';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {
      trailing: true
    }));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const animate = new TextAnimate();
    animate.animateText(document.querySelector(".intro__title"), 5, 150, 400);
    animate.animateText(document.querySelector(".intro__date"), 5, 0, 1400);
    animate.animateText(document.querySelector(".slider__item-title"), 5, 0, 200);
    animate.animateText(document.querySelector(".prizes__title"), 5, 0, 400);
    animate.animateText(document.querySelector(".rules__title"), 5, 0, 110);
    animate.animateText(document.querySelector(".game__title"), 5, 0, 110);
    let before_prizes = false;
    let before_rules = false;
    let before_game = false
    let to_rules_from_rules = false;
    this.screenElements.forEach((screen) => {
      screen.classList.remove(`before-active`);
      function isActive( screen_name ){
        if( screen.classList.contains(screen_name) && screen.classList.contains('active') ){
          return true;
        } 
        return false;
      }

      function updateClass(class_name, delay = 600){
        screen.classList.add(class_name);
        setTimeout(() => {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`active`);
          screen.classList.remove(class_name);
        }, delay);
      }

      if ( isActive('screen--story') && this.screenElements[this.activeScreen].classList.contains('screen--prizes')) {
        before_prizes = true;
        updateClass(`before-prizes`);
      } else if ( isActive('screen--game') && this.screenElements[this.activeScreen].classList.contains('screen--rules')) {
        before_rules = true;
        updateClass(`before-rules`);
      } else if ( (isActive('screen--rules') && !this.screenElements[this.activeScreen].classList.contains('screen--prizes')) || (isActive('screen--prizes') && !this.screenElements[this.activeScreen].classList.contains('screen--rules'))) {
        before_game = true;
        updateClass(`before-game`);
      } else if (( isActive('screen--prizes') && this.screenElements[this.activeScreen].classList.contains('screen--rules')) || ( isActive('screen--rules') && this.screenElements[this.activeScreen].classList.contains('screen--prizes')) ) {
        to_rules_from_rules = true;
        updateClass(`to-rules-and-back`, 300);
      } else {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
        screen.classList.remove(`to-rules-and-back`);
      }
    });
    let hidden_timeout = 0;
    let active_timeout = 100;
      if ( this.screenElements[this.activeScreen].classList.contains('screen--story') ) {
        document.querySelector("body").classList.add('screen--story')
      } else {
        document.querySelector("body").classList.remove('screen--story')
      }
      if (before_prizes) {
        setTimeout(() => {
          this.screenElements[this.activeScreen].classList.add(`before-active`);
        }, 589);
        hidden_timeout = 589;
        active_timeout = 689;
      }
      if (before_game) {
        hidden_timeout = 200;
      }
      if (to_rules_from_rules) {
        this.screenElements[this.activeScreen].classList.add(`before-transparent`);
        hidden_timeout = 300;
        active_timeout = 300;
      }
      if (before_rules) {
        this.screenElements[this.activeScreen].classList.add(`before-active`);
      }
      setTimeout(() => this.screenElements[this.activeScreen].classList.remove(`screen--hidden`), hidden_timeout);
      setTimeout(() => this.screenElements[this.activeScreen].classList.add(`active`), active_timeout);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
