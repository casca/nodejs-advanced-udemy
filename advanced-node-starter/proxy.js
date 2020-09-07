console.clear();

class Greetings {
  english() {
    return 'Hello';
  }
  spanish() {
    return 'Hola';
  }
}

class MoreGreetings {
  german() {
    return 'Hallo';
  }
  french() {
    return 'Bonjour';
  }
}

const greetings = new Greetings();
const moreGreetings = new MoreGreetings();

new Proxy(moreGreetings, {
  get: function (target, property) {
    // console.log(property);
    return target[property] || greetings[property];
  },
});

console.log(allGreetings.english());
