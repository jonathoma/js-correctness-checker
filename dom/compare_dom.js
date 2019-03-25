
require('module-alias/register');
const domCompare = require("@dom-compare");
const compare = domCompare.compare;
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const argv = require('minimist')(process.argv.slice(2), opts = {
    boolean: [
        "strip",
        "verbose"
    ],
    default: {
        "strip" : 0, 
        "verbose": 0, 
        "input": "output/output"
    }
});

function get_dom_from_file(filename, strip=false) {
    let text = fs.readFileSync(filename, 'utf8');
    if (strip) {
        text.replace('/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig', '');
    }
    const dom = new JSDOM(text);
    const { document } = dom.window;
    return document;
}

function file_dom_test(input, verbose, strip) {
    let dom_0 = get_dom_from_file(input + "_0.txt", strip);
    let dom_1 = get_dom_from_file(input + "_1.txt", strip);
    let comp = compare(dom_0, dom_1);
    if (verbose) {
        console.log(comp.getDifferences());
    }
    console.log("nodes %d attributes %d differences %d\n%f", 
        comp.getTotalNodes(), 
        comp.getTotalAttrs(), 
        comp.getDifferences().length, 
        comp.getSummary()
    );
}

(function main() {
    let strip = argv['strip'];
    let verbose = argv['verbose'];
    let input = argv['input'];
    file_dom_test(input, verbose, strip);
})();

