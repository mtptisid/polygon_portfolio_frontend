import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectsViewPage from './pages/ProjectsViewPage';
import HomePage from './pages/HomePage'; 
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects-view" element={<ProjectsViewPage />} />
        <Route path="*" element={<div>Not Found</div>} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
