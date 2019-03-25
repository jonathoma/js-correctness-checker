#!/bin/bash

get() {
    echo "FETCHING MODIFIED SAMPLES"
    numSamples=3
    for site in ../replay_data/modified/*; do
        url=${site##*/}
        mm-webreplay $site node get_samples.js --url $url --numSamples $numSamples --filename output/modified/
        wait
        echo $url $?
    done
}

compare() {
    echo "COMPARING MODIFIED SAMPLES"
    files=()
    for file in output/modified/*; do
        file=${file##*/}
        file=${file%%_[0-9].txt}
        files+=("$file")
    done
    inputs=($(printf "%s\n" "${files[@]}" | sort -u))
    for input in ${inputs[@]}; do
        echo $input
        node compare_dom.js --input output/modified/$input
        wait
    done
}

# get
compare
