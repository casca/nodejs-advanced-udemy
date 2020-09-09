const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  jest.setTimeout(60000);
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

// test('Adds two numbers', () => {
//   const sum = 1 + 2;

//   expect(sum).toEqual(3);
// });

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login start oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', (el) => e.innerHTML);
  expect(text).toEqual('Logout');
});
