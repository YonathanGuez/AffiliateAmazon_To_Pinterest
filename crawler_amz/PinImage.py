# coding: utf-8
import os, json
import argparse
import unicodedata
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains

def loadjsoncookie(jsoncookie, browser):
    with open(jsoncookie, 'r') as bloc:
        distros_dict = json.load(bloc)
    for i in range(0, len(distros_dict)):
        browser.add_cookie(distros_dict[i])

def exportjsoncookie(filejson, browser):
    # print(browser.get_cookies())
    my_details = browser.get_cookies()
    with open(filejson, 'w') as json_file:
        json.dump(my_details, json_file, sort_keys=True, indent=4)

def click_element(valide):
    for v in valide:
        v.click()

def getcurrentpath(folder="", file=""):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    path_selenium = dir_path.replace("\\", "/")
    if folder == "" and file == "":
        return path_selenium
    if folder == "" and file != "":
        return path_selenium + "/" + file
    if folder != "" and file != "":
        return path_selenium + "/" + folder + "/" + file
    if folder != "" and file == "":
        return path_selenium + "/" + folder

def pin_image(browser, title_img, description_img, link_img, path_img):
    # got to the link table
    browser.get(link_pinterest)
    sleep(2)  # time for charge the page
    # Action
    connect_btn = browser.find_elements_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[1]/div/div/div/div/div[1]/div/div[1]/div/div/div/div/div/div/div/div/div[1]/div[1]/div/button')
    click_element(connect_btn)  # click on the add element +
    sleep(1)
    connect_pin = browser.find_elements_by_xpath('/html/body/div[2]/div/div/div/div/div/div/div[1]/div[2]/div')
    click_element(connect_pin)  # click on add epingle
    sleep(2)
    browser.find_element_by_id("media-upload-input").send_keys(path_img)
    sleep(1)
    title_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[1]/div[1]/div/div/div[1]/textarea')
    title_text.send_keys(title_img)
    sleep(0.5)
    description_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[1]/div[3]/div/div[1]/textarea')
    description_text.send_keys(description_img)
    sleep(0.5)
    link_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[1]/textarea')
    link_text.send_keys(link_img)
    browser.find_element_by_xpath('//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[1]/div/div[2]/div/div/div/button[2]').click()
    # wait publication
    sleep(4)
    actions = ActionChains(browser)
    actions.move_to_element_with_offset(browser.find_element_by_tag_name('body'), 0, 0)
    actions.move_by_offset(31, 413).double_click().perform()
    sleep(1)

def pin_image_subtable(browser, title_img, description_img, link_img, path_img):
    # got to the link table
    print(title_img,description_img,link_img,path_img)
    browser.get(link_pinterest)
    sleep(2)  # time for charge the page
    # Action
    connect_btn = browser.find_elements_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div/div[1]/div/div[1]/div/div/div/div/div/div/div/div/div[1]/div[1]/div/button')
    click_element(connect_btn)  # click on the add element +
    sleep(2)
    browser.find_element_by_id("media-upload-input").send_keys(path_img)
    sleep(1)
    title_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[1]/div[1]/div/div/div[1]/textarea')
    title_text.send_keys(title_img)
    sleep(0.5)
    description_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[1]/div[3]/div/div[1]/textarea')
    description_text.send_keys(description_img)
    sleep(0.5)
    link_text = browser.find_element_by_xpath(
        '//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[1]/textarea')
    link_text.send_keys(link_img)
    browser.find_element_by_xpath('//*[@id="__PWS_ROOT__"]/div[1]/div[3]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div[1]/div/div[2]/div/div/div/button[2]').click()
    # wait publication
    sleep(4)
    actions = ActionChains(browser)
    actions.move_to_element_with_offset(browser.find_element_by_tag_name('body'), 0, 0)
    actions.move_by_offset(31, 413).double_click().perform()
    sleep(1)

def write_json(data, filename='data.json'):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

def load_json(jsonload):
    with open(jsonload, 'r') as f:
        data = json.load(f)
        return data

def removeImg(repertoire):
    import os
    files = os.listdir(repertoire)
    for i in range(0,len(files)):
        os.remove(repertoire+'/'+files[i])

def filterchar(text):
    test = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')
    return test.decode('ascii')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cookiepin", help="increase output verbosity")
    parser.add_argument("--aljson", help="increase output verbosity")
    parser.add_argument("--tablepin", help="increase output verbosity")
    args = parser.parse_args()

    if args.cookiepin and args.aljson and args.tablepin:
        cookies = "cookies/"+args.cookiepin # "cookiespinterest.json"
        jsonlistlink = args.aljson #"affilateLink.json"
        tableau = args.tablepin #"fan-naruto"
        link_pinterest = "https://www.pinterest.fr/la_petite_boutade/" + tableau + "/"
        dicopin = {}
        if "/" in tableau:
            filepin = "pin-" + tableau.split("/")[1] +".json"
            print(filepin)
        else:
            filepin = "pin-" + tableau + ".json"
            
        if os.path.isfile(filepin):
            dicopin = load_json(filepin)
        if os.path.isfile(jsonlistlink) != True:
            raise ValueError(jsonlistlink, " do not exist")
        if os.path.isfile(cookies) != True:
            raise ValueError(cookies, " do not exist")
        else:
            # We begin the browser
            browser = webdriver.Chrome(executable_path='C:/chromedriver/chromedriver.exe')
            # we must put the full screen because we use the click position and we want to click on (31, 413)
            browser.maximize_window()
            # open a page before to load cookie
            browser.get("http://www.example.com")
            # load the old cookie
            loadjsoncookie(cookies, browser)

            with open(jsonlistlink, 'r') as f:
                data = json.load(f)
            for i in range(0, len(data)):
                name_img = data[i]['imagename']
                title_img = filterchar(data[i]['title'])
                description_img = filterchar(data[i]['title'])
                link_img = data[i]['link']
                path_img = getcurrentpath("img", name_img)
                if os.path.isfile(path_img):
                    if name_img not in dicopin:
                        # it s a subtable
                        if "/" in tableau:
                            pin_image_subtable(browser, title_img, description_img, link_img, path_img)
                            dicopin.update({name_img: title_img})
                        else:
                            # simple Pin in table root
                            pin_image(browser, title_img, description_img, link_img, path_img)
                            dicopin.update({name_img: title_img})
                    else:
                        print("Already Pin: ", name_img)
            write_json(dicopin,filepin)
            # export new cookies
            exportjsoncookie(cookies, browser)
            browser.quit()
            removeImg("img")
    else:
        raise ValueError("Arguments missing")
