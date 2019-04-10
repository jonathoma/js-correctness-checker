#!/bin/bash

# Run from dom/ directory

record() {
    echo "RECORDING RAW SAMPLES"
    for site in ../replay_data/modified/*; do
        url=${site##*/}
        node get_samples.js --url $url --filename output/raw/ --numSamples 1
        mm-webrecord ../replay_data/raw/$url chromium-browser --ignore-certificate-errors $url
        wait
        echo $url
    done
}

get() {
    echo "FETCHING RAW SAMPLES"
    numSamples=3
    for site in ../replay_data/raw/*; do
        url=${site##*/}
        mm-webreplay $site node get_samples.js --url $url --filename output/raw/ --numSamples $numSamples
        wait
        echo $url $?
    done
}

compare() {
    echo "COMPARING RAW SAMPLES"
    files=()
    for file in output/raw/*; do
        file=${file##*/}
        file=${file%%_*_[0-9].txt}
        file=${file%%_*_[0-9].png}
        files+=("$file")
    done
    inputs=($(printf "%s\n" "${files[@]}" | sort -u))
    for input in ${inputs[@]}; do
        echo $input
        node compare_dom.js --input output/raw/$input
        wait
    done
}

if [[ -n $1 ]]; then
    # mm-webrecord ../replay_data/raw/$1 chromium-browser --ignore-certificate-errors $1
    # wait
    mm-webreplay ../replay_data/raw/$1 node get_samples.js --url $1 --filename output/raw/ --numSamples $numSamples
    wait
    node compare_dom.js --input output/raw/$1
else
    # record
    # get
    compare
fi
