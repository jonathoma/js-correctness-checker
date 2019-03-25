// Node script to get a specified number of DOM samples 
// from a website with a timeout using Chrome Remote Interface.

const fs = require('fs');
const chromelauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

const argv = require('minimist')(process.argv.slice(2), 
	opts = {
	    default: {
		"filename": "output/",
		"numSamples" : 1,
		"timeout" : 5,
	    }
	});
const url = "https://" + argv['url'];
const filename = argv['filename'] + argv['url'];
const numSamples = argv['numSamples'];
const timeout = argv['timeout'] * 1000;

async function get_dom(counter) {
    const script = fs.readFileSync('download_sample.js').toString();
    const chrome = await chromelauncher.launch({
        port: 9222,                                       
        chromeFlags: ['--headless']
    });
    const client = await CDP();
    const {DOM, Console, Network, Page, Runtime, Security} = client;
    Security.certificateError(({eventId}) => {
        Security.handleCertificateError({
            eventId,
            action: 'continue'
        });
    }); 
    try {
        await DOM.enable();
        await Network.enable();
        await Page.enable();
        await Runtime.enable();
        await Console.enable();
        await Security.enable();
        
        await Security.setOverrideCertificateErrors({override: true});
        await Network.setCacheDisabled({cacheDisabled: true});
        await Page.addScriptToEvaluateOnLoad({ scriptSource: script });
        await Page.navigate({url: url});
        await Page.loadEventFired();
        
        const result = await Runtime.evaluate({
            expression: 'document.documentElement.outerHTML;'
        });
        const html = result.result.value;
        
        fs.writeFileSync(filename + "_" + counter + ".txt", html);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
    await chrome.kill();
}

(async function() {
    for (let i = 0; i < numSamples; i++) {
        setTimeout(get_dom, timeout * i, i);
    }
})();

