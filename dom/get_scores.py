import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker


def read_data(filename):
    data = {}
    with open(filename, 'r') as f:
        next(f)
        current_site = ""
        for line in f:
            if line.startswith('www'):
                current_site = line.strip()
                continue
            data[current_site] = get_differences(line, f)
    return data


def get_differences(line, f):
    differences = {}
    differences["dom_diff_score"] = get_score(line)
    line = f.readline()
    differences["network_diff_score"] = get_score(line) 
    line = f.readline()
    differences["screenshot_diff_score"] = get_score(line) 
    return differences


def get_score(line):
    l = line.strip().split()
    num, diff = float(l[1]), float(l[3])
    return diff / num


def get_diff_scores(data):
    dom_scores = [site["dom_diff_score"] for site in data.values()]
    dom_scores.sort()
    network_scores = [site["network_diff_score"] for site in data.values()]
    network_scores.sort()
    screenshot_scores = [site["screenshot_diff_score"] for site in data.values()]
    screenshot_scores.sort()
    return dom_scores, network_scores, screenshot_scores


def write_file(outfile, live_scores, raw_scores, modified_scores, naive=False):
    with open(outfile, 'w') as f:
        f.write("type, score\n")
        if naive:
            write_naive_data(f, live_scores, raw_scores)
        else:
            write_data(f, live_scores, raw_scores, modified_scores)


def write_data(f, live_scores, raw_scores, modified_scores):
    for live in live_scores:
        f.write("live, " + str(live) + "\n")
    for raw in raw_scores:
        f.write("replay, " + str(raw) + "\n")
    for modified in modified_scores:
        f.write("modified, " + str(modified) + "\n")


def write_naive_data(f, live_scores, naive_scores):
    for custom in live_scores:
        f.write("custom, " + str(custom) + "\n")
    for naive in naive_scores:
        f.write("naive, " + str(naive) + "\n")


def main():
    raw_data = read_data("scores/raw_output.txt")
    modified_data = read_data("scores/modified_output.txt")
    live_data = read_data("scores/live_output.txt")

    raw_dom_scores, raw_network_scores, raw_screenshot_scores = get_diff_scores(raw_data)
    modified_dom_scores, modified_network_scores, modified_screenshot_scores = get_diff_scores(modified_data)
    live_dom_scores, live_network_scores, live_screenshot_scores = get_diff_scores(live_data)

    write_file("scores/dom_scores.txt", live_dom_scores, raw_dom_scores, modified_dom_scores)
    write_file("scores/network_scores.txt", live_network_scores, raw_network_scores, modified_network_scores)
    write_file("scores/screenshot_scores.txt", live_screenshot_scores, raw_screenshot_scores, modified_screenshot_scores)

    naive_data = read_data("scores/naive_output.txt")
    naive_dom_scores, _, _ = get_diff_scores(naive_data)
    write_file("naive_comparison.txt", live_dom_scores, naive_dom_scores, [], naive=True)

if __name__ == "__main__":
    main()
