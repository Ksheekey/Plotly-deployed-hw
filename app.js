// reading the json file to append the dropdown dynamically
d3.json("./samples.json").then((d) => {
    d3.select("#selDataset")
            .selectAll("option")
            .data(d.names)
            .enter()
            .append("option")
            .html(function(d) {
                return `<option value=${d}>${d}</option>`
            })
})


// setting default arrays
var dataData = [1,2,3,4,5,6,7,8,9,10]
var sortOTUs = ["hw","challenge","plotly","script","java","camp","boot","science","data","rutgers"]
var textInfo = ["hw","challenge","plotly","script","java","camp","boot","science","data","rutgers"]

// Display the default plot
function defaultplot() {
    //BAR CHART DEFAULT
    var traceBar = {
        x:dataData,
        y:sortOTUs,
        text:textInfo,
        type:"bar",
        orientation:"h"
    }

    var dataBar = [traceBar]

    var layoutBar = {
        title: 'Hover over the points to see the text',
    };

    //BUBBLE DEFAULT
    var bubbleX = [1, 2, 3, 4]
    var bubbleY = [26, 27, 28, 29]
    var otuLabels = []

    var maxmarkerSize = 40;
    var size = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]
    var traceBubble = {
        x: bubbleX,
        y: bubbleY,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
            size: size,
            sizeref: 2.0 * d3.max(size) / (maxmarkerSize**2),
            sizemode: 'area'
        }
    };
    
    var dataBubble = [traceBubble]

    var layoutBubble = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 500,
        width: 1100
      };

    //DISPLAY DEFAULTS
    Plotly.newPlot("bar", dataBar, layoutBar)
    Plotly.newPlot("bubble", dataBubble, layoutBubble)
}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(sample) {
    d3.json("./samples.json").then((d) => {
        //setting up variable and filtering for the charts
        var samples = d.samples;
        var filterArray = samples.filter(sampleObject=>sampleObject.id==sample);
        var sampleValues = filterArray[0].sample_values;
        var otuIds = filterArray[0].otu_ids;
        
        //filtering data for the demographic info panel
        var metaData = d.metadata;
        var filterMeta = metaData.filter(sampleObject=>sampleObject.id==sample)
        var slicedMeta = filterMeta.slice()
        console.log(Object.values(slicedMeta)[0])
        
        //inserting the demographic info to the panel
        d3.select(".panel-body")
            .selectAll("div")
            .data(slicedMeta)
            .enter()
            .append("div")
            .html(function(d) {
                return `<div>${filterMeta[0][0]}: ${d.id}</div>
                <div>ethnicity: ${d.ethnicity}</div>
                <div>gender: ${d.gender}</div>
                <div>age: ${d.age}</div>
                <div>location: ${d.location}</div>
                <div>bbtype: ${d.bbtype}</div>
                <div>wfreq: ${d.wfreq}</div>`

            })

        var otuLabels = filterArray[0].otu_labels;
        
        //creating empty lists for the (bar)chart info
        var sortOTUs = [];
        var dataData = [];
        var textInfo = [];
        //sorting the data into variables to call later
        var sortOTU = otuIds.sort((a,b)=>b-a).slice(0,10).reverse()
        var dataData = sampleValues.sort((a,b)=>b-a).slice(0,10).reverse()
        var textInfo = otuLabels.sort((a,b)=>b-a).slice(0,10).reverse()
        
        // making the OTU ID's into a string for the bar chart Y axis labels
        sortOTU.forEach(function(xx) {
            sortOTUs.push(`OTU ${xx}`)
        })


        

        
        //BUBBLE WORK***************
        var bubbleX = otuIds.sort((a,b)=>b-a).reverse()
        var bubbleY = sampleValues.reverse()
        var size = sampleValues.reverse()
        
        //var maxmarkerSize = d3.max(sampleValues)
        var minmarkerSize = d3.min(sampleValues)
        //var desired_maximum_marker_size = sampleValues.max()
        var sizeRef = Math.ceil(2.0 * d3.max(size) / (maxmarkerSize**2))

        // colors for bubble
        var color = []
        const colorChoice = ["red","blue","orange","green","pink"];
        const random = Math.floor(Math.random() * colorChoice.length);
        for (var k = 0; k<sampleValues.length; k++) {
            color.push(k,colorChoice[random])
        }
        
        //reestablishing bubble chart to change with selection
        var maxmarkerSize = d3.max(sampleValues);
        var size = size
        var traceBubble = {
        x: bubbleX,
        y: bubbleY,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: color,
            size: size,
            sizeref: 2.0 * d3.max(size) / (maxmarkerSize**2),
            sizemode: 'area'
            }
        };
    
        var dataBubble = [traceBubble]
        
        var layoutBubble = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 500,
        width: 1100
        };

        //Display new bubble
        Plotly.newPlot("bubble", dataBubble, layoutBubble)
    
        // Call function to update the chart
        updatePlotlyBarX(dataData);
        updatePlotlyBarY(sortOTUs);
        updatePlotlyBarText(textInfo);
    })

    //resetting the demographic info after each selection
    d3.select(".panel-body").html("")
}

//Update the restyled plot's values
function updatePlotlyBarX(newdata) {
    Plotly.restyle("bar", "x", [newdata]);
}
function updatePlotlyBarY(newdata) {
    Plotly.restyle("bar", "y", [newdata]);
}
function updatePlotlyBarText(newdata) {
    Plotly.restyle("bar", "text", [newdata]);
}

//calling defaults
defaultplot()