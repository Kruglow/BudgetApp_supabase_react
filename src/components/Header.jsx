import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { supabase } from '../supabaseClient';
import {
  useColorMode,
  Button,
  Grid,
  GridItem,
  Image,
  Stack,
  Avatar,
  Tooltip,
  Center,
} from '@chakra-ui/react';

import logo from '../img/qtum.svg';
import { useAccountStore } from '../store';

const Header = ({ btnRef, onOpen }) => {
  const {
    loading,
    username,
    website,
    avatarUrl,
    fullName,
    avatarImg,
    setLoading,
    setUsername,
    setWebsite,
    setAvatarUrl,
    setFullName,
    downloadAvatar,
  } = useAccountStore();

  useEffect(() => {
    if (avatarUrl) downloadAvatar(avatarUrl);
  }, [avatarUrl, downloadAvatar]);

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Grid templateColumns='repeat(5, 1fr)' gap={4} marginY={3} mr={2} ml={2}>
        <GridItem colSpan={2} h='10'>
          <Image
            marginY={-2}
            boxSize='50px'
            objectFit='cover'
            src={logo}
            alt='Dan Abramov'
          />
        </GridItem>

        <GridItem colStart={6} colEnd={6} h='10'>
          <Stack direction='row'>
            <Stack direction='column'>
              <Tooltip label={username} aria-label='A tooltip'>
                <Avatar mr={0} size='md' src={avatarImg} />
              </Tooltip>
            </Stack>

            <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
              аккаунт
            </Button>
            <Button size='sm' onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Header;
