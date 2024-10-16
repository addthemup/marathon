import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { fetchMonthlySalesByBrand } from '../Api/BrandSalesApi';  // Import API call
import dayjs from 'dayjs';  // Install this package if not already installed: npm install dayjs

export function BrandSalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const data = await fetchMonthlySalesByBrand();

        // Transform data to match Nivo's expected format and only show the last 12 months
        const transformedData = transformDataForChart(data);
        setSalesData(transformedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load brand sales data');
        setLoading(false);
      }
    };

    loadSalesData();
  }, []);

  // Transform the API data into the format expected by Nivo, showing only the last 12 months
  const transformDataForChart = (data: any) => {
    const brandData: { [brandName: string]: { id: string, data: any[] } } = {};

    // Get the last 12 months in MM/YY format
    const currentMonth = dayjs().startOf('month');
    const last12Months = [...Array(12).keys()].map(i =>
      currentMonth.subtract(i, 'month').format('MM/YY')
    ).reverse();  // Reverse to show the most recent months last

    Object.keys(data).forEach((month) => {
      // Format the month in MM/YY format (e.g., 05/24)
      const formattedMonth = dayjs(month).format('MM/YY');

      // Only process if the month is in the last 12 months
      if (last12Months.includes(formattedMonth)) {
        const brands = data[month];
        Object.keys(brands).forEach((brand) => {
          if (!brandData[brand]) {
            brandData[brand] = { id: brand, data: [] };
          }
          brandData[brand].data.push({ x: formattedMonth, y: brands[brand] });
        });
      }
    });

    return Object.values(brandData);
  };

  if (loading) {
    return <div>Loading brand sales data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: '500px' }}>
      <ResponsiveLine
        data={salesData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,  // Rotate the text to avoid overlapping
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Sales',
          legendOffset: -40,
          legendPosition: 'middle'
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
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
}
