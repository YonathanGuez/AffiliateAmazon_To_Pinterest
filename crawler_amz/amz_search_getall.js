const puppeteer = require("puppeteer");
const fs = require("fs");
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
  /**
   * Get all my links in my Page Search
   */
  await page.waitForSelector(".s-image-overlay-white-semitransparent");
  //we wait the second page will be propose for get all link charged
  await page.waitForSelector(".a-section.a-spacing-none.a-padding-base");
  let MyLinks = await page.evaluate(() => {
    let links = [];
    let allElemts = document.querySelectorAll(".sg-col-inner");
    allElemts.forEach((itemElement) => {
      let itemJson = {};
      try {
        itemJson.link = itemElement.querySelector(
          "div.a-section.a-spacing-none.s-image-overlay-black > div > span > a"
        ).href;
        itemJson.image = itemElement.querySelector(".s-image").src;
        itemJson.description = itemElement.querySelector(
          ".a-size-base-plus.a-color-base.a-text-normal"
        ).innerHTML;
        itemJson.price = String(
          itemElement.querySelector("span.a-price > span.a-offscreen").innerHTML
        ).replace("&nbsp;", "");
      } catch (exception) {}
      if (Object.keys(itemJson).length !== 0) {
        links.push(itemJson);
      }
    });
    return links;
  });
  console.dir(MyLinks);
  console.dir(MyLinks.length);
  /**
   * Create JSON with all links,descriptions,prices
   */
  fs.writeFile("results.json", JSON.stringify(MyLinks, null, 2), function (
    err
  ) {
    if (err) throw err;
    console.log("complete");
    browser.close();
  });
  await navigationPromise;
  await browser.close();
})();
