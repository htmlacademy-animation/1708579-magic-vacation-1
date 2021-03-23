export default class TextAnimate {

  constructor() {
    this.title_splited = [];
  }

  splitStringToSpans(el, separator) {
    const stringToSplit = el.textContent;
    this.title_splited = stringToSplit.split(separator);
    el.innerHTML = "";
    this.title_splited.forEach(function (item, i, arr) {
      var span = document.createElement('span');
  
      span.innerHTML = item;
      el.appendChild(span);
      if (separator == " ") {
        el.classList.add("processed");
        span.classList.add("spaces");
      } else {
        span.classList.add("letter");
      }
    });
  }

  animateText(element, freq, delay_step, delay) {
    element.querySelectorAll('.animate').forEach((element) => element.classList.remove('animate'));
    // Делишь текст внутри элемента на слова
    if(!element.classList.contains('processed')){
      this.splitStringToSpans(element, " ");
    }
    // Весь текст поделен на слова .spaces
    const elements = element.childNodes;
  //   let delay = 0;
    elements.forEach(word => {
      const local_delay = delay;
      setTimeout(() => {
        this.splitStringToSpans(word, "");
        // буквы готовы к анимации
        const letters = word.childNodes;
        letters.forEach(letter => {
            word.classList.add('spaces_visible'); 
          const rand = Math.floor(Math.random() * Math.floor(freq));
          setTimeout(() => {
            letter.classList.add('animate');
          }, rand * 100);
        })
      }, local_delay);
      delay += delay_step;
    })
  }
}
