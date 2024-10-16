import { Modal, TextInput, PasswordInput, Button, Text, Progress } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { loginUser } from '../Api/UsersApi'; // Import login API
import { fetchAnalysisData } from '../Api/AnalysisApi'; // Import Analysis API
import { fetchSalesReps, fetchBranchAccounts, fetchRootAccounts } from '../Api/AccountsApi'; // Import Accounts APIs
import { fetchInvoices } from '../Api/InvoicesApi'; // Import Invoices API
import axios from 'axios'; // Import axios for geocoding API
import classes from './LoginModal.module.css'; // Import styles

const GOOGLE_MAPS_API_KEY = 'AIzaSyBll4XqFE-lq4IqHMMrDua3CvA20x_NYeo'; // Google Maps API Key

interface LoginModalProps {
  setIsAuthenticated: (auth: boolean) => void;
  setUsername: (username: string | null) => void;
}

const LoginModal = ({ setIsAuthenticated, setUsername }: LoginModalProps) => {
  const [loginModalOpened, { open: openLoginModal, close: closeLoginModal }] = useDisclosure(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);  // State to manage loading
  const [progress, setProgress] = useState(0);    // State for progress bar

  // Helper function to store data in local storage
  const storeInLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Helper function for geocoding branch accounts
  const geocodeBranchAccounts = async (branchAccounts) => {
    const markers = [];

    for (const branch of branchAccounts) {
      const address = `${branch.address}, ${branch.city}, ${branch.state}, ${branch.zip_code}`;
      try {
        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (geocodeResponse.data.results.length > 0) {
          const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
          markers.push({ id: branch.id, name: branch.name, position: { lat, lng }, salesRep: branch.sales_rep });
        } else {
          console.log(`Failed to geocode address for branch account ${branch.name}`);
        }
      } catch (err) {
        console.error(`Error geocoding ${address}:`, err);
      }
    }
    return markers;
  };

  // Handle login and fetch all data with progress
  const handleLogin = async () => {
    setLoading(true);  // Start loading
    setError(null);    // Reset error state
    setProgress(10);   // Initial progress for starting the login process

    try {
      // 1. Login the user
      await loginUser(credentials.username, credentials.password);
      setProgress(25); // Increment progress after successful login

      // 2. Fetch and store analysis data
      const analysisData = await fetchAnalysisData();
      storeInLocalStorage('analytics', analysisData);
      setProgress(35); // Increment progress after fetching analysis data

      // 3. Fetch sales reps, branch accounts, root accounts, and invoices in parallel
      const [salesRepsData, branchAccountsData, rootAccountsData, invoicesData] = await Promise.all([
        fetchSalesReps(),
        fetchBranchAccounts(),   // Fetch branch accounts
        fetchRootAccounts(),
        fetchInvoices(), // Fetch invoices
      ]);

      setProgress(65); // Increment progress after fetching all the necessary data

      // 4. Geocode the branch accounts (only top-level branch details)
      const geocodedMarkers = await geocodeBranchAccounts(branchAccountsData);
      setProgress(85); // Increment progress after geocoding the branch accounts

      // 5. Store all data in local storage
      storeInLocalStorage('salesReps', salesRepsData);
      storeInLocalStorage('branchAccounts', branchAccountsData);
      storeInLocalStorage('rootAccounts', rootAccountsData);
      storeInLocalStorage('geocodedMarkers', geocodedMarkers);

      // 6. Set authentication state and close modal
      setIsAuthenticated(true);
      setUsername(credentials.username);
      setProgress(100);  // Set progress to 100% on completion
      closeLoginModal(); // Close modal after successful login
      window.location.reload(); // Reload page to reflect changes
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setProgress(0); // Reset progress on failure
    } finally {
      setLoading(false); // Stop loading after process
    }
  };

  return (
    <>
      <Button variant="default" onClick={openLoginModal}>Log in</Button>

      <Modal
        opened={loginModalOpened}
        onClose={closeLoginModal}
        title="Login"
        centered
      >
        <TextInput
          label="Username"
          placeholder="Your username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        {error && <Text color="red">{error}</Text>}

        {/* Button with progress */}
        <Button
          fullWidth
          mt="md"
          className={classes.button}
          onClick={handleLogin}
          disabled={loading} // Disable button while loading
        >
          <div className={classes.label}>Log in</div>
          {loading && (
            <Progress
              className={classes.progress}
              value={progress}
              color="blue"
              radius="sm"
            />
          )}
        </Button>
      </Modal>
    </>
  );
};

export default LoginModal;
