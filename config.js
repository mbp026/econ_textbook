// Configuration file for Economics Textbook Reader

const CONFIG = {
    // Manual Chapter Configuration
    // Format: { chapter: number, title: string, startPage: number, endPage: number }
    CHAPTERS: [
        // Part I: Introduction
        { chapter: 1, title: "Ten Principles of Economics", startPage: 36, endPage: 51 },
        { chapter: 2, title: "Thinking Like an Economist", startPage: 52, endPage: 79 },
        { chapter: 3, title: "Interdependence and the Gains from Trade", startPage: 80, endPage: 95 },

        // Part II: How Markets Work
        { chapter: 4, title: "The Market Forces of Supply and Demand", startPage: 96, endPage: 121 },
        { chapter: 5, title: "Elasticity and Its Application", startPage: 122, endPage: 145 },
        { chapter: 6, title: "Supply, Demand, and Government Policies", startPage: 146, endPage: 167 },

        // Part III: Markets and Welfare
        { chapter: 7, title: "Consumers, Producers, and the Efficiency of Markets", startPage: 168, endPage: 187 },
        { chapter: 8, title: "Application: The Costs of Taxation", startPage: 188, endPage: 203 },
        { chapter: 9, title: "Application: International Trade", startPage: 204, endPage: 223 },

        // Part IV: The Economics of the Public Sector
        { chapter: 10, title: "Externalities", startPage: 224, endPage: 245 },
        { chapter: 11, title: "Public Goods and Common Resources", startPage: 246, endPage: 261 },
        { chapter: 12, title: "The Economics of Healthcare", startPage: 262, endPage: 281 },
        { chapter: 13, title: "The Design of the Tax System", startPage: 282, endPage: 301 },

        // Part V: Firm Behavior and the Organization of Industry
        { chapter: 14, title: "The Costs of Production", startPage: 302, endPage: 321 },
        { chapter: 15, title: "Firms in Competitive Markets", startPage: 322, endPage: 345 },
        { chapter: 16, title: "Monopoly", startPage: 346, endPage: 375 },
        { chapter: 17, title: "Monopolistic Competition", startPage: 376, endPage: 393 },
        { chapter: 18, title: "Oligopoly", startPage: 394, endPage: 415 },

        // Part VI: The Economics of Labor Markets
        { chapter: 19, title: "The Markets for the Factors of Production", startPage: 416, endPage: 437 },
        { chapter: 20, title: "Earnings and Discrimination", startPage: 438, endPage: 455 },
        { chapter: 21, title: "Income Inequality and Poverty", startPage: 456, endPage: 477 },

        // Part VII: Topics for Further Study
        { chapter: 22, title: "The Theory of Consumer Choice", startPage: 478, endPage: 505 },
        { chapter: 23, title: "Frontiers of Microeconomics", startPage: 506, endPage: 525 },

        // Part VIII: The Data of Macroeconomics
        { chapter: 24, title: "Measuring a Nation's Income", startPage: 526, endPage: 545 },
        { chapter: 25, title: "Measuring the Cost of Living", startPage: 546, endPage: 563 },

        // Part IX: The Real Economy in the Long Run
        { chapter: 26, title: "Production and Growth", startPage: 564, endPage: 587 },
        { chapter: 27, title: "Saving, Investment, and the Financial System", startPage: 588, endPage: 609 },
        { chapter: 28, title: "The Basic Tools of Finance", startPage: 610, endPage: 625 },
        { chapter: 29, title: "Unemployment", startPage: 626, endPage: 649 },

        // Part X: Money and Prices in the Long Run
        { chapter: 30, title: "The Monetary System", startPage: 650, endPage: 673 },
        { chapter: 31, title: "Money Growth and Inflation", startPage: 674, endPage: 699 },

        // Part XI: The Macroeconomics of Open Economies
        { chapter: 32, title: "Open-Economy Macroeconomics: Basic Concepts", startPage: 700, endPage: 721 },
        { chapter: 33, title: "A Macroeconomic Theory of the Open Economy", startPage: 722, endPage: 743 },

        // Part XII: Short-Run Economic Fluctuations
        { chapter: 34, title: "Aggregate Demand and Aggregate Supply", startPage: 744, endPage: 781 },
        { chapter: 35, title: "The Influence of Monetary and Fiscal Policy on Aggregate Demand", startPage: 782, endPage: 805 },
        { chapter: 36, title: "The Short-Run Trade-off between Inflation and Unemployment", startPage: 806, endPage: 831 },

        // Part XIII: Final Thoughts
        { chapter: 37, title: "Six Debates over Macroeconomic Policy", startPage: 832, endPage: 853 },
        { chapter: 38, title: "Appendix: How Economists Use Data", startPage: 854, endPage: 870 }
    ]
};
