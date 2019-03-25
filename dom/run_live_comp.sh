#!/bin/bash

get() {
    echo "FETCHING LIVE SAMPLES"
    numSamples=3
    for site in ../replay_data/modified/*; do
        url=${site##*/}
        node get_samples.js --url $url --numSamples $numSamples --filename output/live/
        echo $url $?
        wait
    done
}

compare() {
    echo "COMPARING LIVE SAMPLES"
    files=()
    for file in output/live/*; do
        file=${file##*/}
        file=${file%%_[0-9].txt}
        files+=("$file")
    done
    inputs=($(printf "%s\n" "${files[@]}" | sort -u))
    for input in ${inputs[@]}; do
        echo $input
        node compare_dom.js --input output/live/$input
        wait
    done
}

# get
compare
