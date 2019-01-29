const request = require("request");
const xmldom = require("xmldom");
const parser = new xmldom.DOMParser();
const domCompare = require("dom-compare");
const compare = domCompare.compare;
const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

function compare_simple_dom(dom_1, dom_2) {
    var doc1 = parser.parseFromString(dom_1);
    var doc2 = parser.parseFromString(dom_2);
    let result = compare(doc1, doc2);
    console.log(result);
    return result.getResult();
}

// async function get_dom_from_browser(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     
//     page.on('response', async (response) => {
//         const status = response.status();
//         console.log(status);
//         //if ((status >= 300) && (status <= 399)) {
//         //    console.log('Redirect from', 
//         //                response.url(), 
//         //                'to', 
//         //                response.headers()['location']);
//         //}
//         text = await response.text();
//         //console.log("This is the text: ", text);
//         return text;
//     });
//     
//     wait page.goto(url, {
//         waitUntil: 'domcontentloaded'
//     });
//     
//     setTimeout(async () => {
//         console.log("Closing browser");
//         await browser.close();
//     }, 5000); // Wait for 5 seconds before closing browser.
// }
 
function parse_dom(dom_text) {
    return parser.parseFromString(dom_text);
}

function main() {
    // Comparison of simple DOM    
    let doc_1 = "<document> \
        <element attribute=\"10\" attributeX=\"100\"> \
            <text>  text content  </text> \
            <inner> \ <node /> \</inner> \
        </element> \
        <![CDATA[  cdata node]]> \
    </document>"
    
    let doc_2 = "<document> \
        <!-- comment --> \
        <element attributeX=\"100\" attribute=\"10\"> \
            <text>  text content  </text> \
            <inner> \
                <node /> \
            </inner> \
        </element> \
        <![CDATA[  cdata node]]> \
    </document>"

    let doc_3 = "<document> \
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

    // Comparison of real DOM
    let url = "https://www.google.com";
    let source_dom_text = get_dom_from_request(url);
    let source_dom = new JSDOM(source_dom_text);
    // console.log(source_dom);

    // let source_dom_text_2 = get_dom_from_request(url);
    // let source_dom_2 = new JSDOM(source_dom_text);
    // console.log("Fetch same twice: ", source_dom === source_dom_2);

    let rendered_dom_text = get_dom_from_browser(url);
    let rendered_dom = new JSDOM(rendered_dom_text);
    // console.log(rendered_dom);

    // let rendered_dom_text_2 = get_dom_from_browser(url);
    // let rendered_dom_2 = new JSDOM(rendered_dom_text);
    // console.log("Load website same twice: ", rendered_dom === rendered_dom_2);

    console.log("\nComparison of real DOM example: "); 
    console.log(source_dom === rendered_dom);
}

main();

