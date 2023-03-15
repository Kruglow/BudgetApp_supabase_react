import React from 'react';
import ReactDOM from 'react-dom/client';
import { ColorModeScript } from '@chakra-ui/react';
import theme from '../src/components/theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
);
