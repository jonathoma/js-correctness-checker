#!/usr/bin/env Rscript
 
library(ggplot2)
library(wesanderson)
 
output <- "dom_plot.png"
data <- read.csv("../scores/dom_scores.txt", header=TRUE, sep=",")
png(output, height=2.5, width=5, units="in", res=300)
ggplot(data, aes(x=data$score, colour=data$type)) +
    stat_ecdf(pad=TRUE) +
    xlab("DOM difference ratio") +
    ylab("CDF across sites") +
    guides(fill=guide_legend(title="Config")) +
    coord_cartesian(xlim=c(0, 0.5),ylim=c(0, 1)) +
    scale_x_continuous(expand=c(0, 0)) +
    scale_y_continuous(expand=c(0, 0)) +
    scale_linetype_manual(values=c("solid","dotted","dashed")) +
    theme_bw() +
    guides(fill = guide_legend(nrow = 1))+
    theme(
        legend.title=element_blank(),
        legend.background=element_rect(color="darkgray", fill="white", linetype="solid", size=0.3),
        legend.key=element_blank(),
        legend.key.height=unit(12, "points"),
        legend.key.width=unit(30, "points"),
        legend.position=c(0.83, 0.30),
        axis.title=element_text(size=15),
        axis.text=element_text(size=14),
        legend.text=element_text(size=8),
        axis.title.y=element_text(margin=margin(0, 20, 0, 0)),
        axis.title.x=element_text(margin=margin(10, 0, 0, 0)),
        plot.margin=unit(c(0.5,0.5,0.5,0.5),"cm"))
.junk <- dev.off()
 
output <- "network_plot.png"
data <- read.csv("../scores/network_scores.txt", header=TRUE, sep=",")
png(output, height=2.5, width=5, units="in", res=300)
ggplot(data, aes(x=data$score, colour=data$type)) +
    stat_ecdf(pad=TRUE) +
    xlab("Network request difference ratio") +
    ylab("CDF across sites") +
    guides(fill=guide_legend(title="Config")) +
    coord_cartesian(xlim=c(0, 0.25),ylim=c(0, 1)) +
    scale_x_continuous(expand=c(0, 0)) +
    scale_y_continuous(expand=c(0, 0)) +
    scale_linetype_manual(values=c("solid","dotted","dashed")) +
    theme_bw() +
    guides(fill = guide_legend(nrow = 1))+
    theme(
        legend.title=element_blank(),
        legend.background=element_rect(color="darkgray", fill="white", linetype="solid", size=0.3),
        legend.key=element_blank(),
        legend.key.height=unit(12, "points"),
        legend.key.width=unit(30, "points"),
        legend.position=c(0.83, 0.30),
        axis.title=element_text(size=15),
        axis.text=element_text(size=14),
        legend.text=element_text(size=8),
        axis.title.y=element_text(margin=margin(0, 20, 0, 0)),
        axis.title.x=element_text(margin=margin(10, 0, 0, 0)),
        plot.margin=unit(c(0.5,0.5,0.5,0.5),"cm"))
.junk <- dev.off()

output <- "screenshot_plot.png"
data <- read.csv("../scores/screenshot_scores.txt", header=TRUE, sep=",")
png(output, height=2.5, width=5, units="in", res=300)
ggplot(data, aes(x=data$score, colour=data$type)) +
    stat_ecdf(pad=TRUE) +
    xlab("Screenshot difference ratio") +
    ylab("CDF across sites") +
    guides(fill=guide_legend(title="Config")) +
    coord_cartesian(xlim=c(0, 1),ylim=c(0, 1)) +
    scale_x_continuous(expand=c(0, 0)) +
    scale_y_continuous(expand=c(0, 0)) +
    scale_linetype_manual(values=c("solid","dotted","dashed")) +
    theme_bw() +
    guides(fill = guide_legend(nrow = 1))+
    theme(
        legend.title=element_blank(),
        legend.background=element_rect(color="darkgray", fill="white", linetype="solid", size=0.3),
        legend.key=element_blank(),
        legend.key.height=unit(12, "points"),
        legend.key.width=unit(30, "points"),
        legend.position=c(0.83, 0.30),
        axis.title=element_text(size=15),
        axis.text=element_text(size=14),
        legend.text=element_text(size=8),
        axis.title.y=element_text(margin=margin(0, 20, 0, 0)),
        axis.title.x=element_text(margin=margin(10, 0, 0, 0)),
        plot.margin=unit(c(0.5,0.5,0.5,0.5),"cm"))
.junk <- dev.off()

output <- "naive_comparison_plot.png"
data <- read.csv("../scores/naive_comparison.txt", header=TRUE, sep=",")
png(output, height=2.5, width=5, units="in", res=300)
ggplot(data, aes(x=data$score, colour=data$type)) +
    stat_ecdf(pad=TRUE) +
    xlab("DOM difference ratio") +
    ylab("CDF across sites") +
    guides(fill=guide_legend(title="Config")) +
    coord_cartesian(xlim=c(0, 0.5),ylim=c(0, 1)) +
    scale_x_continuous(expand=c(0, 0)) +
    scale_y_continuous(expand=c(0, 0)) +
    scale_linetype_manual(values=c("solid","dotted","dashed")) +
    theme_bw() +
    guides(fill = guide_legend(nrow = 1))+
    theme(
        legend.title=element_blank(),
        legend.background=element_rect(color="darkgray", fill="white", linetype="solid", size=0.3),
        legend.key=element_blank(),
        legend.key.height=unit(12, "points"),
        legend.key.width=unit(30, "points"),
        legend.position=c(0.83, 0.30),
        axis.title=element_text(size=15),
        axis.text=element_text(size=14),
        legend.text=element_text(size=8),
        axis.title.y=element_text(margin=margin(0, 20, 0, 0)),
        axis.title.x=element_text(margin=margin(10, 0, 0, 0)),
        plot.margin=unit(c(0.5,0.5,0.5,0.5),"cm"))
.junk <- dev.off()


output <- "naive_comparison_plot.png"
data <- read.csv("../scores/naive_comparison.txt", header=TRUE, sep=",")
png(output, height=2.5, width=5, units="in", res=300)
ggplot(data, aes(x=data$score, colour=data$type)) +
    stat_ecdf(pad=TRUE) +
    xlab("DOM difference ratio") +
    ylab("CDF across sites") +
    guides(fill=guide_legend(title="Config")) +
    coord_cartesian(xlim=c(0, 0.5),ylim=c(0, 1)) +
    scale_x_continuous(expand=c(0, 0)) +
    scale_y_continuous(expand=c(0, 0)) +
    scale_linetype_manual(values=c("solid","dotted","dashed")) +
    theme_bw() +
    guides(fill = guide_legend(nrow = 1))+
    theme(
        legend.title=element_blank(),
        legend.background=element_rect(color="darkgray", fill="white", linetype="solid", size=0.3),
        legend.key=element_blank(),
        legend.key.height=unit(12, "points"),
        legend.key.width=unit(30, "points"),
        legend.position=c(0.83, 0.30),
        axis.title=element_text(size=15),
        axis.text=element_text(size=14),
        legend.text=element_text(size=8),
        axis.title.y=element_text(margin=margin(0, 20, 0, 0)),
        axis.title.x=element_text(margin=margin(10, 0, 0, 0)),
        plot.margin=unit(c(0.5,0.5,0.5,0.5),"cm"))
.junk <- dev.off()
