import React, { useEffect, useState } from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import AddForm from './components/AddForm';
import ExpensesList from './components/ExpensesList';
import theme from './components/theme';
import Header from './components/Header';
import Account from './components/Accaunt';
import { useExpenses, useSessionStore } from './store';

import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useDisclosure } from '@chakra-ui/react';

function App() {
  const { session, setSession } = useSessionStore();
  const subscribeToExpenses = useExpenses((state) => state.subscribeToExpenses);
  const {
    data,
    fetchExpenses,

    fetchDataCategory,
    fetchDataCreatedBy,
    subscribeToCategory,
  } = useExpenses();

  console.log(data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchDataCategory();
    fetchDataCreatedBy();
    const unsubscribeFromCategory =
      subscribeToCategory && subscribeToCategory();
    const unsubscribeFromExpenses = subscribeToExpenses();
    return () => {
      unsubscribeFromCategory && unsubscribeFromCategory();
      unsubscribeFromExpenses();
    };
  }, [
    fetchExpenses,
    fetchDataCreatedBy,
    fetchDataCategory,
    subscribeToCategory,
    subscribeToExpenses,
  ]);

  return (
    <>
      {session ? (
        <>
          <Account
            key={session.user.id}
            session={session}
            isOpen={isOpen}
            onClose={onClose}
            btnRef={btnRef}
          />
          <Header btnRef={btnRef} onOpen={onOpen} />
          <AddForm session={session} />

          <ExpensesList data={data} />
        </>
      ) : (
        <Container>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme='dark'
            providers={['google', 'github']}
          />
        </Container>
      )}
    </>
  );
}

export default function WrappedApp() {
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
}
