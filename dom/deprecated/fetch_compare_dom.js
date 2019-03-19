const request = require("request");
const parser = require('html2hscript');
const xmldom = require("xmldom");
const xml_parser = new xmldom.DOMParser();
const puppeteer = require('puppeteer');
const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');


async function get_dom_from_request(url) {
    request(url, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return "";
        }
        if (response.statusCode != 200) {
            console.log('Got status code: ', response && response.statusCode); // Print the response status code if a response was received
            return "";
        } else {
            return body;
        }
    });
}

async function get_dom_from_browser(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'load'
    });

    const html = await page.content();
    await browser.close();
    return html;
}

function real_dom_test() {
    const url = "https://www.google.com";
    const source_dom_text = get_dom_from_request(url);
    const source_dom = new JSDOM(source_dom_text);

    const source_dom_text_2 = get_dom_from_request(url);
    const source_dom_2 = new JSDOM(source_dom_text);
    console.log("Fetch same twice: ", source_dom === source_dom_2);

    const rendered_dom_text = get_dom_from_browser(url);
    const rendered_dom = new JSDOM(rendered_dom_text);
    console.log(rendered_dom);
