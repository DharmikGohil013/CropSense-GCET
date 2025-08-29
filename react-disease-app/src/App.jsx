import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DiseasePrediction from './components/DiseasePrediction';
import FertilizerPrediction from './components/FertilizerPrediction';
import About from './pages/About/About';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToPredict = () => {
    setCurrentPage('predict');
  };

  const navigateToFertilizer = () => {
    setCurrentPage('fertilizer');
  };
  
  const navigateToAbout = () => {
    setCurrentPage('about');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'predict':
        return <DiseasePrediction />;
      case 'fertilizer':
        return <FertilizerPrediction />;
      case 'about':
        return <About onNavigateToPredict={navigateToPredict} />;
      case 'home':
      default:
        return <Home onNavigateToPredict={navigateToPredict} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage}
        onNavigateToHome={navigateToHome}
        onNavigateToPredict={navigateToPredict}
        onNavigateToFertilizer={navigateToFertilizer}
        onNavigateToAbout={navigateToAbout}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App
