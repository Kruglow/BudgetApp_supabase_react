import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import AddForm from '../components/AddForm';
import ExpensesList from '../components/ExpensesList';
import { useExpenses } from '../store';
import theme from '../components/theme';
import Header from '../components/Header';
import LoginPage from '../pages/LoginPage';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDate() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user);
          setUser(value.data.user);
        }
      });
    }
    getUserDate();
  }, []);

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    navigate('/');
  }
  const data = useExpenses((state) => state.data);
  return (
    <>
      {Object.keys(user).length !== 0 ? (
        <>
          <button onClick={() => signOutUser()}>OUT</button>
          <Header />
          <AddForm />
          <ExpensesList data={data} />
        </>
      ) : (
        <>
          <h1>NOT is LoGIN</h1>
          <button
            onClick={() => {
              navigate('/');
            }}
          >
            LOGIN
          </button>
        </>
      )}
    </>
  );
};

export default Main;
