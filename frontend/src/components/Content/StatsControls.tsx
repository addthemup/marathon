import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { UnstyledButton, Text, Paper, Group, rem } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { fetchMonthlySalesByBrand } from '../Api/BrandSalesApi'; // Import API call for brand sales
import classes from './StatsControls.module.css';

export function StatsControls() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const data = await fetchMonthlySalesByBrand();

        // Transform data into a usable format for the component
        const transformedData = transformDataForStats(data);
        setBrandData(transformedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load brand sales data');
        setLoading(false);
      }
    };

    loadSalesData();
  }, [currentDate]);

  // Transform the API data into a format that is usable for this component
  const transformDataForStats = (data: any) => {
    const formattedMonth = dayjs(currentDate).format('YYYY-MM'); // Format month as YYYY-MM
    const brandsForMonth = data[formattedMonth] || {}; // Get brand sales for the current month

    // Get all unique brand names from the data
    const allBrandNames = Object.keys(data).reduce((brands: string[], month) => {
      const monthBrands = Object.keys(data[month]);
      return Array.from(new Set([...brands, ...monthBrands])); // Collect unique brand names
    }, []);

    // Ensure every brand is included, even if it has no sales data for the current month
    return allBrandNames.map((brand) => ({
      brand,
      distance: brandsForMonth[brand] || 0, // Set sales to 0 if the brand has no data for the month
    }));
  };

  const handleMonthChange = (months: number) => {
    setCurrentDate((prevDate) => dayjs(prevDate).add(months, 'month').toDate());
  };

  const stats = brandData.map((stat) => (
    <Paper className={classes.stat} radius="md" shadow="md" h="300px" p="xs" key={stat.brand}>
      <div className={classes.icon} />
      <div>
        <Text className={classes.label}>{stat.brand}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{stat.distance}km</span> / 10km
        </Text>
      </div>
    </Paper>
  ));

  if (loading) {
    return <div>Loading brand sales data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <UnstyledButton
          className={classes.control}
          onClick={() => handleMonthChange(1)}  // Move forward one month
        >
          <IconChevronUp
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>

        <div className={classes.date}>
          <Text className={classes.day}>{dayjs(currentDate).format('MM')}</Text>
          <Text className={classes.month}>{dayjs(currentDate).format('YYYY')}</Text>
        </div>

        <UnstyledButton
          className={classes.control}
          onClick={() => handleMonthChange(-1)}  // Move backward one month
        >
          <IconChevronDown
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>
      </div>
      <Group style={{ flex: 1 }}>{stats}</Group>
    </div>
  );
}
