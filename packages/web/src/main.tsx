import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BestiaryScreen } from './screens/bestiary/BestiaryScreen';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <BestiaryScreen />
  </StrictMode>,
);
