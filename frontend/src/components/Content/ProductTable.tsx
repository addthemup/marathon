import { useState, useEffect } from 'react';
import { Table, Checkbox, Select, MultiSelect, Pagination, ScrollArea } from '@mantine/core';
import classes from './ProductTable.module.css';
import { memo } from 'react'; // Memoize row component to optimize re-renders

// Memoized Row Component to avoid re-rendering of unaltered rows
const ProductRow = memo(({ 
  product, 
  categories, 
  subCategories, 
  tags, 
  handleRowSelection, 
  handleFieldChange, 
  handleSingleFieldChange, 
  selectedRows, 
  isSelected 
}) => {
  return (
    <Table.Tr key={product.id} className={isSelected ? classes.highlightedRow : ''}>
      {/* Checkbox for row selection */}
      <Table.Td>
        <Checkbox checked={isSelected} onChange={() => handleRowSelection(product.id)} />
      </Table.Td>

      {/* Product details */}
      <Table.Td>{product.product_code}</Table.Td>
      <Table.Td>{product.product_description}</Table.Td>

      {/* Brand is static */}
      <Table.Td>{product.brand || 'N/A'}</Table.Td>

      {/* Category Select */}
      <Table.Td>
        <Select
          data={categories.map((category) => ({
            value: category.id.toString(),
            label: category.name,
          }))}
          value={product.category ? product.category.id.toString() : ''}
          onChange={(value) => 
            selectedRows.includes(product.id)
              ? handleFieldChange('category_id', value) // Change all selected rows
              : handleSingleFieldChange(product.id, 'category_id', value) // Change only this row
          }
          placeholder="Select category"
          nothingFound="No categories"
        />
      </Table.Td>

      {/* Subcategory Select */}
      <Table.Td>
        <Select
          data={subCategories.map((subCategory) => ({
            value: subCategory.id.toString(),
            label: subCategory.name,
          }))}
          value={product.sub_category ? product.sub_category.id.toString() : ''}
          onChange={(value) => 
            selectedRows.includes(product.id)
              ? handleFieldChange('sub_category_id', value) // Change all selected rows
              : handleSingleFieldChange(product.id, 'sub_category_id', value) // Change only this row
          }
          placeholder="Select subcategory"
          nothingFound="No subcategories"
        />
      </Table.Td>

      {/* Tags Multi-Select */}
      <Table.Td>
        <MultiSelect
          data={tags.map((tag) => ({
            value: tag.id.toString(),
            label: tag.name,
          }))}
          value={product.tags.map((tag) => tag.id.toString())}
          onChange={(value) => 
            selectedRows.includes(product.id)
              ? handleFieldChange('tag_ids', value) // Change all selected rows
              : handleSingleFieldChange(product.id, 'tag_ids', value) // Change only this row
          }
          placeholder="Select tags"
          searchable
          nothingFound="No tags found"
        />
      </Table.Td>
    </Table.Tr>
  );
});

export function ProductTable({
  products = [],
  categories = [],
  subCategories = [],
  tags = [],
  onUpdateProduct, // Function to handle product updates
}) {
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows to display per page (adjusted dynamically)

  // Handle row selection (toggle row selection)
  const handleRowSelection = (productId) => {
    setSelectedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Deselect
        : [...prev, productId] // Select
    );
  };

  // Handle select all / deselect all rows
  const handleSelectAll = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]); // Deselect all if all rows are selected
    } else {
      const newSelectedRows = products.map((product) => product.id); // Select all rows across all pages
      setSelectedRows(newSelectedRows);
    }
  };

  // Handle field change for multiple selected rows
  const handleFieldChange = (field, value) => {
    const updatedField = field === 'tag_ids' ? field : `${field}`;
    selectedRows.forEach((productId) => {
      onUpdateProduct(productId, { [updatedField]: value });
    });
  };

  // Handle individual field change (for a single product)
  const handleSingleFieldChange = (productId, field, value) => {
    onUpdateProduct(productId, { [field]: value });
  };

  // Calculate the rows to be displayed for the current page
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = products.slice(startIdx, endIdx);

  // Dynamically calculate the rows per page based on screen size
  useEffect(() => {
    const updateRowsPerPage = () => {
      const tableHeight = window.innerHeight - 300; // Reserve space for header, footer, etc.
      const rowHeight = 50; // Adjust based on the average row height in pixels
      const rows = Math.floor(tableHeight / rowHeight);
      setRowsPerPage(rows > 0 ? rows : 10); // Minimum of 10 rows if screen is small
    };

    updateRowsPerPage();
    window.addEventListener('resize', updateRowsPerPage); // Recalculate on window resize

    return () => window.removeEventListener('resize', updateRowsPerPage);
  }, []);

  // Check if all rows across all pages are selected
  const allRowsSelected = selectedRows.length === products.length;

  return (
    <div className={classes.tableContainer}>
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {/* Select All / Deselect All checkbox in the header */}
              <Table.Th>
                <Checkbox
                  checked={allRowsSelected}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < products.length}
                  onChange={handleSelectAll}
                />
              </Table.Th>
              <Table.Th>Product Code</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Subcategory</Table.Th>
              <Table.Th>Tags</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentRows.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                categories={categories}
                subCategories={subCategories}
                tags={tags}
                handleRowSelection={handleRowSelection}
                handleFieldChange={handleFieldChange} // Pass for bulk update
                handleSingleFieldChange={handleSingleFieldChange} // Pass for single row update
                selectedRows={selectedRows}
                isSelected={selectedRows.includes(product.id)}
              />
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        onChange={setCurrentPage}
        total={Math.ceil(products.length / rowsPerPage)}
        className={classes.pagination}
      />
    </div>
  );
}
