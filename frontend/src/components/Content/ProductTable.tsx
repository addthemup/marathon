import { useState, useEffect } from 'react';
import { Table, Checkbox, Select, MultiSelect, Pagination, ScrollArea } from '@mantine/core';
import classes from './ProductTable.module.css';
import { memo } from 'react';

// Define types for the product, categories, subCategories, and tags
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Product {
  id: number;
  product_code: string;
  product_description: string;
  brand: string;
  category?: Category;
  sub_category?: SubCategory;
  tags: Tag[];
}

// Define types for the ProductRow props
interface ProductRowProps {
  product: Product;
  categories: Category[];
  subCategories: SubCategory[];
  tags: Tag[];
  handleRowSelection: (productId: number) => void;
  handleFieldChange: (field: string, value: string | string[]) => void;
  handleSingleFieldChange: (productId: number, field: string, value: string | string[]) => void;
  selectedRows: number[];
  isSelected: boolean;
}

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
  isSelected,
}: ProductRowProps) => {
  return (
    <Table.Tr key={product.id} className={isSelected ? classes.highlightedRow : ''}>
      <Table.Td>
        <Checkbox checked={isSelected} onChange={() => handleRowSelection(product.id)} />
      </Table.Td>
      <Table.Td>{product.product_code}</Table.Td>
      <Table.Td>{product.product_description}</Table.Td>
      <Table.Td>{product.brand || 'N/A'}</Table.Td>

      <Table.Td>
        <Select
          data={categories.map((category) => ({
            value: category.id.toString(),
            label: category.name,
          }))}
          value={product.category ? product.category.id.toString() : ''}
          onChange={(value) =>
            selectedRows.includes(product.id)
              ? handleFieldChange('category_id', value!)
              : handleSingleFieldChange(product.id, 'category_id', value!)
          }
          placeholder="Select category"
          nothingFound="No categories"
        />
      </Table.Td>

      <Table.Td>
        <Select
          data={subCategories.map((subCategory) => ({
            value: subCategory.id.toString(),
            label: subCategory.name,
          }))}
          value={product.sub_category ? product.sub_category.id.toString() : ''}
          onChange={(value) =>
            selectedRows.includes(product.id)
              ? handleFieldChange('sub_category_id', value!)
              : handleSingleFieldChange(product.id, 'sub_category_id', value!)
          }
          placeholder="Select subcategory"
          nothingFound="No subcategories"
        />
      </Table.Td>

      <Table.Td>
        <MultiSelect
          data={tags.map((tag) => ({
            value: tag.id.toString(),
            label: tag.name,
          }))}
          value={product.tags.map((tag) => tag.id.toString())}
          onChange={(value) =>
            selectedRows.includes(product.id)
              ? handleFieldChange('tag_ids', value)
              : handleSingleFieldChange(product.id, 'tag_ids', value)
          }
          placeholder="Select tags"
          searchable
          nothingFound="No tags found"
        />
      </Table.Td>
    </Table.Tr>
  );
});

// Define types for the ProductTable props
interface ProductTableProps {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  tags: Tag[];
  onUpdateProduct: (productId: number, updatedData: Record<string, string | string[]>) => void;
}

export function ProductTable({
  products = [],
  categories = [],
  subCategories = [],
  tags = [],
  onUpdateProduct,
}: ProductTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRowSelection = (productId: number) => {
    setSelectedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]);
    } else {
      const newSelectedRows = products.map((product) => product.id);
      setSelectedRows(newSelectedRows);
    }
  };

  const handleFieldChange = (field: string, value: string | string[]) => {
    selectedRows.forEach((productId) => {
      onUpdateProduct(productId, { [field]: value });
    });
  };

  const handleSingleFieldChange = (productId: number, field: string, value: string | string[]) => {
    onUpdateProduct(productId, { [field]: value });
  };

  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = products.slice(startIdx, endIdx);

  useEffect(() => {
    const updateRowsPerPage = () => {
      const tableHeight = window.innerHeight - 300;
      const rowHeight = 50;
      const rows = Math.floor(tableHeight / rowHeight);
      setRowsPerPage(rows > 0 ? rows : 10);
    };

    updateRowsPerPage();
    window.addEventListener('resize', updateRowsPerPage);

    return () => window.removeEventListener('resize', updateRowsPerPage);
  }, []);

  const allRowsSelected = selectedRows.length === products.length;

  return (
    <div className={classes.tableContainer}>
      <ScrollArea>
        <Table>
          <Table.Thead>
            <Table.Tr>
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
                handleFieldChange={handleFieldChange}
                handleSingleFieldChange={handleSingleFieldChange}
                selectedRows={selectedRows}
                isSelected={selectedRows.includes(product.id)}
              />
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Pagination
        page={currentPage}
        onChange={setCurrentPage}
        total={Math.ceil(products.length / rowsPerPage)}
        className={classes.pagination}
      />
    </div>
  );
}
