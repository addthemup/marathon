import { Modal, TextInput, Button, Select } from '@mantine/core';

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
}) {
  const handleSubmit = () => {
    if (modalType === 'Category') {
      handleSubmitNewCategory(); // Call the correct handler
    } else if (modalType === 'Subcategory') {
      handleSubmitNewSubCategory(); // Call the correct handler
    } else if (modalType === 'Tag') {
      handleSubmitNewTag(); // Call the correct handler
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
