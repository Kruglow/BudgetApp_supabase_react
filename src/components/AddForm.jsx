import React, { useState, useEffect } from 'react';
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Button,
  Heading,
  Center,
  Select,
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { EditIcon, CalendarIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { useExpenses, useAccountStore, useSessionStore } from '../store';
import { useToast } from '@chakra-ui/react';
import AddCategory from './AddCategory';

const AddForm = () => {
  const { username, setLoading } = useAccountStore();
  const { session, setSession } = useSessionStore();
  const addForm = useExpenses((state) => state.addExpens);

  const categorySelect = useExpenses((state) => state.category);

  const [name, setName] = useState('');
  const [sum, setSum] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [urlImg, setUrlImg] = useState('');
  const [isActiveAddCategory, setIsActiveAddCategory] = useState(false);
  const toast = useToast();

  const onAddCategory = () => {
    setIsActiveAddCategory(!isActiveAddCategory);
  };

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { user } = session;
        let { data, error } = await supabase

          .from('profiles')
          .select(`username, website, avatar_url, full_name, testInfo`)
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }
        setUrlImg(data.avatar_url);
      } catch (error) {
        console.warn(error.message);
      } finally {
      }
    }

    getProfile();
  }, [session]);

  const onSubmit = (event) => {
    event.preventDefault();

    const expense = {
      id: uuidv4(),
      name: name,
      sum: sum,
      category: {
        category_name: category,
      },

      date: date,
      created_by: {
        avatar_url: urlImg,
        username: username,
      },
      created_by_id: session.user.id,
      category_id: category,
    };
    if (name.trim() === '') {
      toast({
        title: 'Введите название расхода',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    addForm(expense);
    toast({
      title: `Запись ${name} добавленна`,
      status: 'success',
      isClosable: true,
    });
    setName('');
    setDate('');
    setSum('');
    setCategory('');
    console.log(expense);
  };

  // console.log(categorySelect.id);
  return (
    <>
      <Center my={5}>
        <Heading>Добавить расход</Heading>
      </Center>

      <form onSubmit={onSubmit}>
        <Stack
          marginY={10}
          direction={['column', 'row']}
          spacing='24px'
          ml={5}
          mr={5}
        >
          <InputGroup w='100%'>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              fontSize='1.2em'
              children={<EditIcon />}
            />
            <Input
              placeholder='Название'
              value={name}
              onChange={(event) => setName(event.target.value)}
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
              type='number'
              value={sum}
              onChange={(event) => setSum(event.target.value)}
            />
          </InputGroup>

          <InputGroup w='100%'>
            <Input
              placeholder='Дата'
              size='md'
              type='date'
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              fontSize='1.2em'
              children={<CalendarIcon />}
            />
          </InputGroup>

          <InputGroup w='100%'>
            <Select
              placeholder='Категория'
              onChange={(event) => {
                const { value } = event.target;
                if (value === 'Добавить категорию') {
                  setIsActiveAddCategory(!isActiveAddCategory);
                } else {
                  setCategory(value);
                }
              }}
            >
              {categorySelect.map((category, index) => {
                return (
                  <option key={index} value={category.id}>
                    {category.category_name}
                  </option>
                );
              })}
              <option>Добавить категорию</option>
            </Select>
          </InputGroup>
          <Button colorScheme='blue' type='submit' w='100%'>
            Добавить
          </Button>
        </Stack>
      </form>
      <AddCategory
        setIsActiveAddCategory={setIsActiveAddCategory}
        isActiveAddCategory={isActiveAddCategory}
        onAddCategory={onAddCategory}
      />
    </>
  );
};

export default AddForm;
