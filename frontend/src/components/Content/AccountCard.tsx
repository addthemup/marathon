import { Card, Image, Text, Group, Badge, Center, Button, Box } from '@mantine/core';
import { IconBuildingSkyscraper, IconMapPin, IconAt, IconPhone } from '@tabler/icons-react';
import classes from './AccountCard.module.css';

const AccountCard = ({ accountData }) => {
  const logoUrl = accountData.logo ? `http://localhost:8000${accountData.logo}` : 'https://via.placeholder.com/100';
  
  const features = [
    { label: `Customer # ${accountData.customer_number}`, icon: IconBuildingSkyscraper },
    { label: `${accountData.address}, ${accountData.city}, ${accountData.state} ${accountData.zip_code}`, icon: IconMapPin },
    { label: accountData.email || 'No email', icon: IconAt },
    { label: accountData.phone_number || 'No phone', icon: IconPhone },
  ].map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      {/* Account Logo */}
      <Card.Section className={classes.imageSection}>
        <Image src={logoUrl} alt={accountData.name} width={80} height={80} radius="md" />
      </Card.Section>

      {/* Account Name and Badges */}
      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500} size="lg">{accountData.name}</Text>
          <Text fz="xs" c="dimmed">
            {accountData.city}, {accountData.state}
          </Text>
        </div>
        <Badge variant="outline">{accountData.total_invoices} Invoices</Badge>
      </Group>

      {/* Account Basic Details */}
      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Account Information
        </Text>
        <Group gap={8} mb={-8}>
          {features}
        </Group>
      </Card.Section>

      {/* Financial Summary */}
      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              ${accountData.gross_sum ? accountData.gross_sum.toFixed(2) : 'N/A'}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              Gross Sum
            </Text>
          </div>
          <Box>
            <Text fz="sm" fw={500} style={{ lineHeight: 1 }}>
              Avg. Time Between Sales
            </Text>
            <Text fz="xs" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={2}>
              {accountData.average_time_between_sales !== null ? `${accountData.average_time_between_sales.toFixed(2)} days` : 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fz="sm" fw={500} style={{ lineHeight: 1 }}>
              Time Since Last Purchase
            </Text>
            <Text fz="xs" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={2}>
              {accountData.time_since_last_purchase !== null ? `${accountData.time_since_last_purchase} days` : 'N/A'}
            </Text>
          </Box>
        </Group>
      </Card.Section>

      {/* Action Button */}
      <Card.Section className={classes.section}>
        <Button radius="xl" fullWidth>
          View Details
        </Button>
      </Card.Section>
    </Card>
  );
};

export default AccountCard;
