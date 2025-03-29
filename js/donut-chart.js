// Load the CSV file and prepare the data
d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", row => ({
    Screen_Tech: row["Screen_Tech"], // Screen technology as a string
    Mean: +row["Mean(Labelled energy consumption (kWh/year))"] // Convert mean to a number
})).then(data => {
    // Draw the donut chart
    drawDonutChart(data, "#chart4");
});

const drawDonutChart = (data, containerId) => {
    // Set up chart dimensions
    const scaleFactor = 0.8; // Scale the chart to 80% of the container size
    const containerWidth = 500; // Width of the container
    const containerHeight = 500; // Height of the container
    const width = containerWidth * scaleFactor;
    const height = containerHeight * scaleFactor;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5; // Inner radius for the donut hole

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.Screen_Tech)) // Map screen technologies
        .range(d3.schemeCategory10); // Use D3's category color scheme

    // Create SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`) // Set viewBox for responsiveness
        .attr("preserveAspectRatio", "xMidYMid meet") // Ensure the chart is centered
        .classed("responsive-svg", true) // Optional class for styling
        .append("g")
        .attr("transform", `translate(${containerWidth / 2},${containerHeight / 2})`); // Center the chart

    // Create pie generator
    const pie = d3.pie()
        .value(d => d.Mean) // Use the mean energy consumption as the value
        .sort(null); // Disable sorting to keep the original order

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(innerRadius) // Inner radius for the donut hole
        .outerRadius(radius) // Outer radius of the donut
        .cornerRadius(10);

    // Bind data and create the donut chart
    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Screen_Tech)) // Color based on screen technology
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add labels to the chart
    svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`) // Position at the center of each slice
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => d.data.Screen_Tech); // Display the screen technology
};