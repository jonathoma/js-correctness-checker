require('module-alias/register');
const domCompare = require("@dom-compare");
const compare = domCompare.compare;
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const argv = require('minimist')(process.argv.slice(2), opts = {
    default: {
        "strip" : false, 
        "verbose": true, 
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
    let dom_1 = get_dom_from_file(input + "_1.txt", strip);
    let dom_2 = get_dom_from_file(input + "_2.txt", strip);
    let comp = compare(dom_1, dom_2);
    if (verbose) {
        console.log(comp.getDifferences());
    }
    console.log("\n%d nodes, %d attributes compared with %d differences. Diff score: %f", 
        comp.getTotalNodes(), comp.getTotalAttrs(), comp.getDifferences().length, comp.getSummary());
}

(function main() {
    let strip = argv['strip'];
    let verbose = argv['verbose'];
    let input = argv['input'];
    // simple_dom_test();
    // real_dom_test();
    file_dom_test(input, verbose, strip);
})();

