import { Group, Text, Paper } from '@mantine/core';

interface StatsProps {
  stats: { title: string; value: string | number }[];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <Group grow>
      {stats.map((stat, index) => (
        <Paper key={index} shadow="xs" p="md" withBorder>
          <Text size="lg" weight={700}>
            {stat.value}
          </Text>
          <Text size="sm" color="dimmed">
            {stat.title}
          </Text>
        </Paper>
      ))}
    </Group>
  );
};

export default Stats;
