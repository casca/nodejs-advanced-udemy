const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    // const id = '5f357326c426885daceb71f7';

    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    // console.log(sessionString, sig);

    // await page.goto('localhost:3000');

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evalute(
      (p) =>
        fetch(p, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json()),
      path,
    );
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) =>
        fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json()),
      path,
      data,
    );
  }

  execRequests(actions) {
    return Promise.all(actions.map(({ method, path, data }) => this[method](path, data)));
  }
}

module.exports = CustomPage;
