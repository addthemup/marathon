import React from 'react';
import { Card } from '@mantine/core';
import { ResponsiveLine } from '@nivo/line';

interface RepMonthlySalesProps {
  monthlySales: { [key: string]: number }; // Monthly sales data in the form of a key-value pair
}

const RepMonthlySales = ({ monthlySales }: RepMonthlySalesProps) => {
  // Parse sales data by year
  const salesByYear = Object.keys(monthlySales).reduce((acc, date) => {
    const [year, month] = date.split('-');
    if (!acc[year]) {
      acc[year] = [];
    }
    // Push numeric month (without leading zeros) and sales data
    acc[year].push({ x: parseInt(month, 10), y: monthlySales[date] });
    return acc;
  }, {} as { [key: string]: { x: number; y: number }[] });

  // Create Nivo data structure for multiple lines (each year is a line)
  const chartData = Object.keys(salesByYear).map((year) => ({
    id: year,
    data: salesByYear[year].sort((a, b) => a.x - b.x), // Sort months numerically from 1 to 12
  }));

  // Month labels for the x-axis (1 = January, 12 = December)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'linear', min: 1, max: 12 }}  // Use 'linear' scale for numeric months
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
            tickValues: Array.from({ length: 12 }, (_, i) => i + 1), // Ensure months are from 1 to 12
            tickFormat: (index) => monthLabels[index - 1], // Convert numeric months to labels
          }}
          axisLeft={{
            orient: 'left',
            legend: 'Gross Sales ($)',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default RepMonthlySales;
