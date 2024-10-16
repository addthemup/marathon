import { Modal, TextInput, Button, Select } from '@mantine/core';

// Define types for props
interface ProductModalProps {
  modalOpened: boolean;
  modalType: 'Category' | 'Subcategory' | 'Tag';
  newCategory: string;
  setNewCategory: (value: string) => void;
  newSubCategory: { category: string; subCategory: string };
  setNewSubCategory: (value: (prev: { category: string; subCategory: string }) => { category: string; subCategory: string }) => void;
  newTag: string;
  setNewTag: (value: string) => void;
  categories: string[];
  handleSubmitNewCategory: () => void;
  handleSubmitNewSubCategory: () => void;
  handleSubmitNewTag: () => void;
  onClose: () => void;
}

export function ProductModal({
  modalOpened,
  modalType,
  newCategory,
  setNewCategory,
  newSubCategory,
  setNewSubCategory,
  newTag,
  setNewTag,
  categories,
  handleSubmitNewCategory,
  handleSubmitNewSubCategory,
  handleSubmitNewTag,
  onClose,
}: ProductModalProps) {
  // Handle form submission based on modalType
  const handleSubmit = () => {
    if (modalType === 'Category') {
      handleSubmitNewCategory();
    } else if (modalType === 'Subcategory') {
      handleSubmitNewSubCategory();
    } else if (modalType === 'Tag') {
      handleSubmitNewTag();
    }
  };

  return (
    <Modal opened={modalOpened} onClose={onClose} title={`Create New ${modalType}`}>
      {modalType === 'Category' && (
        <TextInput
          label="New Category"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.currentTarget.value)}
        />
      )}

      {modalType === 'Subcategory' && (
        <>
          <Select
            data={categories.map((category) => ({
              value: category,
              label: category,
            }))}
            label="Select Category"
            value={newSubCategory.category}
            onChange={(value) =>
              setNewSubCategory((prev) => ({ ...prev, category: value }))
            }
          />
          <TextInput
            label="New Subcategory"
            placeholder="Enter new subcategory"
            value={newSubCategory.subCategory}
            onChange={(e) =>
              setNewSubCategory((prev) => ({
                ...prev,
                subCategory: e.currentTarget.value,
              }))
            }
          />
        </>
      )}

      {modalType === 'Tag' && (
        <TextInput
          label="New Tag"
          placeholder="Enter new tag"
          value={newTag}
          onChange={(e) => setNewTag(e.currentTarget.value)}
        />
      )}

      <Button fullWidth mt="md" onClick={handleSubmit}>
        Add {modalType}
      </Button>
    </Modal>
  );
}
