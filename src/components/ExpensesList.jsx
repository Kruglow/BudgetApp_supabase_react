import React, { useState, useEffect } from 'react';
import { Badge, Container, Center, Heading } from '@chakra-ui/react';
import EditPopup from './EditPopup';
import DeleteItem from './DeleteItem';
import Lists from './Lists';
import FilterItems from './FilterItems';
import { useExpenses } from '../store';

const ExpensesList = () => {
  const items = useExpenses((state) => state.data);
  const categories = useExpenses((state) => state.category);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCategories = categories.filter((category) =>
    items.some(
      (item) =>
        item.category === category.category_name &&
        (selectedCategory === 'all' ||
          item.category.category_name === selectedCategory)
    )
  );

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter(
          (item) => item.category.category_name === selectedCategory
        );

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const totalCat = filteredItems.reduce((total, item) => {
    return (total += item.summ);
  }, 0);

  const edit = useExpenses((state) => state.edit);
  const [isActiveEdit, setIsActiveEdit] = useState(false);
  const [isActiveDelete, setIsActiveDelete] = useState(false);

  const onEdit = () => {
    setIsActiveEdit(!isActiveEdit);
  };
  const onDelete = () => {
    setIsActiveDelete(!isActiveDelete);
  };

  return (
    <>
      <FilterItems
        categories={filteredCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      <Center marginY={8}>
        <Heading>Расходы</Heading>
      </Center>

      <Container maxW='5xl'>
        {filteredItems.map((data, index) => {
          return (
            <Lists
              index={index}
              key={data.id}
              id={data.id}
              name={data.text}
              cost={data.summ}
              date={data.created_at}
              created_by={data.created_by.username}
              created_by_avatar={data.created_by.avatar_url}
              updatedBy={
                data.edited_by && data.edited_by.username
                  ? data.edited_by.username
                  : ''
              }
              updatedByAvatar={
                data.edited_by && data.edited_by.avatar_url
                  ? data.edited_by.avatar_url
                  : ''
              }
              category={data.category.category_name}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </Container>

      <EditPopup editable={edit} isActiveEdit={isActiveEdit} onEdit={onEdit} />

      <DeleteItem
        editable={edit}
        isActiveDelete={isActiveDelete}
        onDelete={onDelete}
      />

      <Container maxW='5xl'>
        <h3>
          Total
          <Badge colorScheme='purple' color='black'>
            {totalCat}
          </Badge>
        </h3>
      </Container>
    </>
  );
};

export default ExpensesList;
