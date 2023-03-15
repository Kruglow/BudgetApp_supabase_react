import React, { useEffect, useState } from 'react';
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Button,
  Modal,
  Select,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { EditIcon, CalendarIcon } from '@chakra-ui/icons';
import { useExpenses, useSessionStore } from '../store';
const EditPopup = ({ editable, isActiveEdit, onEdit }) => {
  const toast = useToast();

  const { session } = useSessionStore();
  const updateExpenseList = useExpenses((state) => state.updateExpenseList);
  const categorySelect = useExpenses((state) => state.category);
  const [values, setValues] = useState({
    expense_name: '',
    price: '',
    // categoryId: '',
    createdBy: '',
    updatedBy: '',
    created_at: '',
  });

  useEffect(() => {
    setValues({
      expense_name: editable.text || '',
      price: editable.summ || '',
      // categoryId: editable.category || '',
      createdBy: editable.created_by || '',
      updatedBy: editable.edited_by || '',
      created_at: editable.created_at || '',
    });
  }, [editable, session]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const editExpens = async (event) => {
    event.preventDefault();
    await updateExpenseList(editable.id, {
      text: values.expense_name,
      summ: values.price,
      category: values.categoryId,
      created_by: editable.created_by.id,
      edited_by: session.user.id,
      created_at: values.created_at,
    });

    onEdit();
    toast({
      description: `${values.expense_name} успешно изменен`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <>
      <Modal isOpen={isActiveEdit} onClose={onEdit} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактирование</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={editExpens}>
              <Stack marginY={1} direction={['column']} spacing='24px'>
                <InputGroup w='100%'>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children={<EditIcon />}
                  />
                  <Input
                    placeholder='Название'
                    name='expense_name'
                    value={values.expense_name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                <InputGroup w='100%'>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children='$'
                  />
                  <Input
                    placeholder='Сумма'
                    name='price'
                    value={values.price}
                    onChange={handleChange}
                  />
                </InputGroup>

                <InputGroup w='100%'>
                  <Select
                    name='categoryId'
                    // placeholder={values.categoryId.category_name}
                    placeholder='Выбирете категорию'
                    onChange={handleChange}
                    required
                  >
                    {categorySelect.map((category, index) => {
                      return (
                        <option key={index} value={category.id}>
                          {category.category_name}
                        </option>
                      );
                    })}
                    {/* <option>Добавить категорию</option> */}
                  </Select>
                </InputGroup>

                <InputGroup w='100%'>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children={<CalendarIcon />}
                  />
                  <Input
                    placeholder='Сумма'
                    name='created_at'
                    type='date'
                    value={values.created_at}
                    onChange={handleChange}
                  />
                </InputGroup>

                <Button
                  colorScheme='blue'
                  type='submit'
                  w='100%'
                  onClick={editExpens}
                >
                  Изменить
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPopup;
