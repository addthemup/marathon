import { Card, Text, Group, Badge, Center, Button } from '@mantine/core';
import { IconBuildingSkyscraper, IconMapPin, IconAt, IconPhone } from '@tabler/icons-react';
import classes from './AccountCard.module.css';

interface BranchAccountCardProps {
  id: number;
  name: string;
  logo: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  person_of_contact: string | null;
  poc_phone_number: string | null;
  poc_email: string | null;
  total_gross_sum: number;
  gross_sales_by_year: {
    year: string;
    total_sales: number;
  }[];
  branch_invoices: number;
}

export const BranchAccountCard = ({ 
  name,
  logo,
  address,
  city,
  state,
  zip_code,
  person_of_contact,
  poc_phone_number,
  poc_email,
  total_gross_sum,
  branch_invoices
}: BranchAccountCardProps) => {
  const logoUrl = logo ? `http://localhost:8000${logo}` : 'https://via.placeholder.com/100';

  // Prepare features (with icons) to display contact and address information
  const features = [
    { label: `${address}, ${city}, ${state} ${zip_code}`, icon: IconMapPin },
    { label: poc_email || 'No email', icon: IconAt },
    { label: poc_phone_number || 'No phone', icon: IconPhone },
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
        <img src={logoUrl} alt={name} width={80} height={80} />
      </Card.Section>

      {/* Account Name and Badge (Invoices) */}
      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500} size="lg">{name}</Text>
          <Text fz="xs" c="dimmed">
            {city}, {state}
          </Text>
        </div>
        <Badge variant="outline">{branch_invoices} Invoices</Badge>
      </Group>

      {/* Account Basic Details */}
      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Contact Information
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
              ${total_gross_sum.toFixed(2)}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              Total Gross Sales
            </Text>
          </div>
        </Group>
      </Card.Section>


    </Card>
  );
};
