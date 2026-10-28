import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/domains.css';
import './styles/pages/methodology.css';
import './styles/pages/users.css';
import './styles/pages/explore-index.css';
import './styles/pages/about.css';
import './styles/pages/resources.css';
import './styles/pages/contribute.css';
import './styles/pages/shared.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
