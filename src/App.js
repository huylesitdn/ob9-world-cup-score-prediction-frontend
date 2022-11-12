import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';
import './App.css';
import routers from './routers';

const Header = React.lazy(() => import('components/layouts/Header'));
const Footer = React.lazy(() => import('components/layouts/Footer'));


const App = () => {
  return (
    <React.Suspense falling={<div>Loading...</div>}>
      <Header />
      <div className="main">
        <BrowserRouter>
          <Routes>
            {routers.map((router, k) => (
              <Route {...router} key={k} />
            ))}
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </React.Suspense>
  );
}

export default App;
