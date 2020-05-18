const puppeteer = require("puppeteer");
const request = require("request");
const fs = require("fs");
const args = require("minimist")(process.argv.slice(2));

const arguments = process.argv.slice(2).join(" ").split("--search")[1];
let search = arguments.split(" ").slice(1).join("-");
const foldersearch = search;
const filesearch = args.page + ".json";
console.log(foldersearch + " and " + filesearch);
const affilantejson = "AL-" + foldersearch + ".json";

const UserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36";

const Dimention = { width: 1366, height: 576 };
const Filecookie = "./cookies/cookies.json";
let nb_execution = 3;

async function loadCookies(page, filecookie) {
  const previousSession = fs.existsSync(filecookie);
  if (previousSession) {
    const content = fs.readFileSync(filecookie);
    const cookiesArr = JSON.parse(content);
    if (cookiesArr.length !== 0) {
      for (let cookie of cookiesArr) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
    }
  }
}
async function updateCookie(page, filecookie) {
  // Write Cookies
  const cookiesObject = await page.cookies();
  fs.writeFileSync(filecookie, JSON.stringify(cookiesObject, null, 2));
  console.log("Session has been saved to " + filecookie);
}
async function configureBrowser(browser, useragent, filecookie, dimention) {
  const page = await browser.newPage();
  await page.setUserAgent(useragent);
  await loadCookies(page, filecookie);
  await page.setViewport(dimention);
  return page;
}
async function JSONDataSave(namefile, data) {
  const list = [];
  list.push(data);
  if (!fs.existsSync(namefile)) {
    fs.writeFile(namefile, JSON.stringify(list, null, 2), function (err) {
      if (err) throw err;
      console.log("complete");
    });
  } else {
    const myfile = await fs.readFileSync(namefile);
    var parseJson = JSON.parse(myfile);
    parseJson.forEach((links) => {
      list.push(links);
    });
    fs.writeFile(namefile, JSON.stringify(list, null, 2), function (err) {
      if (err) throw err;
    });
  }
}
async function getDataArticleAmz(page, url) {
  let itemJson = {};
  await page.waitFor(3000);
  // get value link
  await page.waitForSelector(
    "#amzn-ss-text-link > .a-declarative > span > strong > a"
  );
  await page.click("#amzn-ss-text-link > .a-declarative > span > strong > a");
  await page.waitFor(2000);
  itemJson.link = await page.evaluate(() => {
    return String(
      document.querySelector("#amzn-ss-text-shortlink-textarea").value
    );
  });
  await page.waitFor(3000);
  itemJson.refurl = url;
  try {
    itemJson.title = await page.evaluate(() => {
      return String(document.querySelector("#productTitle").innerHTML)
        .replace(/\n/g, "")
        .replace(/  /g, "");
    });
  } catch (error) {
    console.log(error);
  }
  try {
    itemJson.prix = await page.evaluate(() => {
      return String(
        document.querySelector("#priceblock_ourprice").innerHTML
      ).replace("&nbsp;", "");
    });
  } catch (error) {
    console.log(error);
  }
  try {
    itemJson.imageUrl = await page.evaluate(() => {
      return document.querySelector("#landingImage").src;
    });
  } catch (error) {
    console.log(error);
  }
  try {
    itemJson.imagename = await itemJson.imageUrl.substr(
      itemJson.imageUrl.lastIndexOf("/") + 1
    );
  } catch (error) {
    console.log(error);
  }
  return itemJson;
}

async function downloadImage(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
}
async function CreateDirectory(path) {
  fs.mkdirSync(path, { recursive: true });
}
function compare(data, url) {
  return new Promise((resolve) => {
    for (var old in data) {
      if (url === data[old].refurl) {
        resolve(false);
      }
    }
    resolve(true);
  });
}
async function getListNextLink(pathSearch, fileAffilate, nblink) {
  const Jsonsearchlink = fs.readFileSync(pathSearch);
  const Jsonaffiliatelink = fs.readFileSync(fileAffilate);
  const searchlink = JSON.parse(Jsonsearchlink);
  const affiliate = JSON.parse(Jsonaffiliatelink);
  let tmp = 0;
  const nextlist = [];
  for (var i in searchlink["list"]) {
    let value = await compare(affiliate, searchlink["list"][i].link);
    if (value === true) {
      tmp++;
      nextlist.push(searchlink["list"][i].link);
      if (tmp === nblink) {
        return nextlist;
      }
    }
  }
}

async function LaunchAnalyse(url, affilantejson, page) {
  const navigationPromise = page.waitForNavigation();
  await page.goto(url);
  await navigationPromise;
  await page.waitFor(2000);
  const dataArticle = await getDataArticleAmz(page, url);
  console.log(dataArticle);

  await JSONDataSave(affilantejson, dataArticle);
  if (!fs.existsSync("img")) {
    await CreateDirectory("img");
  }
  downloadImage(
    dataArticle.imageUrl,
    "img/" + dataArticle.imagename,
    function () {
      console.log("image Downloaded ");
    }
  );
}
async function main() {
  nb_execution--;
  if (nb_execution == 0) {
    process.exit(1);
  }
  if (
    fs.existsSync(foldersearch) &&
    fs.existsSync(foldersearch + "/" + filesearch) &&
    fs.existsSync(affilantejson)
  ) {
    const nextlinks = await getListNextLink(
      foldersearch + "/" + filesearch,
      affilantejson,
      10
    );
    const browser = await puppeteer.launch({ headless: false }); //, slowMo: 250 { headless: false }
    const page = await configureBrowser(
      browser,
      UserAgent,
      Filecookie,
      Dimention
    );
    try {
      for (const ntlink of nextlinks) {
        await LaunchAnalyse(ntlink, affilantejson, page, browser);
      }
    } catch (error) {
      console.log("change page !!! " + error);
    }

    await updateCookie(page, Filecookie);
    await browser.close();
  } else {
    if (
      fs.existsSync(foldersearch) &&
      fs.existsSync(foldersearch + "/" + filesearch)
    ) {
      const datajson = fs.readFileSync(foldersearch + "/" + filesearch);
      const data = JSON.parse(datajson);
      const url = data["list"][0].link;
      const browser = await puppeteer.launch({ headless: false }); //, slowMo: 250 { headless: false }
      const page = await configureBrowser(
        browser,
        UserAgent,
        Filecookie,
        Dimention
      );
      LaunchAnalyse(url, affilantejson, page);
      const nextlinks = await getListNextLink(
        foldersearch + "/" + filesearch,
        affilantejson,
        10
      );
      for (const ntlink of nextlinks) {
        await LaunchAnalyse(ntlink, affilantejson, page);
      }
      await updateCookie(page, Filecookie);
      await browser.close();
    } else if (!fs.existsSync(foldersearch + "/" + filesearch)) {
      console.log("erro : file not existe");
    } else if (!fs.existsSync(foldersearch)) {
      console.log("error : folder not existe ");
    }
  }
}
main();
