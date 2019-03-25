import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

def read_data(filename):
    data = {}
    current_site = ""
    with open(filename, 'r') as f:
        next(f)
        for line in f:
            if line.startswith('www'):
                current_site = line.strip()
            else:
                l = line.strip().split()
                differences = {"diff_score": 0}
                for label, val in list(zip(l[::2],l[1::2])):
                    differences[label] = val
                differences["diff_score"] = next(f).strip()
                data[current_site] = differences
    return data

def get_diff_scores(data):
    scores = []
    for site in data.values():
        scores.append(site["diff_score"])
    scores.sort()
    return scores

def plot(raw_scores, modified_scores, live_scores):
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.xaxis.set_major_locator(plt.MultipleLocator(5))
    ax.xaxis.set_major_formatter(ticker.FormatStrFormatter("%.1f"))
    
    n, bins, patches = ax.hist(raw_scores, density=True, histtype='step', cumulative=True, label='Raw Replay')
    patches[0].set_xy(patches[0].get_xy()[:-1])
    n, bins, patches = ax.hist(modified_scores, density=True, histtype='step', cumulative=True, label='Modified Replay')
    patches[0].set_xy(patches[0].get_xy()[:-1])
    n, bins, patches = ax.hist(live_scores, density=True, histtype='step', cumulative=True, label='Live')
    patches[0].set_xy(patches[0].get_xy()[:-1])

    ax.legend(loc='right')
    ax.set_title('CDF of DOM Differences')
    ax.set_xlabel('DOM Difference %')

    plt.show()

def main():
    raw_data = read_data("raw_output.txt")
    modified_data = read_data("modified_output.txt")
    live_data = read_data("live_output.txt")
    raw_scores = get_diff_scores(raw_data)
    modified_scores = get_diff_scores(modified_data)
    live_scores = get_diff_scores(live_data)
    plot(raw_scores, modified_scores, live_scores)

if __name__ == "__main__":
    main()
