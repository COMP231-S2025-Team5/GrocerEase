import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import SearchPage from './pages/SearchPage';
import ItemPage from './pages/ItemPage';
import LoginPage from './pages/LoginPage';
import ItemList from './pages/ItemList';
import GroceryListOverview from './pages/GroceryListOverview';
import GroceryListPage from './pages/GroceryListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/itemlist" element={<ItemList />} />
          <Route path="/groceryListOverview" element={<GroceryListOverview />} />
          <Route path="/groceryListPage/:id" element={<GroceryListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
