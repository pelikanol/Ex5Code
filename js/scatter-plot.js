// Load the CSV file using D3 with an arrow function for row conversion
d3.csv("data/Ex5_TV_energy.csv", row => ({
    brand: row.brand, // String
    screen_tech: row.screen_tech, // String
    screensize: +row.screensize, // Convert to number
    energy_consumpt: +row.energy_consumpt, // Convert to number
    star2: +row.star2, // Convert to number
    count: +row.count // Convert to number
})).then(data => {
    // Call the function to create the scatterplot
    createScatterPlot(data);
}).catch(error => {
    // Handle errors during data loading
    console.error("Error loading the CSV file:", error);
});

// Function to create the scatterplot
function createScatterPlot(data) {
    // Select the container div and get its width
    const container = d3.select("#chart1");
    const containerWidth = container.node().getBoundingClientRect().width;

    // Set up dimensions and margins
    const margin = { top: 50, right: 50, bottom: 70, left: 70 };
    const width = 800; // Fixed width for the viewBox
    const height = 500; // Fixed height for the viewBox

    // Clear any existing SVG (to prevent duplicates on resize)
    container.selectAll("svg").remove();

    // Create the SVG container with a viewBox for responsiveness
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .classed("responsive-svg", true) // Optional class for styling
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleLinear()
    .domain([1.5, d3.max(data, d => d.star2)]) // Set min to 0 and max dynamically based on the data
    .range([0, width]);

const yScale = d3.scaleLinear()
    // .domain(d3.extent(data, d => d.energy_consumpt))
    .domain([0, d3.max(data, d => d.energy_consumpt)]) // Extent of energy consumption
    .range([height, 0]);

    // Set up a color scale for screen_tech
    // const colorScale = d3.scaleOrdinal()
    //     .domain([...new Set(data.map(d => d.screen_tech))]) // Unique screen_tech values
    //     .range(d3.schemeTableau10); // Predefined D3 color scheme

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Star Rating (Energy Efficiency)");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Energy Consumption (kWh)");

    // Add points to the scatterplot
    svg.selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => xScale(d.star2))
            .attr("cy", d => yScale(d.energy_consumpt))
            .attr("r", 5) // Radius of the points
            .attr("fill", "steelblue") // Color based on screen_tech
            .attr("opacity", 0.7);

    // Add a legend for the color scale
    // const legend = svg.append("g")
    //     .attr("transform", `translate(${width + 20}, 0)`); // Position the legend to the right of the chart

    // const screenTechs = [...new Set(data.map(d => d.screen_tech))]; // Unique screen_tech values
    // screenTechs.forEach((tech, i) => {
    //     legend.append("circle")
    //         .attr("cx", 0)
    //         .attr("cy", i * 20)
    //         .attr("r", 5)
    //         .attr("fill", colorScale(tech));

        // legend.append("text")
        //     .attr("x", 10)
        //     .attr("y", i * 20 + 5)
        //     .text(tech)
        //     .style("font-size", "12px")
        //     .attr("alignment-baseline", "middle");
    // });

    // Log success message
    console.log("Scatterplot created successfully!");
}