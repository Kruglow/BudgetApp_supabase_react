import React from 'react';
import { supabase } from '../supabaseClient';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  supabase.auth.onAuthStateChange(async (event) => {
    if (event !== 'SIGNED_OUT') {
      //main
      navigate('/main');
    } else {
      navigate('/');
    }
  });

  return (
    <>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme='dark'
        providers={['github']}
      />
    </>
  );
};

export default LoginPage;
