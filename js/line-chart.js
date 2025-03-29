const drawAveragePriceChart = (data, containerId) => {
    // Set up chart dimensions
    const margin = { top: 40, right: 50, bottom: 40, left: 50 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)) // Use the year column for the x-axis
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)]) // Find the max value for averagePrice
        .range([innerHeight, 0]);

    // Set up axes
    const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Format years as integers
    const leftAxis = d3.axisLeft(yScale);

    // Create SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Create inner chart
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    innerChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // Add axis label
    innerChart
        .append("text")
        .text("Price ($ per megawatt hour)")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start");

    // Line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice))
        .curve(d3.curveMonotoneX); // Apply smoothing to the line

    // Draw the line for Average Price
    innerChart
        .append("path")
        .datum(data) // Bind the data
        .attr("class", "line-average-price")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#e377c2") // Color for Average Price
        .attr("stroke-width", 2);

    // Add label at the end of the line
    const lastPoint = data[data.length - 1];
    innerChart
        .append("text")
        .attr("class", "label-average-price")
        .attr("x", xScale(lastPoint.year) + 5)
        .attr("y", yScale(lastPoint.averagePrice))
        .attr("fill", "#e377c2")
        .style("font-size", "12px")
        .text("Average Price");
};

// Load the CSV file and prepare the data
d3.csv("data/Ex5_ARE_Spot_Prices.csv", row => ({
    year: +row.Year, // Convert Year to a number
    averagePrice: +row["Average Price (notTas-Snowy)"] // Convert Average Price to a number
})).then(data => {
    // Draw the chart for Average Price
    drawAveragePriceChart(data, "#chart2");
});