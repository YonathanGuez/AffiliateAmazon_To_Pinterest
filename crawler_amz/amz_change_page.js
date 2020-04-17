const puppeteer = require("puppeteer");
let mySearch = "T-Shirt Dragon Ball";
(async () => {
  const browser = await puppeteer.launch({ headless: false }); //, slowMo: 250
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto("https://www.amazon.fr/");
  await page.setViewport({ width: 1366, height: 576 });
  await page.waitForSelector("#nav-search #twotabsearchtextbox");
  await page.type("#twotabsearchtextbox", mySearch);
  await page.click("input.nav-input");
  await page.waitForSelector(".s-image-overlay-white-semitransparent");

  let checkUrl = await page.evaluate(() => location.href);
  let changeUrl = checkUrl + "&page=2";
  console.log(changeUrl);
  await page.goto(changeUrl);
  await page.waitForSelector(".s-image-overlay-white-semitransparent");
  await navigationPromise;
  // await browser.close();
})();
