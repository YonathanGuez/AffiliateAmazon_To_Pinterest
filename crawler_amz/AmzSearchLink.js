/*
  In this script we do our research in amazon like this 
 
*/
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const CronJob = require("cron").CronJob;

const UserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36";

const Dimention = { width: 1366, height: 576 };
const mySearch = process.argv.slice(2).join(" ");

async function configureBrowser(browser, url, useragent, dimention) {
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.setUserAgent(useragent);
  await page.setViewport(dimention);
  await page.goto(url);
  await navigationPromise;
  return page;
}
async function SearchAmz(page, search) {
  await page.waitForSelector("#nav-search #twotabsearchtextbox");
  await page.type("#twotabsearchtextbox", search);
  const navigationPromise = page.waitForNavigation();
  await page.click("input.nav-input");
  await navigationPromise;
  return page;
}

async function getDataSearch(page) {
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
  return MyLinks;
  //console.dir(MyLinks);
}
async function getNextLink(page) {
  if ((await page.$("li.a-last > a")) !== null) {
    let next = await page.evaluate(
      () => document.querySelector("li.a-last > a").href
    );
    console.log(next);
    return next;
  } else {
    let next = "null";
    console.log(next);
    return next;
  }
}
// Function Get Parameter of my URL
async function getUrlVars(url) {
  var vars = {};
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
async function getUrlParam(url, parameter) {
  var urlparameter = "Null";
  if (url.indexOf(parameter) > -1) {
    result = await getUrlVars(url);
    urlparameter = result[parameter];
  }
  return urlparameter;
}
async function BuildJson(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    console.log("complete");
  });
}
async function CreateDirectory(path) {
  fs.mkdirSync(path, { recursive: true });
}
function sortNumber(a, b) {
  return a - b;
}
async function getLastPageSearch(filetitle) {
  const directoryPath = await path.join(__dirname, filetitle);
  const files = await fs.readdirSync(directoryPath);
  const listnumber = [];
  files.forEach((file) => {
    let test = parseInt(file.replace(".json", ""));
    listnumber.push(test);
  });
  var bigNumber = listnumber.sort(sortNumber).pop();
  return bigNumber;
}
async function FirstSearch(filetitle) {
  const Url = "https://www.amazon.fr/";
  const browser = await puppeteer.launch({ headless: false });
  const page = await configureBrowser(browser, Url, UserAgent, Dimention);
  const pageSearch = await SearchAmz(page, mySearch);
  const links = await getDataSearch(pageSearch);
  let checkUrl = await pageSearch.evaluate(() => location.href);
  var pageNumber = await getUrlParam(checkUrl, "page");
  const nextLink = await getNextLink(pageSearch);
  try {
    await page.close();
    await browser.close();
  } catch (err) {
    console.log(err);
  }
  if (pageNumber === "Null") {
    pageNumber = 1;
  }
  console.log(pageNumber);
  const data = {
    urlBase: Url.substring(0, Url.length - 1),
    search: mySearch,
    nextLink: nextLink,
    page: pageNumber,
    list: links,
  };

  const file = pageNumber + ".json";
  await BuildJson(filetitle + "/" + file, data);

  //console.log(data);
}
async function OtherSearch(Urlchange, filetitle, UrlBase) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await configureBrowser(browser, Urlchange, UserAgent, Dimention);
  const links = await getDataSearch(page);
  let checkUrl = await page.evaluate(() => location.href);
  var pageNumber = await getUrlParam(checkUrl, "page");
  const nextLink = await getNextLink(page);
  try {
    await page.close();
    await browser.close();
  } catch (err) {
    console.log(err);
  }

  const data = {
    urlBase: UrlBase,
    search: mySearch,
    nextLink: nextLink,
    page: pageNumber,
    list: links,
  };
  const file = pageNumber + ".json";
  await BuildJson(filetitle + "/" + file, data);
  //console.log(data);
}

async function mymain() {
  let filetitle = mySearch.replace(/ /g, "-");
  if (!fs.existsSync(filetitle)) {
    await CreateDirectory(filetitle);
    await FirstSearch(filetitle);
  } else {
    const lastpage = await getLastPageSearch(filetitle);
    const pathfile = filetitle + "/" + String(lastpage) + ".json";
    //console.log(pathfile);
    const previousfile = fs.existsSync(pathfile);
    if (previousfile) {
      const content = await fs.readFileSync(pathfile);
      const old_search = await JSON.parse(content);
      const linkSearch = old_search.nextLink;
      if (old_search.nextLink !== "null") {
        await OtherSearch(linkSearch, filetitle, old_search.urlBase);
      } else {
        console.log("end page!!!");
        process.exit(1);
      }
    } else {
      console.log(pathfile + " is missing");
    }
  }
}

async function Start30Second() {
  let job = new CronJob(
    "*/30 * * * * *",
    function () {
      //runs every 30 second in this config
      mymain();
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
}

Start30Second();
