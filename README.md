#
pagecomp

Building a checker to compare postload Javascript DOMs.

The process of DOM comparison is undergone in several steps, which I will outline below.

## DOM Comparison

In this project, I wrote a tool to determine how similar two web pages are from the perspective of a user visiting either page. This was achieved by comparing the resulting post-load DOM trees of loading two web pages and quantifying how similar they were. Using this tool, we aim to form a better idea of how real web pages change over time.

To evaluate the appearance of the DOM in addition to the structure, we make a first pass over the source code and serialize the computed CSS styles into the DOM. We also make use of a more discerning algorithm for comparison than a naive tree diff.

## Network Comparison 

Toward the end of this project, we became interested in confirming the validity of our DOM comparison method, and so wished to add sanity checks by comparing network requests sent and received as well as screenshots of the loaded websites. In doing so, we found some discrepancies that needed further explanation.

In refining the metric we used for network requests comparison, we originally recorded all the network requests sent until the load event fired, immediately disabled the network and stored all the urls fetched. Upon closer inspection, we found many false positive differences due to tracking and analytics scripts that would create requests (using volatile data like time stamps), but not use the results of these requests to actually modify the DOM. As such, as a quick fix, we noticed that these requests returned extremely small resources, and set a minimum size threshold for recording the network request. This change greatly increased the number of matching network requests, and closer to the estimates from our DOM comparison as well.


## File structure

**NOTE: Run all scripts from pagecomp/dom directory.**

            - dom-compare # fork of Olegas/dom-compare (https://github.com/jonathoma/dom-compare/tree/pagecomp)
            |   ...
            - collector.js
            - compare.js
            |   ...
            - dom (https://github.com/jonathoma/pagecomp)
                - compare_samples.js
                - get_samples.js
                - serialize.js
                - node_modules
                |   ...
                - output # (populated from shell scripts)
                    - live
                        - www.google.com_dom_0.txt
                        - www.google.com_network_0.txt
                        - www.google.com_screenshot_0.png
                        | ...
                    - modified
                    |   ...
                    - naive
                    |   ...
                    - raw
                    |   ...
                - plots
                    - *_plot.png # (generated from plot_cdf.r)
                - replay_data
                    - modified
                    - raw
                - scores
                    - *_output.txt # (generated from shell scripts)
                    - *_scores.txt # (after running get_scores.py) 
                - shell
                    - run_live_comp.sh
                    - run_naive_comp.sh
                    - run_replay_comp.sh
                    - run_replay_mod_comp.sh

## Getting Samples

        node get_samples.js --numSamples  <number> --url <url> --output <output_dir>


## Comparing Samples

        node compare_samples --input <output_dir/ + url>


## Automation

        ./shell/run_*_comp.sh


## Plotting Results

        python get_scores.py
        Rscript plot_cdf.r

## Thanks

I would like to thank Prof. Harsha Madhyastha, Ayush Goel, and the Engineering Honors Program for mentorship and guidance throughout this project.
