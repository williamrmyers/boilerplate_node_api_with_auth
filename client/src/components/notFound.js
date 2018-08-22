import React from 'react';
import {NavLink} from 'react-router-dom';

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>404.</p>
    <NavLink to="/">Home</NavLink>
  </div>
);

export default NotFound;
