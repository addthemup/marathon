import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingOverlay, Text, Paper, Grid } from '@mantine/core';
import { fetchBranchAccountSalesInvoice } from '../Api/AccountPageApi';
import { BranchAccountCard } from './BranchAccountCard';
import { BranchAccountMap } from './BranchAccountMap';
import { BranchAccountHead } from './BranchAccountHead'; // Import BranchAccountHead
import BranchAccountInvoices from './BranchAccountInvoices'; // Import BranchAccountInvoices

// Define the structure for the fetched sales invoice data
interface SalesInvoice {
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
    gross_sales_by_year: {
        year: string;
        total_sales: number;
    }[];
    total_gross_sum: number;
    branch_invoices: number;
    accounts_details: {
        id: number;
        name: string;
        total_invoices: number;
        gross_sum: number;
        invoices: {
            id: number;
            invoice_sum: number;
            invoice_date: string;
            sale_date?: string; // sale_date is optional
            invoice_number: string;
            sales: {
                id: number;
                product: {
                    product_code: string;
                    product_description: string;
                    brand: string;
                    category: {
                        name: string;
                    };
                };
                quantity_sold: number;
                quantity_invoiced?: number;
                sell_price: string;
                line_price: number;
            }[];
        }[];
    }[];
}

export function BranchAccountPage() {
    const { branchAccountId } = useParams<{ branchAccountId: string }>();
    const [data, setData] = useState<SalesInvoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('branchAccount'); // Add currentView state

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchBranchAccountSalesInvoice(Number(branchAccountId));
                setData(result);
            } catch (error) {
                console.error('Error fetching sales invoice:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [branchAccountId]);

    // Show loading indicator while data is being fetched
    if (loading) {
        return <LoadingOverlay visible />;
    }

    // Handle case where no data is returned
    if (!data) {
        return <Text>No data available</Text>;
    }

    return (
        <div style={{ padding: '.25rem' }}>
            {/* Pass onViewChange to update the currentView when Home is selected */}
            <BranchAccountHead onViewChange={setCurrentView} />

            {/* Use a grid to place BranchAccountCard and BranchAccountMap side by side */}
            <Grid>
                <Grid.Col span={6}>
                    <BranchAccountCard
                        id={data.id}
                        name={data.name}
                        logo={data.logo}
                        address={data.address}
                        city={data.city}
                        state={data.state}
                        zip_code={data.zip_code}
                        person_of_contact={data.person_of_contact}
                        poc_phone_number={data.poc_phone_number}
                        poc_email={data.poc_email}
                        total_gross_sum={data.total_gross_sum}
                        gross_sales_by_year={data.gross_sales_by_year}
                        branch_invoices={data.branch_invoices}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <BranchAccountMap address={`${data.address}, ${data.city}, ${data.state} ${data.zip_code}`} />
                </Grid.Col>
            </Grid>

            {/* Branch Invoices Table */}
            <Paper shadow="xs" p="md" mt="lg">
                {data.accounts_details.map((account) => (
                    <div key={account.id} style={{ marginTop: '1rem' }}>
                        {/* Pass the invoices down to BranchAccountInvoices */}
                        <BranchAccountInvoices invoices={account.invoices} />
                    </div>
                ))}
            </Paper>
        </div>
    );
}
