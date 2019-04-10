require('module-alias/register');
const domCompare = require("@dom-compare");
const compare = domCompare.compare;
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jsdiff = require("diff");
const pixelmatch = require("pixelmatch");
const PNG = require('pngjs').PNG;

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

function compare_dom(input, verbose, strip) {
    // Compare DOM trees
    let dom_0 = get_dom_from_file(input + "_dom" + "_0.txt", strip);
    let dom_1 = get_dom_from_file(input + "_dom" + "_1.txt", strip);
    let comp = compare(dom_0, dom_1);
    if (verbose) {
        console.log(comp.getDifferences());
    }
    console.log("nodes %d dom_differences %d\n%f", 
        comp.getTotalNodes(), 
        comp.getDiffNodes(), 
        comp.getSummary()
    );
}

function compare_requests(input) {
    // Compare network requests
    let net_0 = fs.readFileSync(input + "_network" + "_0.txt", 'utf8'); 
    let net_1 = fs.readFileSync(input + "_network" + "_1.txt", 'utf8'); 
    net_0 = net_0.split("\n").sort().join("\n");
    net_1 = net_1.split("\n").sort().join("\n");
    let changes = jsdiff.diffLines(net_0, net_1); 
    let total_reqs = net_0.split("\n").length;
    console.log("requests %d network_differences %d", 
        total_reqs, 
        changes.length
    );
    console.log(changes.length / total_reqs);
}


function compare_screenshots(input) {
    // Compare screenshots
    let pic_data_0 = fs.readFileSync(input + "_screenshot" + "_0.png"); 
    let pic_data_1 = fs.readFileSync(input + "_screenshot" + "_1.png");
    let pic_0 = new PNG.sync.read(pic_data_0);
    let pic_1 = new PNG.sync.read(pic_data_1);
    let num_pixels_diff = pixelmatch(pic_0.data, pic_1.data, null, pic_0.width, pic_0.height);
    let total_pixels = pic_0.width * pic_0.height; 
    console.log("pixels %d screenshot_differences %d", 
        total_pixels,
        num_pixels_diff
    );
    console.log(num_pixels_diff / total_pixels);
}

(function main() {
    let strip = argv['strip'];
    let verbose = argv['verbose'];
    let input = argv['input'];
    compare_dom(input, verbose, strip);
    compare_requests(input);
    compare_screenshots(input);
})();

