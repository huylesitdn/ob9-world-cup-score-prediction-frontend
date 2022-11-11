import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";

const routers = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: "Not Found",
  },
];

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          {routers.map((router, k) => (
            <Route {...router} key={k} />
          ))}
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
