import React from 'react';
import { Card, Group, Avatar, Text, Stack } from '@mantine/core';
import { IconAt, IconPhoneCall, IconMapPin } from '@tabler/icons-react';

interface RepCardProps {
  repDetails: {
    full_name: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
    };
    code: string;
    region: string;
    hire_date: string;
    role: string;
    profile_pic: string;
  };
}

const RepCard = ({ repDetails }: RepCardProps) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
      <Group position="apart">
        <Group>
          <Avatar
            src={repDetails.profile_pic || 'default-placeholder.png'}
            size={80}
            radius="md"
            alt={repDetails.full_name}
          />
          <Stack spacing={0}>
            <Text size="lg" weight={500}>
              {repDetails.full_name}
            </Text>
            <Text size="sm" color="dimmed">
              {repDetails.role}
            </Text>
            <Text size="sm" color="dimmed">
              Region: {repDetails.region}
            </Text>
          </Stack>
        </Group>
      </Group>

      <Stack mt="md" spacing="xs">
        <Group spacing="xs">
          <IconAt size={16} stroke={1.5} />
          <Text size="sm">{repDetails.user.email || 'N/A'}</Text>
        </Group>

        <Group spacing="xs">
          <IconPhoneCall size={16} stroke={1.5} />
          <Text size="sm">{repDetails.user.phone || 'N/A'}</Text>
        </Group>

        <Group spacing="xs">
          <IconMapPin size={16} stroke={1.5} />
          <Text size="sm">
            {repDetails.user.city
              ? `${repDetails.user.city}, ${repDetails.user.state || ''}`
              : 'N/A'}
          </Text>
        </Group>

        <Text size="sm">
          <strong>Hire Date: </strong>
          {new Date(repDetails.hire_date).toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  );
};

export default RepCard;
