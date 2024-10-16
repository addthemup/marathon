import { useState, useEffect } from 'react';
import { RingProgress, Text, SimpleGrid, Paper, Center, Group, Avatar, rem, LoadingOverlay } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { fetchTopAccounts } from '../Api/TopProductsApi'; // Assuming fetchTopAccounts is defined in TopProductsApi.tsx

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function TopAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch top accounts on component mount
  useEffect(() => {
    const loadTopAccounts = async () => {
      try {
        setLoading(true);
        const data = await fetchTopAccounts();  // Fetch top accounts from API
        setAccounts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load top accounts');
        setLoading(false);
      }
    };

    loadTopAccounts();
  }, []);

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  const stats = accounts.map((account: any) => {
    const salesDifference = account.total_sales - account.previous_total_sales;
    const progress = (account.total_sales / account.previous_total_sales) * 100;
    const isUp = salesDifference >= 0;
    const Icon = isUp ? icons.up : icons.down;
    const color = isUp ? 'teal' : 'red';

    return (
      <Paper withBorder radius="md" p="s" key={account.customer__name}>
        <Group>
          {/* RingProgress with sales progress */}
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: progress, color }]}
            label={
              <Center>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </Center>
            }
          />

          {/* Customer details and sales data */}
          <div>
            <Group>
              <Avatar
                src={account.logo || undefined}  // Use the logo URL if it exists, or undefined to hide the Avatar
                alt={account.customer__name}
                radius="xs"
                size="xl"
                w="100px"
                h="50px"
              />
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {account.customer__name}
                </Text>
                <Text fw={700} size="xl">
                  ${account.total_sales.toFixed(2)}
                </Text>
                <Text size="sm" c="dimmed">
                  Sales Rep: {account.sales_rep || 'Unknown'}
                </Text>
              </div>
            </Group>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {stats}
    </SimpleGrid>
  );
}
