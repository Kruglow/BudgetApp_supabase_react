import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Stack,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useExpenses } from '../store';

const AddCategory = ({ isActiveAddCategory, onAddCategory }) => {
  const { addCategory } = useExpenses();
  const [categoryName, setCategoryName] = useState('');
  const toast = useToast();
  const handleAddCategory = (event) => {
    event.preventDefault();
    if (categoryName.trim() === '') {
      toast({
        title: 'Введите название категории',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    addCategory(categoryName);
    onAddCategory();
    toast({
      title: `Категория ${categoryName} добавленна`,
      status: 'success',
      isClosable: true,
    });
    setCategoryName('');
  };
  return (
    <>
      <Modal isOpen={isActiveAddCategory} onClose={onAddCategory} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Добавление категории</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddCategory}>
              <Stack marginY={1} direction={['column']} spacing='24px'>
                <InputGroup w='100%'>
                  {/* <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children={<EditIcon />}
                  /> */}
                  <Input
                    placeholder='Название'
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    // onChange={(event) => setName(event.target.value)}
                    required
                  />
                </InputGroup>

                <Button
                  colorScheme='blue'
                  type='submit'
                  w='100%'
                  //   onClick={heandleClick}
                >
                  Добавить
                </Button>
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCategory;
