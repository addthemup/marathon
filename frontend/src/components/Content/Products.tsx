import { useState, useEffect } from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchSubCategories,
  fetchTags,
  createCategory,
  createSubCategory,
  createTag,
  updateProduct,
} from '../Api/ProductsApi';
import { ProductTableHeader } from './ProductTableHeader';
import { ProductTable } from './ProductTable';
import { ProductModal } from './ProductModal';
import { LoadingOverlay, Notification } from '@mantine/core';
import classes from './Products.module.css';

// Define the types for the data structures
interface Product {
  id: number;
  product_code: string;
  product_description: string;
  brand: string;
  category: number;
  sub_category?: number;
  tags: number[];
}

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

export function Products() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state management
  const [modalOpened, setModalOpened] = useState(false);
  const [modalType, setModalType] = useState<'Category' | 'Subcategory' | 'Tag' | ''>(''); // Tracks whether to show Category, Subcategory, or Tag form
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<{ category: number; subCategory: string }>({ category: 0, subCategory: '' });
  const [newTag, setNewTag] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(''); // To display success/error messages

  // Fetch products, categories, subcategories, and tags
  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, categoryData, subCategoryData, tagData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSubCategories(),
        fetchTags(),
      ]);

      setProducts(productData);
      setFilteredProducts(productData);

      const uniqueBrands = Array.from(new Set(productData.map((product) => product.brand)));
      setBrands(uniqueBrands);
      setCategories(categoryData);
      setSubCategories(subCategoryData);
      setTags(tagData);

      setLoading(false);
    } catch {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  // Fetch products, categories, subcategories, and tags on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Refresh the table view by reloading the data
  const handleRefresh = () => loadData();

  // Filter products based on selected filters and search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesBrand = !selectedBrands.length || selectedBrands.includes(product.brand);
      const matchesCategory = !selectedCategories.length || selectedCategories.includes(product.category);
      const matchesTags = !selectedTags.length || selectedTags.every((tag) => product.tags.includes(tag));
      const matchesSearch = product.product_code.toLowerCase().includes(lowerCaseQuery) || product.product_description.toLowerCase().includes(lowerCaseQuery);
      return matchesBrand && matchesCategory && matchesTags && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [selectedBrands, selectedCategories, selectedTags, searchQuery, products]);

  // Handle product updates (category, subcategory, or tags)
  const handleUpdateProduct = async (productId: number, updatedFields: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(productId, updatedFields);

      // Update product list with the updated product
      const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch {
      setError('Failed to update product');
    }
  };

  // Handle modal submission for each form
  const handleSubmitNewCategory = async () => {
    try {
      await createCategory({ name: newCategory });
      setNotificationMessage('Category successfully created!');
      setModalOpened(false);
      setNewCategory('');
      handleRefresh();
    } catch {
      setNotificationMessage('Error creating category.');
    }
  };

  const handleSubmitNewSubCategory = async () => {
    try {
      await createSubCategory({ category: newSubCategory.category, name: newSubCategory.subCategory });
      setNotificationMessage('Subcategory successfully created!');
      setModalOpened(false);
      setNewSubCategory({ category: 0, subCategory: '' });
      handleRefresh();
    } catch {
      setNotificationMessage('Error creating subcategory.');
    }
  };

  const handleSubmitNewTag = async () => {
    try {
      await createTag({ name: newTag });
      setNotificationMessage('Tag successfully created!');
      setModalOpened(false);
      setNewTag('');
      handleRefresh();
    } catch {
      setNotificationMessage('Error creating tag.');
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* Modal for creating new categories, subcategories, and tags */}
      <ProductModal
        modalOpened={modalOpened}
        modalType={modalType}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newSubCategory={newSubCategory}
        setNewSubCategory={setNewSubCategory}
        newTag={newTag}
        setNewTag={setNewTag}
        handleSubmitNewCategory={handleSubmitNewCategory}
        handleSubmitNewSubCategory={handleSubmitNewSubCategory}
        handleSubmitNewTag={handleSubmitNewTag}
        onClose={() => setModalOpened(false)}
      />

      {/* Display notification if there's a success or error message */}
      {notificationMessage && (
        <Notification className={classes.notification} onClose={() => setNotificationMessage('')}>
          {notificationMessage}
        </Notification>
      )}

      {/* Table Header with filters and creation buttons */}
      <ProductTableHeader
        brands={brands}
        categories={categories.map((category) => category.name)}
        tags={tags.map((tag) => tag.name)}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
        searchQuery={searchQuery}
        setSelectedBrands={setSelectedBrands}
        setSelectedCategories={setSelectedCategories}
        setSelectedTags={setSelectedTags}
        setSearchQuery={setSearchQuery}
        onNewCategoryClick={() => {
          setModalType('Category');
          setModalOpened(true);
        }}
        onNewSubCategoryClick={() => {
          setModalType('Subcategory');
          setModalOpened(true);
        }}
        onNewTagClick={() => {
          setModalType('Tag');
          setModalOpened(true);
        }}
        onRefresh={handleRefresh}
      />

      {/* Loading Overlay */}
      {loading && <LoadingOverlay visible={loading} />}

      {/* Product Table */}
      {!loading && !error && (
        <ProductTable
          products={filteredProducts}
          categories={categories}
          subCategories={subCategories}
          tags={tags}
          onUpdateProduct={handleUpdateProduct}
        />
      )}

      {/* Error Message */}
      {error && <div className={classes.error}>{error}</div>}
    </div>
  );
}
