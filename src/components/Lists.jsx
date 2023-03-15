import React, { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Button,
  Grid,
  GridItem,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useExpenses } from '../store';

const Lists = ({
  name,
  date,
  cost,
  id,
  onEdit,
  onDelete,
  category,
  created_by,
  created_by_avatar,
  updatedBy,
  updatedByAvatar,
}) => {
  const editExpns = useExpenses((state) => state.editExpns);

  const [createdByAvatarUrl, setCreatedByAvatarUrl] = useState();
  const [updatedByAvatarUrl, setUpdatedByAvatarUrl] = useState();

  async function getPublicUrl(avatarName, setImageUrl) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .getPublicUrl(avatarName);

      if (error) {
      } else {
        const url = data.publicUrl;
        setImageUrl(url);
      }
    } catch (error) {}
  }
  useEffect(() => {
    getPublicUrl(created_by_avatar, setCreatedByAvatarUrl);
    getPublicUrl(updatedByAvatar, setUpdatedByAvatarUrl);
  }, [created_by_avatar, updatedByAvatar]);

  const heandleClickEdit = () => {
    editExpns(id);
    onEdit();
  };

  const heandleClickDel = () => {
    editExpns(id);
    onDelete();
  };
  return (
    <>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                {name}
              </Box>
              <Box as='span' flex='1' textAlign='left'>
                {cost} grn
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Grid
              templateColumns='repeat(1, 1fr)'
              gap={4}
              alignItems='center'
              mr={2}
              ml={2}
            >
              <GridItem>Дата: {date}</GridItem>
              <GridItem>Категория: {category}</GridItem>
              <GridItem>
                Добавил :
                <Avatar mr={2} ml={2} size='sm' src={createdByAvatarUrl} />
                {created_by}
              </GridItem>
              {updatedBy ? (
                <GridItem>
                  Изменил :
                  <Avatar mr={2} ml={2} size='sm' src={updatedByAvatarUrl} />
                  {updatedBy}
                </GridItem>
              ) : (
                ''
              )}

              <GridItem>
                <Stack direction='row' spacing={4}>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme='blue'
                    variant='outline'
                    onClick={heandleClickEdit}
                  >
                    Редактировать
                  </Button>
                  <Button
                    rightIcon={<DeleteIcon />}
                    colorScheme='red'
                    variant='solid'
                    onClick={heandleClickDel}
                  >
                    Удалить
                  </Button>
                </Stack>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Lists;
