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

node GetAL_img.js --page 2  --search <Search>
```
node GetAL_img.js --page 2  --search T-Shirt Dragon-Ball
```
Result:
Folder: img -> all images downloaded
File: AL-<the research>.json => json with all afiliate link 

## Create Pin With Selenium :

Need to install Chromedriver i
```
python .\PinImage.py --cookiepin cookiespinterest.json --aljson AL-T-Shirt-Dragon-Ball.json --tablepin t-shirt-geek/fan-dragon-ball
```
