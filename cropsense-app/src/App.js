import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Results from './components/Results';
import ImageToDisease from './components/ImageToDisease';
import DiseaseInfoForm from './components/DiseaseInfoForm';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/image-to-disease" element={<ImageToDisease />} />
          <Route path="/disease-info" element={<DiseaseInfoForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
