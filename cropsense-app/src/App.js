import './App.css';
import React, { Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ImageToDisease from './components/ImageToDisease';
import DiseaseInfoForm from './components/DiseaseInfoForm';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-to-disease" element={<ImageToDisease />} />
            <Route path="/info-to-disease" element={<DiseaseInfoForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
