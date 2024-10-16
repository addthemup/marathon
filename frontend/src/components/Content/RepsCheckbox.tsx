import { UnstyledButton, Group, Avatar, Text, SimpleGrid, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import styles from './RepsCheckbox.module.css';

interface RepsCheckboxProps {
  reps: Array<any>; // Array of sales reps
  selectedRep: number | null; // The currently selected sales rep ID
  onRepSelection: (repId: number | null) => void; // Callback for when a rep is selected
}

const RepsCheckbox = ({ reps, selectedRep, onRepSelection }: RepsCheckboxProps) => {
  // Handle rep selection
  const handleRepSelection = (repId: number) => {
    if (selectedRep === repId) {
      onRepSelection(null); // Deselect if already selected
    } else {
      onRepSelection(repId); // Select new rep
    }
  };

  return (
    <SimpleGrid cols={6} spacing="0px"> 
      {reps.map((rep) => (
        <UnstyledButton
          key={rep.id}
          onClick={() => handleRepSelection(rep.id)}
          className={selectedRep === rep.id ? styles.highlightedRow : styles.user}
        >
          <Group>
            <Avatar
              src={rep.profile_pic || 'default-placeholder.png'}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {rep.full_name}
              </Text>

              <Text c="dimmed" size="xs">
                {rep.user.email || 'N/A'}
              </Text>
            </div>

            <IconChevronRight style={{ width: rem(10), height: rem(10) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
};

export default RepsCheckbox;
