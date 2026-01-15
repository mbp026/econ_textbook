// Economics Vocabulary Dictionary
const vocabularyDict = {
    // Basic Economic Terms
    "economics": "The study of how individuals and societies allocate scarce resources to satisfy unlimited wants and needs.",
    "scarcity": "The fundamental economic problem of having unlimited wants but limited resources to satisfy them.",
    "opportunity cost": "The value of the next best alternative that is given up when making a choice.",
    "supply": "The quantity of a good or service that producers are willing and able to offer at various prices.",
    "demand": "The quantity of a good or service that consumers are willing and able to purchase at various prices.",
    "equilibrium": "The point where supply and demand curves intersect, determining market price and quantity.",
    "market": "A system where buyers and sellers exchange goods, services, or resources.",
    "price": "The monetary value assigned to a good or service in an exchange.",
    "quantity": "The amount of a good or service bought or sold in a market.",
    "elasticity": "A measure of how responsive quantity demanded or supplied is to changes in price or other factors.",

    // Production and Costs
    "production": "The process of creating goods and services from inputs or resources.",
    "productivity": "The efficiency of production, measured as output per unit of input.",
    "capital": "Physical assets like machinery, buildings, and equipment used in production.",
    "labor": "Human effort used in the production of goods and services.",
    "marginal cost": "The additional cost of producing one more unit of a good or service.",
    "fixed cost": "Costs that do not vary with the level of production in the short run.",
    "variable cost": "Costs that change with the level of production output.",
    "economies of scale": "Cost advantages that businesses obtain due to size, output, or scale of operation.",
    "factors of production": "The resources used to produce goods and services: land, labor, capital, and entrepreneurship.",

    // Market Structures
    "competition": "A market condition where many firms sell similar products with no single firm dominating.",
    "monopoly": "A market structure where a single firm is the sole producer of a product with no close substitutes.",
    "oligopoly": "A market structure dominated by a small number of large firms.",
    "perfect competition": "A market structure with many firms selling identical products with free entry and exit.",
    "barriers to entry": "Obstacles that make it difficult for new firms to enter a market.",

    // Macroeconomics
    "GDP": "Gross Domestic Product - the total monetary value of all goods and services produced within a country.",
    "inflation": "A sustained increase in the general price level of goods and services over time.",
    "deflation": "A sustained decrease in the general price level of goods and services over time.",
    "recession": "A significant decline in economic activity lasting more than a few months.",
    "unemployment": "The condition of people actively seeking work but unable to find jobs.",
    "fiscal policy": "Government policy regarding taxation and spending to influence the economy.",
    "monetary policy": "Central bank actions to control money supply and interest rates to achieve economic goals.",
    "interest rate": "The cost of borrowing money or the return on savings, expressed as a percentage.",

    // Trade and Exchange
    "trade": "The exchange of goods and services between parties.",
    "exports": "Goods and services produced domestically and sold to foreign countries.",
    "imports": "Goods and services purchased from foreign countries.",
    "comparative advantage": "The ability to produce a good at a lower opportunity cost than another producer.",
    "absolute advantage": "The ability to produce more of a good using the same resources than another producer.",
    "tariff": "A tax imposed on imported goods and services.",
    "quota": "A limit on the quantity of a good that can be imported or exported.",

    // Financial Terms
    "investment": "The purchase of goods that are not consumed today but used to create wealth in the future.",
    "savings": "Income that is not spent on current consumption.",
    "credit": "The ability to borrow money with the promise to repay it in the future.",
    "debt": "Money owed by one party to another.",
    "bond": "A fixed-income security representing a loan made by an investor to a borrower.",
    "stock": "A share of ownership in a corporation.",
    "dividend": "A portion of a company's earnings distributed to shareholders.",

    // Consumer Behavior
    "utility": "The satisfaction or benefit derived from consuming a good or service.",
    "marginal utility": "The additional satisfaction gained from consuming one more unit of a good.",
    "consumer surplus": "The difference between what consumers are willing to pay and what they actually pay.",
    "substitutes": "Goods that can be used in place of each other to satisfy similar needs.",
    "complements": "Goods that are typically consumed together.",
    "income effect": "The change in consumption resulting from a change in real income or purchasing power.",
    "substitution effect": "The change in consumption patterns due to a change in relative prices.",

    // Business and Profit
    "revenue": "The total income a firm receives from selling goods and services.",
    "profit": "The financial gain calculated as total revenue minus total costs.",
    "loss": "A negative profit; occurs when total costs exceed total revenue.",
    "break-even point": "The level of output where total revenue equals total cost.",
    "market share": "The percentage of total sales in a market captured by a particular company.",

    // Government and Policy
    "subsidy": "A financial assistance payment provided by the government to support businesses or consumers.",
    "tax": "A mandatory financial charge imposed by the government on individuals or businesses.",
    "regulation": "Rules and laws created by the government to control business practices.",
    "public goods": "Goods that are non-excludable and non-rivalrous, typically provided by the government.",
    "externality": "A cost or benefit affecting a party who did not choose to incur it.",
    "positive externality": "A beneficial side effect experienced by third parties not involved in a transaction.",
    "negative externality": "A harmful side effect experienced by third parties not involved in a transaction.",

    // Additional Terms
    "allocation": "The distribution of resources among different uses.",
    "incentive": "Something that motivates a person to take action.",
    "efficiency": "Using resources in a way that maximizes output or minimizes waste.",
    "equity": "Fairness in the distribution of resources or economic outcomes.",
    "market failure": "A situation where markets fail to allocate resources efficiently.",
    "appreciation": "An increase in the value of an asset or currency over time.",
    "depreciation": "A decrease in the value of an asset or currency over time.",
    "aggregate demand": "The total demand for goods and services in an economy at a given price level.",
    "aggregate supply": "The total supply of goods and services in an economy at a given price level.",
    "business cycle": "The fluctuation of economic activity characterized by periods of expansion and contraction.",
    "consumer price index": "A measure tracking the average change in prices paid by consumers for goods and services.",
    "CPI": "Consumer Price Index - a measure of inflation based on a basket of consumer goods.",
    "disposable income": "Income remaining after taxes that is available for spending and saving.",
    "exchange rate": "The value of one currency expressed in terms of another currency.",
    "human capital": "The skills, knowledge, and experience possessed by individuals.",
    "liquidity": "The ease with which an asset can be converted to cash.",
    "nominal": "Values measured in current prices without adjusting for inflation.",
    "real": "Values adjusted for inflation to reflect true purchasing power.",
    "wage": "Payment received by workers for their labor, typically per hour or salary.",
    "wealth": "The total value of assets owned minus liabilities owed.",
};

// Create case-insensitive lookup
const vocabLookup = {};
Object.keys(vocabularyDict).forEach(term => {
    vocabLookup[term.toLowerCase()] = vocabularyDict[term];
});
