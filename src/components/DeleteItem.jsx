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
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useExpenses } from '../store';
const DeleteItem = ({ editable, isActiveDelete, onDelete }) => {
  const removeExpns = useExpenses((state) => state.removeExpens);

  const toast = useToast();

  const [name, setName] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    setName(editable.text);
    setId(editable.id);
  }, [editable]);

  const heandleDelete = () => {
    removeExpns(id);
    onDelete();
    toast({
      description: `${name} успешно удален`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Modal isOpen={isActiveDelete} onClose={onDelete} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Удаление</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Вы действительно хотите удалить
              <Text as='b'> {name}</Text>?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onDelete}>
              Отмена
            </Button>
            <Button
              rightIcon={<DeleteIcon />}
              colorScheme={'red'}
              mr={3}
              onClick={heandleDelete}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteItem;
