import downloadData from "./helpers/downloadData.js";
import unpack from "./helpers/unpack.js";

const selector = document.getElementById('selection');

function draw(rows, key, e) {
    const select = e.target;
    const text = select.selectedOptions[0].textContent;
    
    rows = rows.filter(row => row.streams <1000000000);
    const data = [
        {
            x: unpack(rows, key),
            y: unpack(rows, "streams"),
            Text: unpack(rows, "track_name"),
            type: "scatter",
            mode: "markers",
        },
    ];

    const layout = {
        width: 500,
        height: 500,
        title:  text,
        font: { color: "white" },
        paper_bgcolor: "transparent",
        xaxis: {
            title: selector.value,
        },
        yaxis: {
            title: "Streams",
        },
        images: [
            {
                source: "../media/Fond graphique.png",
                xref: "paper",
                yref: "paper",
                x: 0,
                y: 0,
                sizex: 1.1,
                sizey: 1.1,
                xanchor: "left",
                yanchor: "bottom",
                layer: "below",
            },
        ],
    };
    Plotly.newPlot(document.getElementById("plot"),data, layout);
}

async function main() {
  let rows = await downloadData("../data/most_streamed_spotify-2023_clean.csv");
  selector.addEventListener('change',(e) => draw(rows, selector.value, e));
   
}

main();
