import React from 'react';
import { Table, Card, Title, Text } from '@mantine/core';

interface ItemPrice {
  product_code: string;
  product_description: string;
  total_sales: number;
}

interface RepItemsPriceProps {
  items: ItemPrice[];
}

const RepItemsPrice = ({ items }: RepItemsPriceProps) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
      <Title order={4}>Top 10 Items by Price</Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Description</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_code}</td>
                <td>{item.product_description}</td>
                <td>${item.total_sales ? item.total_sales.toFixed(2) : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <Text align="center">No items by price available.</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default RepItemsPrice;
