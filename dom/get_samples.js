// Node script to get a specified number of DOM samples 
// from a website using Chrome Remote Interface.

const fs = require('fs');
const chromelauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

const argv = require('minimist')(process.argv.slice(2), 
	opts = {
	    default: {
		"filename": "output/",
		"numSamples" : 1,
	    }
	});
const url = "https://" + argv['url'];
const filename = argv['filename'] + argv['url'];
const numSamples = argv['numSamples'];
const script = fs.readFileSync('serialize.js', 'utf-8');

async function get_dom(counter) {
    const chrome = await chromelauncher.launch({
        port: 9222,
        chromeFlags: [
            // '--headless', 
            // '--js-flags=--stack-trace-limit 10000'
        ]
    });
    const client = await CDP();
    const {DOM, Console, Network, Page, Runtime, Security} = client;
    Security.certificateError(({eventId}) => {
        Security.handleCertificateError({
            eventId,
            action: 'continue'
        });
    }); 
    let network_requests = new Set(); 
    Network.requestWillBeSent((params) => {
        network_requests.add(params.request.url);
    });
    try {
        await DOM.enable();
        await Network.enable();
        await Page.enable();
        await Runtime.enable();
        await Console.enable();
        await Security.enable();
        
        await Security.setOverrideCertificateErrors({override: true});
        await Network.clearBrowserCache();
        await Network.clearBrowserCookies();
        await Network.setCacheDisabled({cacheDisabled: true});
        await Page.navigate({url: url});
        await Page.loadEventFired();
        await Network.disable();

        await Runtime.evaluate({
            expression: script
        });
        let html = await Runtime.evaluate({
            expression: 'document.documentElement.serializeWithStyles();'
        });
        html = html.result.value;
        const network_data = Array.from(network_requests).sort().join('\n');
        const {data} = await Page.captureScreenshot();

        // Write screenshot, network request data, and captured DOM to files
        fs.writeFileSync(filename + "_dom_" + counter + ".txt", html);
        fs.writeFileSync(filename + "_network_" + counter + ".txt", network_data);
        fs.writeFileSync(filename + "_screenshot_" + counter + ".png", Buffer.from(data, 'base64'));
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
    await chrome.kill();
}

(async function() {
    for (let i = 0; i < numSamples; i++) {
        await get_dom(i);
    }
})();

