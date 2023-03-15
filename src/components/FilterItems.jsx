import React, { useState, useEffect } from 'react';
import { Button, Center, Heading, Wrap, WrapItem } from '@chakra-ui/react';
import { useExpenses } from '../store';

const FilterItems = ({ selectedCategory, onCategorySelect }) => {
  const { categoriesWithCount, getCategoriesWithCount } = useExpenses();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  useEffect(() => {
    const fetchData = async () => {
      await getCategoriesWithCount();
    };
    fetchData();
  }, [getCategoriesWithCount]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  const filteredCategories = categoriesWithCount.filter((cat) => cat.count > 0);

  return (
    <>
      <Center marginY={8}>
        <Heading>Фильтр</Heading>
      </Center>

      <Wrap mr={5} ml={5}>
        <WrapItem>
          <Button
            onClick={() => handleCategorySelect('all')}
            bg={activeCategory === 'all' ? 'blue.600' : ''}
            color={activeCategory === 'all' ? 'white' : ''}
          >
            All
          </Button>
        </WrapItem>

        {filteredCategories.map((cat, index) => {
          return (
            <WrapItem key={index}>
              <Button
                onClick={() => handleCategorySelect(cat.category_name)}
                value={cat.category_name}
                bg={activeCategory === cat.category_name ? 'blue.500' : ''}
                color={activeCategory === cat.category_name ? 'white' : ''}
              >
                {cat.category_name} {cat.count}
              </Button>
            </WrapItem>
          );
        })}
      </Wrap>
    </>
  );
};

export default FilterItems;
