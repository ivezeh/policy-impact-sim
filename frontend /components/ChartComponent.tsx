import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface ChartData {
  labels: string[];
  values: number[];
}

const ChartComponent: React.FC<{ data: ChartData }> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Policy Impact Over Time',
        data: data.values,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;