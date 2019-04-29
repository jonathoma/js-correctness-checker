#!/bin/bash

# Run from dom/ directory

record() {
    echo "RECORDING RAW SAMPLES"
    for site in replay_data/modified/*; do
        url=${site##*/}
        node get_samples.js --url $url --filename output/raw/ --numSamples 1
        mm-webrecord replay_data/raw/$url chromium-browser --ignore-certificate-errors $url
        wait
        echo $url
    done
}

get() {
    echo "FETCHING RAW SAMPLES"
    numSamples=2
    for site in replay_data/raw/*; do
        url=${site##*/}
        # Code to only run a certain subset of websites
        # echo ${url:4:8}
        # if [[ ${url:4:8} < "digikala" ]];
        # then
        #     continue
        # fi
        timeout 60s mm-webreplay $site node get_samples.js --url $url --filename output/raw/ --numSamples $numSamples
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
        node compare_samples.js --input output/raw/$input
        wait
    done
}

# record
get
compare > scores/raw_output.txt
