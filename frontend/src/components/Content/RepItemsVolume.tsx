import React from 'react';
import { Table, Card, Title, Text } from '@mantine/core';

interface ItemVolume {
  product_code: string;
  product_description: string;
  total_quantity_sold: number;
}

interface RepItemsVolumeProps {
  items: ItemVolume[];
}

const RepItemsVolume = ({ items }: RepItemsVolumeProps) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
      <Title order={4}>Top 10 Items by Volume</Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Description</th>
            <th>Quantity Sold</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_code}</td>
                <td>{item.product_description}</td>
                <td>{item.total_quantity_sold}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <Text align="center">No items by volume available.</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default RepItemsVolume;
