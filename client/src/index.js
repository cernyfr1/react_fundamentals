import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from "./routes/Home";
import IngredientList from "./routes/IngredientList";
import RecipeList from "./routes/RecipeList";
import {UserProvider} from "./UserProvider";
import Authenticate from "./bricks/Authenticate";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <UserProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/auth" element={<Authenticate />} />
                  <Route path="/" element={<App />}>
                      <Route path="home" element={<Home />} />
                      <Route path="recipeList" element={<RecipeList />} />
                      <Route path="IngredientList" element={<IngredientList />} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
