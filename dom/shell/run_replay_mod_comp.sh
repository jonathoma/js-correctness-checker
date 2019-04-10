#!/bin/bash

numSamples=3

get() {
    echo "FETCHING MODIFIED SAMPLES"
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
        file=${file%%_*_[0-9].txt}
        file=${file%%_*_[0-9].png}
        files+=("$file")
    done
    inputs=($(printf "%s\n" "${files[@]}" | sort -u))
    for input in ${inputs[@]}; do
        echo $input
        node compare_dom.js --input output/modified/$input
        wait
    done
}

if [[ -n $1 ]]; then
    wait
    mm-webreplay ../replay_data/modified/$1 node get_samples.js --url $1 --filename output/modified/ --numSamples $numSamples
    wait
    node compare_dom.js --input output/modified/$1
else
    # get
    compare
fi
