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
            differences = {}

            # Get DOM tree diff information
            l = line.strip().split()
            # differences = {"diff_score": 0}
            for label, val in list(zip(l[::2], l[1::2])):
                differences[label] = val
            differences["dom_diff_score"] = next(f).strip()

            # Get network request diff information
            line = f.readline()
            l = line.strip().split()
            # l = next(f).strip.split()
            for label, val in list(zip(l[::2], l[1::2])):
                differences[label] = val
            differences["network_diff_score"] = next(f).strip()

            # Get screenshot diff information
            line = f.readline()
            l = line.strip().split()
            for label, val in list(zip(l[::2], l[1::2])):
                differences[label] = val
            differences["screenshot_diff_score"] = next(f).strip()

            data[current_site] = differences
    return data

def get_diff_scores(data):
    # scores = [(site["dom_diff_score"], site["network_diff_score"], site["screenshot_diff_score"]) for site in data.values()]
    dom_scores = [float(site["dom_diff_score"]) for site in data.values()]
    dom_scores.sort()
    network_scores = [float(site["network_diff_score"]) for site in data.values()]
    network_scores.sort()
    screenshot_scores = [float(site["screenshot_diff_score"]) for site in data.values()]
    screenshot_scores.sort()
    return dom_scores, network_scores, screenshot_scores

def main():
    raw_data = read_data("raw_output.txt")
    modified_data = read_data("modified_output.txt")
    live_data = read_data("live_output.txt")
    raw_dom_scores, raw_network_scores, raw_screenshot_scores = get_diff_scores(raw_data)
    modified_dom_scores, modified_network_scores, modified_screenshot_scores = get_diff_scores(modified_data)
    live_dom_scores, live_network_scores, live_screenshot_scores = get_diff_scores(live_data)
    with open("dom_scores.txt", 'w') as f:
        f.write("type, score\n")
        for live in live_dom_scores:
            f.write("live, " + str(live) + "\n")
        for raw in raw_dom_scores:
            f.write("replay, " + str(raw) + "\n")
        for modified in modified_dom_scores:
            f.write("modified, " + str(modified) + "\n")
    with open("network_scores.txt", 'w') as f:
        f.write("type, score\n")
        for live in live_network_scores:
            f.write("live, " + str(live) + "\n")
        for raw in raw_network_scores:
            f.write("replay, " + str(raw) + "\n")
        for modified in modified_network_scores:
            f.write("modified, " + str(modified) + "\n")
    with open("screenshot_scores.txt", 'w') as f:
        f.write("type, score\n")
        for live in live_screenshot_scores:
            f.write("live, " + str(live) + "\n")
        for raw in raw_screenshot_scores:
            f.write("replay, " + str(raw) + "\n")
        for modified in modified_screenshot_scores:
            f.write("modified, " + str(modified) + "\n")

    # Do naive vs our DOM comparison
    naive_data = read_data("naive_output.txt")
    naive_dom_scores, _, _ = get_diff_scores(naive_data)
    with open("naive_comparison.txt", 'w') as f:
        f.write("type, score\n")
        for custom in live_dom_scores:
            f.write("custom, " + str(custom) + "\n")
        for naive in naive_dom_scores:
            f.write("naive, " + str(naive) + "\n")

if __name__ == "__main__":
    main()
