const request = require("request");

const xmldom = require("xmldom");
const xml_parser = new xmldom.DOMParser();
const domCompare = require("../../dom-compare");
const compare = domCompare.compare;

const puppeteer = require('puppeteer');

const fs = require('fs');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const parser = require('html2hscript');

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

function get_dom_from_file(filename, strip=false) {
    let text = fs.readFileSync(filename, 'utf8');
    if (strip) {
        text.replace('/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig', '');
    }
    const dom = new JSDOM(text);
    const { document } = dom.window;
    return document;
}

function convert_html_to_hscript(text) {
    let parsed = "";
    parser(text, function(err, hscript) {
        parsed = hscript;
    });
    return parsed;
}

function compare_simple_dom(dom_1, dom_2) {
    var doc1 = xml_parser.parseFromString(dom_1);
    var doc2 = xml_parser.parseFromString(dom_2);
    const result = compare(doc1, doc2);
    console.log(result);
    return result.getResult();
}

function simple_dom_test() {
    // Comparison of simple DOM    
    const doc_1 = "<document> \
        <element attribute=\"10\" attributeX=\"100\"> \
            <text>  text content  </text> \
            <inner> \ <node /> \</inner> \
        </element> \
        <![CDATA[  cdata node]]> \
    </document>"
    
    const doc_2 = "<document> \
        <!-- comment --> \
        <element attributeX=\"100\" attribute=\"10\"> \
            <text>  text content  </text> \
            <inner> \
                <node /> \
            </inner> \
        </element> \
        <![CDATA[  cdata node]]> \
    </document>"

    const doc_3 = "<document> \
        <element attribute=\"10\" attributeX=\"100\"> \
            <text>text content</text> \
            <inner> \
                <node /> \
            </inner> \
        </element> \
        <![CDATA[  cdata node]]> \
    </document>"

    console.log("Comparison of simple DOM example: ");
    console.log("Comparing identical: ", compare_simple_dom(doc_1, doc_2, { stripSpaces : true }), "\n");
    console.log("Comparing different: ", compare_simple_dom(doc_2, doc_3), "\n");
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

    const rendered_dom_text_2 = get_dom_from_browser(url);
    const rendered_dom_2 = new JSDOM(rendered_dom_text);
    console.log("Load website same twice: ", rendered_dom === rendered_dom_2);

    console.log("\nComparison of real DOM example: "); 
    console.log(source_dom === rendered_dom);
}

function file_dom_test() {
    let dom_1 = get_dom_from_file("samples/google_1.txt");
    let dom_2 = get_dom_from_file("samples/google_2.txt");
    let comp = compare(dom_1, dom_2);

    console.log("%d / %d nodes differed. Diff score: %f", 
        comp.getDifferences().length, comp.getTotal(), comp.getSummary());
}

(function main() {
    // simple_dom_test();
    // real_dom_test();
    file_dom_test();
})();

