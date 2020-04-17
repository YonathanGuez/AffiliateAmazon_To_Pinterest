window.addEventListener(
  "load",
  function () {
    buildpage();
    // adding listener to your button in popup window
    document.getElementById("press").addEventListener("click", function () {
      chrome.extension.getBackgroundPage().backgroundFunction();
    });
    // document.getElementById("press").addEventListener("click", injectTheScript);
  },
  false
);

function injectTheScript() {
  // Gets all tabs that have the specified properties, or all tabs if no properties are specified (in our case we choose current active tab)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Injects JavaScript code into a page
    chrome.tabs.executeScript(tabs[0].id, { file: "util.js" });
  });
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "results.json", true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function buildpage() {
  loadJSON(function (response) {
    // Create my list JSON
    var actual_JSON = JSON.parse(response);
    Promise.resolve()
      .then(() => {
        var newDiv = document.createElement("div");
        var att = document.createAttribute("class");
        att.value = "my_list";
        newDiv.setAttributeNode(att);
        document.getElementById("sources").appendChild(newDiv);
      })
      .then(() => {
        var p = document.createElement("p");
        var text = document.createTextNode("LIST: ");
        p.appendChild(text);
        document.getElementsByClassName("my_list")[0].appendChild(p);
      })
      .then(() => {
        for (var i = 0; i < actual_JSON.length; i++) {
          var newlink = document.createElement("a");
          newlink.setAttribute("id", i);
          newlink.setAttribute("class", "link_shirt_" + i);
          newlink.setAttribute("href", actual_JSON[i].link);
          document.getElementsByClassName("my_list")[0].appendChild(newlink);

          var p = document.createElement("p");
          p.setAttribute("class", "description");
          p.innerHTML = actual_JSON[i].description;
          document.getElementById(i).appendChild(p);
          var p2 = document.createElement("p");
          p2.setAttribute("class", "price");
          p2.innerHTML = actual_JSON[i].price;
          document.getElementById(i).appendChild(p2);

          var img = document.createElement("img");
          img.width = 50;
          img.height = 50;
          img.src = actual_JSON[i].image;
          document.getElementById(i).appendChild(img);
        }
      });
  });
}
