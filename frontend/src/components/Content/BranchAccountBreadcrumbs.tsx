import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function BranchAccountBreadcrumbs({ accountName }) {
    const navigate = useNavigate();

    return (
        <Breadcrumbs>
            <Anchor onClick={() => navigate('/')}>Branch Accounts</Anchor>
            <Text>{accountName || 'Branch Account'}</Text>
        </Breadcrumbs>
    );
}

export default BranchAccountBreadcrumbs;
