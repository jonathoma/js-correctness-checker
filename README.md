# pagecomp

Building a checker to compare postload Javascript DOMs.

The process of DOM comparison is undergone in several steps, which I will outline below.

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

        ./shell/run_live_comp.sh > scores/live_output.txt


## Plotting Results

        python get_scores.py
        Rscript plot_cdf.r

## Thanks

I would like to thank Prof. Harsha Madhyastha, Ayush Goel, and the Engineering Honors Program for mentorship and guidance throughout this project.
