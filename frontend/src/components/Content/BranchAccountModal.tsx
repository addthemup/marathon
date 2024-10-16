import { useState } from 'react';
import { Modal, Box, TextInput, Button, MultiSelect, FileInput, Select } from '@mantine/core';

export function BranchAccountModal({ modalOpen, setModalOpen, accounts, salesReps, handleCreateBranchAccount }) {
  const [newBranchAccountData, setNewBranchAccountData] = useState({
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
    selectedAccounts: [], // Array of account IDs to be sent
  });

  const handleModalInputChange = (field, value) => {
    setNewBranchAccountData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileInputChange = (file) => {
    handleModalInputChange('logo', file);
  };

  const handleSubmit = () => {
    // Prepare payload with selected account IDs and other fields
    const branchAccountPayload = {
      ...newBranchAccountData,
      accounts: newBranchAccountData.selectedAccounts.map((accountId) => parseInt(accountId)), // Convert selectedAccounts to array of integers
    };

    handleCreateBranchAccount(branchAccountPayload); // Send the payload to the parent handler
  };

  return (
    <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Create Branch Account">
      <Box>
        <TextInput
          label="Branch Account Name"
          placeholder="Enter name"
          value={newBranchAccountData.name}
          onChange={(e) => handleModalInputChange('name', e.currentTarget.value)}
          required
        />

        <FileInput
          label="Logo"
          placeholder="Upload logo"
          value={newBranchAccountData.logo}
          onChange={handleFileInputChange}
          accept="image/*"
        />

        <TextInput
          label="Address"
          placeholder="Enter address"
          value={newBranchAccountData.address}
          onChange={(e) => handleModalInputChange('address', e.currentTarget.value)}
        />

        <TextInput
          label="City"
          placeholder="Enter city"
          value={newBranchAccountData.city}
          onChange={(e) => handleModalInputChange('city', e.currentTarget.value)}
        />

        <TextInput
          label="State"
          placeholder="Enter state"
          value={newBranchAccountData.state}
          onChange={(e) => handleModalInputChange('state', e.currentTarget.value)}
        />

        <TextInput
          label="Zip Code"
          placeholder="Enter zip code"
          value={newBranchAccountData.zip_code}
          onChange={(e) => handleModalInputChange('zip_code', e.currentTarget.value)}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={newBranchAccountData.phone_number}
          onChange={(e) => handleModalInputChange('phone_number', e.currentTarget.value)}
        />

        <TextInput
          label="Email"
          placeholder="Enter email"
          value={newBranchAccountData.email}
          onChange={(e) => handleModalInputChange('email', e.currentTarget.value)}
        />

        <Select
          label="Sales Representative"
          placeholder="Select sales representative"
          data={salesReps.map((rep) => ({ value: rep.id.toString(), label: rep.full_name }))}
          value={newBranchAccountData.sales_rep}
          onChange={(value) => handleModalInputChange('sales_rep', value)}
          searchable
        />

        <TextInput
          label="Person of Contact (POC)"
          placeholder="Enter POC name"
          value={newBranchAccountData.person_of_contact}
          onChange={(e) => handleModalInputChange('person_of_contact', e.currentTarget.value)}
        />

        <TextInput
          label="POC Phone Number"
          placeholder="Enter POC phone number"
          value={newBranchAccountData.poc_phone_number}
          onChange={(e) => handleModalInputChange('poc_phone_number', e.currentTarget.value)}
        />

        <TextInput
          label="POC Email"
          placeholder="Enter POC email"
          value={newBranchAccountData.poc_email}
          onChange={(e) => handleModalInputChange('poc_email', e.currentTarget.value)}
        />

        <MultiSelect
          label="Select Sub-Accounts"
          data={accounts.map((account) => ({ value: account.id.toString(), label: account.name }))}
          placeholder="Select sub-accounts"
          value={newBranchAccountData.selectedAccounts}
          onChange={(value) => handleModalInputChange('selectedAccounts', value)}
        />

        <Button onClick={handleSubmit} fullWidth mt="md">
          Create Branch Account
        </Button>
      </Box>
    </Modal>
  );
}
