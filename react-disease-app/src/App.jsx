import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DiseasePrediction from './components/DiseasePrediction';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToPredict = () => {
    setCurrentPage('predict');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'predict':
        return <DiseasePrediction />;
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
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App
