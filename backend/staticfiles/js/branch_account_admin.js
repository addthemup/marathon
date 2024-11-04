document.addEventListener('DOMContentLoaded', function () {
    const accountsSelect = document.getElementById('id_accounts');
    const addressField = document.getElementById('id_address');
    const cityField = document.getElementById('id_city');
    const stateField = document.getElementById('id_state');
    const zipCodeField = document.getElementById('id_zip_code');
    const branchAccountNameField = document.getElementById('id_name');  // Branch account name field

    if (accountsSelect) {
        accountsSelect.addEventListener('change', function () {
            // Get selected accounts
            const selectedAccounts = Array.from(accountsSelect.selectedOptions).map(option => option.value);

            if (selectedAccounts.length > 0) {
                const accountId = selectedAccounts[0];  // Use the first selected account

                // Fetch the account details using Django's admin API
                fetch(`/api/accounts/${accountId}/`)
                    .then(response => response.json())
                    .then(data => {
                        // Populate the address fields if they exist in the account
                        if (data.address) {
                            addressField.value = data.address;
                        }
                        if (data.city) {
                            cityField.value = data.city;
                        }
                        if (data.state) {
                            stateField.value = data.state;
                        }
                        if (data.zip_code) {
                            zipCodeField.value = data.zip_code;
                        }
                        // Populate the branch account name with the account name
                        if (data.name && branchAccountNameField.value === '') {  // Only if branch account name is empty
                            branchAccountNameField.value = data.name;
                        }
                    })
                    .catch(error => console.error('Error fetching account data:', error));
            }
        });
    }
});
