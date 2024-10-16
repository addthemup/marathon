import { Avatar, Text, Group, Box } from '@mantine/core';
import { IconPhoneCall, IconAt } from '@tabler/icons-react';
import classes from './AccountRep.module.css';

const BranchAccountRep = ({ repData }) => {
  if (!repData) {
    return <Text>No sales representative assigned</Text>;
  }

  return (
    <Box>
      <Group wrap="nowrap">
        <Avatar src={`http://localhost:8000${repData.profile_pic}`} size={94} radius="md" />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {repData.role || 'Branch Sales Representative'}
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {repData.full_name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {repData.user?.email || 'N/A'}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {repData.user?.phone || 'N/A'}
            </Text>
          </Group>
        </div>
      </Group>
    </Box>
  );
};

export default BranchAccountRep;
