import { useState } from 'react';
import { Modal, Box, TextInput, Button, MultiSelect, FileInput, Select } from '@mantine/core';

export function RootAccountModal({ modalOpen, setModalOpen, branchAccounts = [], salesReps = [], handleCreateRootAccount }) {
  const [newRootAccountData, setNewRootAccountData] = useState({
    name: '',
    logo: null,
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: '',
    sales_rep: '',
    person_of_contact: '',
    poc_phone_number: '',
    poc_email: '',
    selectedBranchAccounts: [], // Array of selected branch account IDs
    root_category: '',
  });

  const handleModalInputChange = (field, value) => {
    setNewRootAccountData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileInputChange = (file) => {
    handleModalInputChange('logo', file);
  };

  const handleSubmit = () => {
    // Prepare payload with selected branch account IDs and other fields
    const rootAccountPayload = {
      ...newRootAccountData,
      branch_accounts: newRootAccountData.selectedBranchAccounts.map((branchId) => parseInt(branchId)), // Convert selected branch accounts to array of integers
    };

    handleCreateRootAccount(rootAccountPayload); // Send the payload to the parent handler
  };

  return (
    <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Create Root Account">
      <Box>
        <TextInput
          label="Root Account Name"
          placeholder="Enter name"
          value={newRootAccountData.name}
          onChange={(e) => handleModalInputChange('name', e.currentTarget.value)}
          required
        />

        <FileInput
          label="Logo"
          placeholder="Upload logo"
          value={newRootAccountData.logo}
          onChange={handleFileInputChange}
          accept="image/*"
        />

        <TextInput
          label="Address"
          placeholder="Enter address"
          value={newRootAccountData.address}
          onChange={(e) => handleModalInputChange('address', e.currentTarget.value)}
        />

        <TextInput
          label="City"
          placeholder="Enter city"
          value={newRootAccountData.city}
          onChange={(e) => handleModalInputChange('city', e.currentTarget.value)}
        />

        <TextInput
          label="State"
          placeholder="Enter state"
          value={newRootAccountData.state}
          onChange={(e) => handleModalInputChange('state', e.currentTarget.value)}
        />

        <TextInput
          label="Zip Code"
          placeholder="Enter zip code"
          value={newRootAccountData.zip_code}
          onChange={(e) => handleModalInputChange('zip_code', e.currentTarget.value)}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={newRootAccountData.phone_number}
          onChange={(e) => handleModalInputChange('phone_number', e.currentTarget.value)}
        />

        <TextInput
          label="Email"
          placeholder="Enter email"
          value={newRootAccountData.email}
          onChange={(e) => handleModalInputChange('email', e.currentTarget.value)}
        />

        <Select
          label="Sales Representative"
          placeholder="Select sales representative"
          data={salesReps.map((rep) => ({ value: rep.id.toString(), label: rep.full_name }))}
          value={newRootAccountData.sales_rep}
          onChange={(value) => handleModalInputChange('sales_rep', value)}
          searchable
        />

        <TextInput
          label="Person of Contact (POC)"
          placeholder="Enter POC name"
          value={newRootAccountData.person_of_contact}
          onChange={(e) => handleModalInputChange('person_of_contact', e.currentTarget.value)}
        />

        <TextInput
          label="POC Phone Number"
          placeholder="Enter POC phone number"
          value={newRootAccountData.poc_phone_number}
          onChange={(e) => handleModalInputChange('poc_phone_number', e.currentTarget.value)}
        />

        <TextInput
          label="POC Email"
          placeholder="Enter POC email"
          value={newRootAccountData.poc_email}
          onChange={(e) => handleModalInputChange('poc_email', e.currentTarget.value)}
        />

        <TextInput
          label="Root Category"
          placeholder="Enter root category"
          value={newRootAccountData.root_category}
          onChange={(e) => handleModalInputChange('root_category', e.currentTarget.value)}
        />

        {/* MultiSelect for Branch Accounts */}
        <MultiSelect
          label="Select Branch Accounts"
          data={branchAccounts?.length > 0 ? branchAccounts.map((branch) => ({ value: branch.id.toString(), label: branch.name })) : []}
          placeholder="Select branch accounts"
          value={newRootAccountData.selectedBranchAccounts}
          onChange={(value) => handleModalInputChange('selectedBranchAccounts', value)}
        />

        <Button onClick={handleSubmit} fullWidth mt="md">
          Create Root Account
        </Button>
      </Box>
    </Modal>
  );
}
