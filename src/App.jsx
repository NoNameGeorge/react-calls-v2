import React from "react";
import { Route, Routes } from 'react-router-dom';

import Company from "./page/Company";
import Companies from "./page/Companies";

function App() {
  return (
    <div className="main-wrapper">
      <Routes>
        
        <Route path='/' exact element={<Companies />} />
        <Route path='/company/:id' exact element={<Company />} />

      </Routes>
    </div>
  );
}

export default App;
