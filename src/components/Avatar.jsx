import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAvatarImgStore } from '../store';
import { Box, Circle, Avatar, Center, Spinner } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import './style.css';

export default function AvatarImg({ url, size, onUpload }) {
  const { avatarUrl, setAvatarUrl, uploading, setUploading } =
    useAvatarImgStore();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Center>
        <Box marginY={5}>
          <label htmlFor='single'>
            <Avatar
              _hover={{ cursor: 'pointer' }}
              position='relative'
              size='2xl'
              name={avatarUrl ? 'Avatar' : 'No image'}
              src={
                avatarUrl
                  ? avatarUrl
                  : `https://ui-avatars.com/api/?name=Avatar`
              }
            >
              <Circle
                bg='blue.900'
                // w='100%'
                // h='10%'
                p={5}
                color='white'
                position='absolute'
                bottom='-20px'
              >
                {uploading ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <DownloadIcon boxSize={5} position='absolute' />
                )}
              </Circle>
            </Avatar>
          </label>
        </Box>
      </Center>

      {uploading ? (
        <div className='visually-hidden'>'...'</div>
      ) : (
        <>
          <div className='visually-hidden'>
            <input
              type='file'
              id='single'
              accept='image/*'
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </div>
        </>
      )}
    </>
  );
}
