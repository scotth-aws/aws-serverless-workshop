import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Admin from '../Admin';
import Subscription from '../Subscription';
import Logout from '../Logout';
import Home from '../Home';

const Routing = (
  <Router>
    <div>
      <Routes>
    
      <Route path="/" element={<Home />}></Route>
      <Route path="/Admin" element={<Admin />} />
      <Route path="/Subscription" element={<Subscription />} />
      <Route path="/Logout" element={<Logout />} />
      <Route path="/App" element={<App />} />
      </Routes>
    </div>
  </Router>
);

export default Routing;
