import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import AvatarImg from './Avatar';
import { MdLogout } from 'react-icons/md';
import { useToast } from '@chakra-ui/react';
import {
  Input,
  Stack,
  InputGroup,
  Box,
  Image,
  Button,
  FormLabel,
  FormControl,
  Spinner,
  ButtonGroup,
  InputLeftElement,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
} from '@chakra-ui/react';
import { useAccountStore } from '../store';
import { useDisclosure } from '@chakra-ui/react';

const Account = ({ session, isOpen, onClose, btnRef }) => {
  const {
    loading,
    username,
    website,
    avatarUrl,
    fullName,
    setLoading,
    setUsername,
    setWebsite,
    setAvatarUrl,
    setFullName,
  } = useAccountStore();

  const toast = useToast();

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
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      } catch (error) {
        console.warn(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [session]);

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const { user } = session;
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      toast({
        description: `Данные сохранены`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Настройки аккаунта</DrawerHeader>

          <DrawerBody>
            <form>
              <AvatarImg
                // url={avatar_url}
                url={avatarUrl}
                size={250}
                onUpload={(url) => {
                  setAvatarUrl(url);
                  updateProfile({ username, website, avatar_url: url });
                }}
              />
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder='Email'
                  id='email'
                  type='text'
                  value={session.user.email}
                  disabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>full_name</FormLabel>
                <Input
                  placeholder='full_name'
                  id='full_name'
                  type='text'
                  value={session.user.user_metadata.full_name}
                  disabled
                />
              </FormControl>

              <FormControl>
                <FormLabel>Имя</FormLabel>
                <Input
                  placeholder='First name'
                  id='username'
                  type='text'
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Stack marginY={1} direction={['column']} w='100%'>
              <Button
                colorScheme='green'
                // onClick={() => updateProfile({ username, website, avatar_url })}
                onClick={() => updateProfile({ username, website, avatarUrl })}
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Сохранить'}
              </Button>

              <Button
                // rightIcon={<MdLogout size={21} style={{ fill: 'black' }} />}
                rightIcon={<MdLogout size={21} />}
                colorScheme='red'
                mr={0}
                onClick={() => supabase.auth.signOut()}
              >
                Выход из аккаунта
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Account;
