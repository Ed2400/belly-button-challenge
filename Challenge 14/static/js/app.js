const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Console logging the data from the URL
d3.json(url).then(function(jsonData){
    console.log(jsonData)
})
//According to the result, we have names, metadata and samples as available arrays


//Reading the data, extracting the first subject's data and using it to run the inital bar chart function
d3.json(url).then(function(jsonData){
    let subjectID = jsonData.names[0];
    initialChart(subjectID)
});

// Define function for the initial chart
function initialChart(subjectID){
    d3.json(url).then(function(jsonData){
        let subjectSelector = d3.select("#selDataset");
        let subjectNames = jsonData.names;
        subjectNames.forEach(function(subjectName){
            subjectSelector.append("option").text(subjectName);
        })
    
        barChart(subjectID);
        bubbleChart(subjectID);
        demographicInfo(subjectID);

    })
}


//Define function for building the barCharts
function barChart(subjectID){
    d3.json(url).then(function(jsonData){
        let subjectData = jsonData.samples.filter(x => x.id == subjectID);


        let barChartData = [{
            x : subjectData[0].sample_values.slice(0,10).reverse(),
            y : subjectData[0].otu_ids.slice(0, 10).reverse(),
            type : "bar",
            orientation : "h",
            text : subjectData[0].otu_labels.slice(0,10).reverse()
        }];

        let barChartLayout = {
            height : 500,
            width : 600,
            yaxis : {type : "category"}
        }

        Plotly.newPlot("bar", barChartData, barChartLayout)
    })
};


//Define function for the bubble chart
function bubbleChart(subjectID){
    d3.json(url).then(function(jsonData){
        let subjectData = jsonData.samples.filter(x => x.id == subjectID);


        let bubbleChartData = [{
            x : subjectData[0].otu_ids,
            y : subjectData[0].sample_values,
            text : subjectData[0].otu_labels,
            mode : "markers",
            marker : {
                color : subjectData[0].otu_ids,
                size : subjectData[0].sample_values
            }
        }];

        let bubbleChartLayout = {
            title : "Bacteria",
            showlegend : false,
            height: 600,
            width: 900
          };

        Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout)
    })
};




//Define function for the demographic information
function demographicInfo(subjectID){
    d3.json(url).then(function(jsonData){
        let subjectData = jsonData.metadata.filter(x => x.id == subjectID);

        const sampleMetadata = document.getElementById("sample-metadata");
        sampleMetadata.innerHTML = `id: ${String(subjectData[0].id)} 
        <br>ethnicity: ${subjectData[0].ethnicity}
        <br>gender: ${subjectData[0].gender}
        <br>age: ${subjectData[0].age}
        <br>location: ${subjectData[0].location}
        <br>bbtype: ${subjectData[0].bbtype}
        <br>wfreq: ${subjectData[0].wfreq}`
    })

};


//Define the optionChanged function present in the HTML, in order to actually change the visualizations according to the selected SubjectID

function optionChanged(subjectID){
    barChart(subjectID);
    bubbleChart(subjectID);
    demographicInfo(subjectID);
};