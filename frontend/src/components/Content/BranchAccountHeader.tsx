import { TextInput, Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const BranchAccountHeader = ({ searchQuery, setSearchQuery, setModalOpen }) => {
    return (
        <Group position="right" mb="md">
            <TextInput
                placeholder="Search by Branch Account or Sub-Account"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <Button leftIcon={<IconPlus />} onClick={() => setModalOpen(true)}>
                Create Branch Account
            </Button>
        </Group>
    );
};

export default BranchAccountHeader;
