const drawBarChart = (data, containerId) => {
    // Set up chart dimensions
    const margin = { top: 40, right: 20, bottom: 50, left: 70 };
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech)) // Map screen technologies to the x-axis
        .range([0, innerWidth])
        .padding(0.2); // Add padding between bars

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Mean)]) // Set the y-axis domain from 0 to the max mean value
        .range([innerHeight, 0]);

    // Create SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Create inner chart
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    innerChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // Add axis labels
    innerChart.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Screen Technology");

    innerChart.append("text")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Mean Energy Consumption (kWh/year)");

    // Draw bars
    innerChart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", d => yScale(d.Mean))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.Mean))
        .attr("fill", "#69b3a2"); // Set bar color
};

// Load the CSV file and prepare the data
d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", row => ({
    Screen_Tech: row["Screen_Tech"], // Screen technology as a string
    Mean: +row["Mean(Labelled energy consumption (kWh/year))"] // Convert mean to a number
})).then(data => {
    // Draw the bar chart
    drawBarChart(data, "#chart3");
});