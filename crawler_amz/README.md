# Crawler_amz


## 1)  AmzSearchLink:
node .\AmzSearchLink.js <the research>
```
node .\AmzSearchLink.js  T-Shirt Star-wars
```
Result:
Folder -> the-research -> with all pages.json

## 2) GetAL_img.js
Before to run you need to update the cookies/cookies.json
it is for affilate managment of amz

node .\GetAL_img.js  <the research>
```
node .\GetAL_img.js T-Shirt Star-wars
```
Result:
Folder: img -> all images downloaded
File: AL-<the research>.json => json with all afiliate link 

## Create Pin With Selenium :

Need to install Chromedriver i
```
python .\PinImage.py --cookiepin cookiespinterest.json --aljson ALT-Shirt-Star-wars.json --tablepin fan-star-wars
```
