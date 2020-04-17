function loadScript(url) {
  var x = new XMLHttpRequest();
  x.onload = function () {
    eval(x.responseText); // <---- !!!
  };
  x.open("GET", url);
  x.send();
}

function backgroundFunction() {
  const url = chrome.runtime.getURL("results.json");
  fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then((json) =>
      chrome.tabs.create({ url: json[0].link }, function (tab) {
        chrome.tabs.executeScript(tab.id, { file: "util.js" });
      })
    );
}
