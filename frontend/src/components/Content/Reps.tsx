import { useState, useEffect } from 'react';
import { Text, LoadingOverlay, Grid, Card } from '@mantine/core';
import RepsMap from './RepsMap';  // Import RepsMap to display the map
import RepsCheckbox from './RepsCheckbox';  // Import RepsCheckbox for selecting reps
import RepCard from './RepCard';  // Import the RepCard component
import RepMonthlySales from './RepMonthlySales';  // Import RepMonthlySales for monthly sales chart
import RepBranchAccounts from './RepBranchAccounts';  // Import RepBranchAccounts for branch accounts table
import RepItemsVolume from './RepItemsVolume';  // Import RepItemsVolume for items by volume
import RepItemsPrice from './RepItemsPrice';  // Import RepItemsPrice for items by price
import { showNotification } from '@mantine/notifications';

const Reps = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reps, setReps] = useState([]); // List of reps from localStorage
  const [selectedRep, setSelectedRep] = useState(null);  // The currently selected rep
  const [repDetails, setRepDetails] = useState(null);  // Store selected rep's details

  // Load reps from localStorage on component mount
  useEffect(() => {
    try {
      setLoading(true);
      const salesRepsData = JSON.parse(localStorage.getItem('salesReps')) || [];

      // Filter sales reps to only include those with non-null and non-empty branch_accounts
      const filteredReps = salesRepsData.filter(rep => rep.branch_accounts && rep.branch_accounts.length > 0);
      setReps(filteredReps);

      setLoading(false);
    } catch (err) {
      setError('Failed to load sales reps from localStorage.');
      setLoading(false);
    }
  }, []);

  // Handle sales rep selection from RepsCheckbox
  const handleRepSelection = (repId: number | null) => {
    if (repId === null) {
      // If repId is null, deselect the rep
      setSelectedRep(null);
      setRepDetails(null);
    } else {
      // Find the rep details in the loaded salesReps data
      const rep = reps.find((r) => r.id === repId);
      setSelectedRep(repId);
      setRepDetails(rep || null);
    }
  };

  // Handle errors and loading state
  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    showNotification({
      title: 'Error',
      message: error,
      color: 'red',
    });
    return <Text color="red">{error}</Text>;
  }

  return (
    <div style={{ marginTop: '-30px', height: '100%', width: '100%' }}>
      {/* RepsCheckbox to select reps */}
      <RepsCheckbox reps={reps} selectedRep={selectedRep} onRepSelection={handleRepSelection} />

      <Grid gutter="xs">
        {/* RepCard: Display rep details */}
        <Grid.Col span={2}>
          {repDetails ? (
            <RepCard repDetails={repDetails} />
          ) : (
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>

            </Card>
          )}
        </Grid.Col>

        {/* RepsMap should take 1/3 of the screen */}
        <Grid.Col span={4}>
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
            <RepsMap onRepSelection={handleRepSelection} selectedRep={selectedRep} />
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          {repDetails && repDetails.monthly_gross_sales ? (
            <RepMonthlySales monthlySales={repDetails.monthly_gross_sales} />
          ) : (
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>

            </Card>
          )}
        </Grid.Col>

        {/* Branch Accounts section */}
        <Grid.Col span={4}>
          {repDetails ? (
            <RepBranchAccounts branchAccounts={repDetails.branch_accounts} />
          ) : (
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>

            </Card>
          )}
        </Grid.Col>

        {/* Top 10 Items by Volume */}
        <Grid.Col span={4}>
          {repDetails ? (
            <RepItemsVolume items={repDetails.top_ten_items_by_volume} />
          ) : (
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>

            </Card>
          )}
        </Grid.Col>

        {/* Top 10 Items by Price */}
        <Grid.Col span={4}>
          {repDetails ? (
            <RepItemsPrice items={repDetails.top_ten_items_by_price} />
          ) : (
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>

            </Card>
          )}
        </Grid.Col>

        {/* Monthly Gross Sales section */}

      </Grid>
    </div>
  );
};

export default Reps;
