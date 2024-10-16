import { useState } from 'react';
import { Checkbox, MultiSelect, TextInput, Group, Button, Menu } from '@mantine/core';
import { IconChevronDown, IconRefresh } from '@tabler/icons-react'; // Import refresh icon
import classes from './ProductTableHeader.module.css';

interface ProductTableHeaderProps {
  brands: string[];  // List of all available brands
  categories: string[];  // List of all available categories
  tags: string[];  // List of all available tags
  selectedBrands: string[];  // List of selected brands for filtering
  selectedCategories: string[];  // List of selected categories for filtering
  selectedTags: string[];  // List of selected tags for filtering
  searchQuery: string;  // Search input value

  // Event handlers for filtering and searching
  setSelectedBrands: (brands: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  onNewCategoryClick: () => void;  // Open the modal to add a new category
  onNewSubCategoryClick: () => void;  // Open the modal to add a new subcategory
  onNewTagClick: () => void;  // Open the modal to add a new tag
  onRefresh: () => void; // Function to refresh the table
}

export const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
  brands,
  categories,
  tags,
  selectedBrands,
  selectedCategories,
  selectedTags,
  searchQuery,
  setSelectedBrands,
  setSelectedCategories,
  setSelectedTags,
  setSearchQuery,
  onNewCategoryClick,
  onNewSubCategoryClick,
  onNewTagClick,
  onRefresh, // Added refresh prop
}) => {
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  return (
    <div className={classes.headerContainer}>
      <Group position="apart" mb="md" className={classes.headerContent}>
        <Group position="left" spacing="xl" className={classes.filtersSection}>
          {/* Brand Checkboxes */}
          <div className={classes.filterSection}>
            <Button variant="outline" size="xs" onClick={() => setBrandsExpanded(!brandsExpanded)}>
              {brandsExpanded ? 'Hide Brands' : 'Show Brands'}
            </Button>
            {brandsExpanded && (
              <div className={classes.checkboxGroup}>
                {brands.map((brand) => (
                  <Checkbox
                    key={brand}
                    label={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      const newSelection = e.target.checked
                        ? [...selectedBrands, brand]
                        : selectedBrands.filter((b) => b !== brand);
                      setSelectedBrands(newSelection);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Categories Checkboxes */}
          <div className={classes.filterSection}>
            <Button variant="outline" size="xs" onClick={() => setCategoriesExpanded(!categoriesExpanded)}>
              {categoriesExpanded ? 'Hide Categories' : 'Show Categories'}
            </Button>
            {categoriesExpanded && (
              <div className={classes.checkboxGroup}>
                {categories.map((category) => (
                  <Checkbox
                    key={category}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      const newSelection = e.target.checked
                        ? [...selectedCategories, category]
                        : selectedCategories.filter((c) => c !== category);
                      setSelectedCategories(newSelection);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tags MultiSelect */}
          <MultiSelect
            className={classes.multiSelect}
            data={tags.map((tag) => ({ value: tag, label: tag }))}
            placeholder="Filter by tags"
            searchable
            value={selectedTags}
            onChange={setSelectedTags}
          />

          {/* Search Input */}
          <TextInput
            placeholder="Search by product code or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className={classes.searchInput}
          />
        </Group>

        {/* New Button and Refresh Icon */}
        <Group position="right">
          <Button variant="outline" onClick={onRefresh}>
            <IconRefresh size={16} />  {/* Refresh Icon */}
          </Button>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button rightIcon={<IconChevronDown />}>New</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={onNewCategoryClick}>New Category</Menu.Item>
              <Menu.Item onClick={onNewSubCategoryClick}>New Subcategory</Menu.Item>
              <Menu.Item onClick={onNewTagClick}>New Tag</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </div>
  );
};
