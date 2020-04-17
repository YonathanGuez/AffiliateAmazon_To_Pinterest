window.addEventListener(
  "load",
  function () {
    analyse();
  },
  false
);

var href = window.location.href;
var hostname = window.location.hostname;
var pathname = window.location.pathname;

function click_affiliate(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      document
        .querySelector("#amzn-ss-text-link > span > span > strong > a")
        .click();
      resolve(time);
    }, time);
  });
}

function get_value_link(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const val = document.querySelector("#amzn-ss-text-shortlink-textarea")
        .value;
      resolve(val);
    }, time);
  });
}

async function Affilate_link() {
  const x = await click_affiliate(4000);
  const res = await get_value_link(3000);
  return res;
}

function WriteToFile() {
  var txt = new ActiveXObject("Scripting.FileSystemObject");
  var s = txt.CreateTextFile("11.txt", true);
  s.WriteLine("Hello");
  s.Close();
}
function analyse() {
  if (hostname === "www.amazon.fr") {
    var compare_community = document.querySelector(
      "#nav-link-accountList > span.nav-line-1"
    ).innerHTML;
    if (compare_community === "Bonjour Yonathan") {
      Affilate_link().then((msg) => alert(msg));
      WriteToFile();
    } else {
      alert("Pas Connecter");
    }
  } else {
    alert(hostname + "  != www.amazon.fr");
  }
}
