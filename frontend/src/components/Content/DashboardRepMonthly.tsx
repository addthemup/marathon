import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Loader, Container, Grid, Avatar, Group, ActionIcon } from '@mantine/core';
import { fetchMonthlySalesBySalesRep } from '../Api/DashboardApi';

interface SalesRep {
  id: number;
  full_name: string;
  profile_pic: string | null;
}

interface SalesData {
  sales_rep: SalesRep;
  sales: { year: number; month: number; total_sales: number }[];
}

const DashboardRepMonthly: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [visibleReps, setVisibleReps] = useState<Set<number>>(new Set()); // Track visible reps by their IDs
  const [allSalesReps, setAllSalesReps] = useState<SalesRep[]>([]); // Track all sales reps

  useEffect(() => {
    fetchMonthlySalesBySalesRep()
      .then((data: SalesData[]) => {
        // Extract the sales rep information
        const salesReps = data.map((rep) => rep.sales_rep);
        setAllSalesReps(salesReps);

        // Format the data for the Nivo Line chart
        const formattedData = data.map((rep) => ({
          id: rep.sales_rep.full_name, // Sales rep's name as chart label
          repId: rep.sales_rep.id, // Sales rep's ID to match with visibility
          data: rep.sales.map((sale) => ({
            x: `${sale.year}-${String(sale.month).padStart(2, '0')}`, // Format date as "YYYY-MM"
            y: sale.total_sales, // Total sales for the month
          })),
        }));

        setMonthlySalesData(formattedData);

        // Initially make all sales reps visible
        const allRepIds = salesReps.map((rep) => rep.id);
        setVisibleReps(new Set(allRepIds));

        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch monthly sales by sales rep', error);
        setLoading(false);
      });
  }, []);

  const toggleRepVisibility = (repId: number) => {
    setVisibleReps((prevVisibleReps) => {
      const newVisibleReps = new Set(prevVisibleReps);
      if (newVisibleReps.has(repId)) {
        newVisibleReps.delete(repId); // Hide the sales rep line
      } else {
        newVisibleReps.add(repId); // Show the sales rep line
      }
      return newVisibleReps;
    });
  };

  if (loading) {
    return (
      <Container>
        <Loader size="xl" />
      </Container>
    );
  }

  // Filter the data to only include reps that are visible
  const filteredData = monthlySalesData.filter((repData) => visibleReps.has(repData.repId));

  return (
    <Grid.Col span={6}>
      {/* Sales Rep Avatars */}
      <Group position="apart" mb="lg" style={{ justifyContent: 'flex-end' }}>
        {allSalesReps.map((rep) => (
          <ActionIcon
            key={rep.id}
            onClick={() => toggleRepVisibility(rep.id)}
            style={{ filter: visibleReps.has(rep.id) ? 'none' : 'grayscale(100%)' }}
            size="xl"
            radius="xl"
            mr="xs"  // Margin-right to add spacing between avatars
          >
            <Avatar
              src={rep.profile_pic ? `http://localhost:8000${rep.profile_pic}` : undefined}
              alt={rep.full_name}
              size={60}
              radius="xl"
            />
          </ActionIcon>
        ))}
      </Group>

      {/* Line Chart */}
      <div style={{ height: 590, width: '100%' }}>
        <ResponsiveLine
          data={filteredData}
          margin={{ top: 50, right: 110, bottom: 50, left: 100 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Total Sales',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          enableSlices="x"
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
    </Grid.Col>
  );
};

export default DashboardRepMonthly;
