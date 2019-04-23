#!/bin/bash

get() {
    echo "FETCHING LIVE SAMPLES"
    numSamples=2
    for site in replay_data/modified/*; do
        url=${site##*/}
        node get_samples.js --url $url --numSamples $numSamples --filename output/live/
        wait
        echo $url $?
    done
}

compare() {
    echo "COMPARING LIVE SAMPLES"
    files=()
    for file in output/live/*; do
        file=${file##*/}
        file=${file%%_*_[0-9].txt}
        file=${file%%_*_[0-9].png}
        files+=("$file")
    done
    inputs=($(printf "%s\n" "${files[@]}" | sort -u))
    for input in ${inputs[@]}; do
        node compare_samples.js --input output/live/$input
        wait
    done
}

# get
compare
