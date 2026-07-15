import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function ShipmentChart() {

  const data = {

    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ],

    datasets: [

      {
        label: "Completed Shipments",

        data: [
          180,
          240,
          210,
          310,
          280,
          360,
          420
        ],

        borderColor: "#38BDF8",

        backgroundColor: "rgba(56,189,248,.15)",

        fill: true,

        tension: .4,

        pointRadius: 5,

        pointHoverRadius: 7,

        pointBackgroundColor: "#38BDF8"

      }

    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false

      }

    },

    scales: {

      x: {

        grid: {

          color: "rgba(255,255,255,.05)"

        },

        ticks: {

          color: "#94A3B8"

        }

      },

      y: {

        grid: {

          color: "rgba(255,255,255,.05)"

        },

        ticks: {

          color: "#94A3B8"

        }

      }

    }

  };

  return (

    <div style={{height:"320px"}}>

      <Line
        data={data}
        options={options}
      />

    </div>

  );

}

export default ShipmentChart;