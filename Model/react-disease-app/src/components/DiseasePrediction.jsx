import React, { useState, useEffect } from "react"; 
import "./DiseasePrediction.css";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { getTranslatedDiseaseName, getTranslatedSeverity } from '../utils/translation';

const DiseasePrediction = () => {
  const { t, i18n } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState('');

  // Supported crops array
  const supportedCrops = [
    { key: 'apple', emoji: '🍎' },
    { key: 'blueberry', emoji: '🫐' },
    { key: 'cherry', emoji: '🍒' },
    { key: 'corn', emoji: '🌽' },
    { key: 'grape', emoji: '🍇' },
    { key: 'orange', emoji: '🍊' },
    { key: 'peach', emoji: '🍑' },
    { key: 'bellPepper', emoji: '🫑' },
    { key: 'potato', emoji: '🥔' },
    { key: 'raspberry', emoji: '🍇' },
    { key: 'soybean', emoji: '🌱' },
    { key: 'squash', emoji: '🎃' },
    { key: 'strawberry', emoji: '🍓' },
    { key: 'tomato', emoji: '🍅' }
  ];

  // Facts about plant diseases
  const plantFacts = [
    { key: 'fact1' },
    { key: 'fact2' },
    { key: 'fact3' },
    { key: 'fact4' },
    { key: 'fact5' },
    { key: 'fact6' }
  ];

  // Effect to handle loading progression
  useEffect(() => {
    if (loading) {
      setCurrentFact(0);
      
      let factIndex = 0;
      
      // Change fact every 2 seconds during loading
      const factInterval = setInterval(() => {
        factIndex = (factIndex + 1) % plantFacts.length;
        setCurrentFact(factIndex);
      }, 2000);
      
      return () => {
        clearInterval(factInterval);
      };
    }
  }, [loading, plantFacts.length]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setShowCamera(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('CAMERA_NOT_SUPPORTED');
      }

      // Check if we're on HTTPS (required for Chrome)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        throw new Error('HTTPS_REQUIRED');
      }

      // First check camera permissions
      let permissionStatus;
      try {
        permissionStatus = await navigator.permissions.query({ name: 'camera' });
      } catch {
        // Permissions API not supported, continue with getUserMedia
        console.log('Permissions API not supported, proceeding with getUserMedia');
      }

      // Handle permission denied case
      if (permissionStatus && permissionStatus.state === 'denied') {
        throw new Error('PERMISSION_DENIED');
      }

      // Show loading state while requesting camera access
      setShowCamera(true);
      const cameraContainer = document.getElementById('camera-container');
      if (cameraContainer) {
        cameraContainer.innerHTML = `
          <div class="camera-loading">
            <div class="camera-spinner"></div>
            <p>${t('diseasePrediction.requestingCamera')}</p>
          </div>
        `;
      }

      // Chrome-optimized camera constraints
      const constraints = {
        video: {
          facingMode: { 
            ideal: 'environment' // Prefer back camera on mobile
          },
          width: { 
            min: 320, 
            ideal: 1280, 
            max: 1920 
          },
          height: { 
            min: 240, 
            ideal: 720, 
            max: 1080 
          },
          aspectRatio: { ideal: 16/9 },
          frameRate: { ideal: 30, max: 60 },
          // Chrome-specific enhancements
          resizeMode: 'crop-and-scale',
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      };

      // Try with Chrome-specific fallback constraints
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintError) {
        console.warn('Primary constraints failed, trying fallback:', constraintError);
        // Fallback to basic constraints for Chrome compatibility
        const fallbackConstraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }
      
      // Create video element with Chrome-specific attributes
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true'); // Important for iOS and Chrome mobile
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true'); // Required for autoplay in Chrome
      video.setAttribute('controls', 'false');
      video.style.width = '100%';
      video.style.height = 'auto';
      video.style.maxHeight = '300px';
      video.style.objectFit = 'cover';
      video.style.borderRadius = '12px';
      video.style.backgroundColor = '#000';
      
      // Wait for video to load with timeout
      const videoLoadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('VIDEO_LOAD_TIMEOUT'));
        }, 10000); // 10 second timeout

        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };

        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('VIDEO_ERROR'));
        };
      });

      await videoLoadPromise;
      
      // Create canvas for capture
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Clear loading and show camera interface
      if (cameraContainer) {
        cameraContainer.innerHTML = '';
        cameraContainer.appendChild(video);
        
        // Create control buttons container
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'camera-controls';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.justifyContent = 'center';
        controlsDiv.style.marginTop = '15px';
        
        // Add capture button
        const captureBtn = document.createElement('button');
        captureBtn.textContent = t('diseasePrediction.capturePhoto');
        captureBtn.className = 'capture-btn';
        captureBtn.onclick = () => {
          // Draw video frame to canvas
          context.drawImage(video, 0, 0);
          
          // Convert to blob with high quality for Chrome
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              setSelectedFile(file);
              setPreview(URL.createObjectURL(file));
              
              // Stop camera and cleanup
              stream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
              });
              setShowCamera(false);
              cameraContainer.innerHTML = '';
            }
          }, 'image/jpeg', 0.9); // Higher quality for better analysis
        };
        
        // Add cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = t('diseasePrediction.cancel');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.onclick = () => {
          stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          setShowCamera(false);
          cameraContainer.innerHTML = '';
        };
        
        controlsDiv.appendChild(captureBtn);
        controlsDiv.appendChild(cancelBtn);
        cameraContainer.appendChild(controlsDiv);
      }

    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowCamera(false);
      
      // Clear camera container
      const cameraContainer = document.getElementById('camera-container');
      if (cameraContainer) {
        cameraContainer.innerHTML = '';
      }

      // Provide specific error messages based on error type
      let errorMessage = t('diseasePrediction.cameraErrorGeneric');
      let errorTitle = t('diseasePrediction.cameraError');
      
      if (error.name === 'NotAllowedError' || error.message === 'PERMISSION_DENIED') {
        errorMessage = t('diseasePrediction.cameraPermissionDenied');
        errorTitle = t('diseasePrediction.permissionRequired');
      } else if (error.name === 'NotFoundError') {
        errorMessage = t('diseasePrediction.cameraNotFound');
        errorTitle = t('diseasePrediction.cameraNotAvailable');
      } else if (error.name === 'NotSupportedError' || error.message === 'CAMERA_NOT_SUPPORTED') {
        errorMessage = t('diseasePrediction.cameraNotSupported');
        errorTitle = t('diseasePrediction.featureNotSupported');
      } else if (error.name === 'NotReadableError') {
        errorMessage = t('diseasePrediction.cameraInUse');
        errorTitle = t('diseasePrediction.cameraUnavailable');
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = t('diseasePrediction.cameraConstraintError');
        errorTitle = t('diseasePrediction.cameraConfiguration');
      } else if (error.message === 'HTTPS_REQUIRED') {
        errorMessage = t('diseasePrediction.httpsRequired');
        errorTitle = t('diseasePrediction.secureConnectionRequired');
      } else if (error.message === 'VIDEO_LOAD_TIMEOUT') {
        errorMessage = t('diseasePrediction.videoLoadTimeout');
        errorTitle = t('diseasePrediction.cameraLoadError');
      }

      // Show user-friendly error dialog with Chrome-specific instructions
      const chromeInstructions = navigator.userAgent.includes('Chrome') ? 
        `\n\n${t('diseasePrediction.chromeSpecificInstructions')}` : '';
      
      if (window.confirm(`${errorTitle}\n\n${errorMessage}${chromeInstructions}\n\n${t('diseasePrediction.cameraErrorSolution')}`)) {
        // User clicked OK, maybe show camera settings help
        if (error.name === 'NotAllowedError' || error.message === 'PERMISSION_DENIED') {
          // Provide instructions for enabling camera permissions
          alert(t('diseasePrediction.enableCameraInstructions'));
        } else if (error.message === 'HTTPS_REQUIRED') {
          // Provide HTTPS instructions
          alert(t('diseasePrediction.httpsInstructions'));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      // File validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        throw new Error('FILE_TOO_LARGE');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        throw new Error('INVALID_FILE_TYPE');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
<<<<<<< Updated upstream
      formData.append('language', i18n.language); // Pass the selected language
      if (selectedCrop) {
        formData.append('expected_crop', selectedCrop); // Pass the selected crop for better accuracy
      }
=======
      formData.append('language', i18n.language);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
>>>>>>> Stashed changes

      const response = await fetch('http://192.168.137.1:8001/predict-disease', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API_NOT_FOUND');
        } else if (response.status >= 500) {
          throw new Error('SERVER_ERROR');
        } else if (response.status === 403 || response.status === 401) {
          throw new Error('ACCESS_DENIED');
        } else {
          throw new Error(`HTTP_ERROR_${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setResult({
          crop: data.crop,
          disease: data.disease,
          confidence: data.confidence,
          description: data.description,
          solution: data.solution,
          severity: data.severity,
          recommendation: data.solution
        });
      } else {
        throw new Error(data.message || 'PREDICTION_FAILED');
      }
    } catch (err) {
      console.error('Error predicting disease:', err);

      let errorType = 'We are looking for this disease we will update soon';
      let errorInfo = {};

      // Categorize the error
      if (err.name === 'AbortError') {
        errorType = 'timeout';
      } else if (err.message === 'FILE_TOO_LARGE') {
        errorType = 'fileSize';
      } else if (err.message === 'INVALID_FILE_TYPE') {
        errorType = 'invalidFile';
      } else if (err.message === 'API_NOT_FOUND') {
        errorType = 'server';
      } else if (err.message === 'SERVER_ERROR') {
        errorType = 'server';
      } else if (err.message === 'ACCESS_DENIED') {
        errorType = 'cors';
      } else if (err.message.includes('Failed to fetch') || 
                 err.message.includes('NetworkError') ||
                 err.message.includes('ERR_NETWORK')) {
        errorType = 'network';
      } else if (err.message.includes('timeout') || 
                 err.message.includes('TIMEOUT')) {
        errorType = 'timeout';
      }

      // Get localized error information
      errorInfo = {
        title: t(`diseasePrediction.errorTypes.${errorType}.title`),
        description: t(`diseasePrediction.errorTypes.${errorType}.description`),
        suggestions: t(`diseasePrediction.errorTypes.${errorType}.suggestions`, { returnObjects: true }) || []
      };

      // Show enhanced error in result format
      setResult({
        crop: errorInfo.title,
        disease: t('diseasePrediction.errorConnection'),
        description: errorInfo.description,
        recommendation: errorInfo.suggestions.join('\n• '),
        solution: `${t('diseasePrediction.supportInfo.helpText')}\n\n${t('diseasePrediction.supportInfo.contactSupport')}`,
        confidence: 0,
        severity: "Error",
        isError: true,
        errorType: errorType,
        suggestions: errorInfo.suggestions
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    setShowCamera(false);
    setSelectedCrop('');
    
    // Clear camera container if it exists
    const cameraContainer = document.getElementById('camera-container');
    if (cameraContainer) {
      cameraContainer.innerHTML = '';
    }
  };

  // Function to parse and format the AI solution
  const formatSolution = (solutionText) => {
    try {
      // Try to parse as JSON first
      const solutionObj = JSON.parse(solutionText);
      return (
        <div className="formatted-solution">
          {Object.entries(solutionObj).map(([key, value], index) => (
            <div key={index} className="solution-category">
              <h5 className="category-title">{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
              <div className="category-content">
                {Array.isArray(value) ? (
                  <ul className="solution-list">
                    {value.map((item, idx) => (
                      <li key={idx} className="solution-item">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="solution-text-item">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } catch {
      // If it's not JSON, return as regular text
      return <p className="solution-text">{solutionText}</p>;
    }
  };

  return (
    <div className="predict-page">
      <div className="container">
        <div className="header-with-language">
          <h1 className="page-title">{t('diseasePrediction.title')}</h1>
          <LanguageSelector />
        </div>

        {/* Subtitle text and upload box side by side */}
        <div className="subtitle-upload">
          <p className="page-subtitle">
            {t('diseasePrediction.subtitle')}
          </p>

          <form className="upload-box" onSubmit={handleSubmit}>
            {!showCamera && (
              <>
                <label htmlFor="file-upload" className="upload-label">
                  {preview ? (
                    <img src={preview} alt="preview" className="preview-img" />
                  ) : (
                    <div className="placeholder">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="upload-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                        <rect x="3" y="16" width="18" height="4" rx="2" ry="2" />
                      </svg>
                      <p>{t('diseasePrediction.uploadPlaceholder')}</p>
                      <span className="hint">{t('diseasePrediction.uploadHint')}</span>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
                
                {/* Crop Selection Dropdown */}
                <div className="crop-selection">
                  <label htmlFor="crop-select" className="crop-label">
                    {t('diseasePrediction.selectCrop')} {t('diseasePrediction.optional')}
                  </label>
                  <select
                    id="crop-select"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="crop-dropdown"
                  >
                    <option value="">{t('diseasePrediction.allCrops')}</option>
                    {supportedCrops.map(crop => (
                      <option key={crop.key} value={crop.key}>
                        {crop.emoji} {t(`diseasePrediction.crops.${crop.key}`)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="upload-options">
                  <div className="option-divider">
                    <span>{t('diseasePrediction.or')}</span>
                  </div>
                  <button
                    type="button"
                    className="camera-btn"
                    onClick={handleCameraCapture}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="camera-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    {t('diseasePrediction.useCamera')}
                  </button>
                </div>
              </>
            )}
            
            {showCamera && (
              <div className="camera-section">
                <h4>{t('diseasePrediction.cameraCapture')}</h4>
                <div id="camera-container" className="camera-container"></div>
              </div>
            )}
            <button
              type="submit"
              className="predict-button"
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="button-spinner"></span>
                  {t('diseasePrediction.analyzingImage')}
                </span>
              ) : (
                t('diseasePrediction.predictDisease')
              )}
            </button>
            
            {selectedFile && (
              <button
                type="button"
                className="reset-button"
                onClick={resetForm}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="reset-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="1,4 1,10 7,10" />
                  <path d="M3.51,15a9,9,0,0,0,2.13,3.09,9,9,0,0,0,13.4,0A9,9,0,0,0,21.49,9" />
                  <polyline points="23,20 23,14 17,14" />
                  <path d="M20.49,9A9,9,0,0,0,18.36,5.91,9,9,0,0,0,4.96,5.91,9,9,0,0,0,2.51,15" />
                </svg>
                {t('diseasePrediction.reset')}
              </button>
            )}
          </form>
        </div>

        {/* Simplified Loading Overlay - Only Facts */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-container">
              {/* Facts Section Only */}
              <div className="facts-section">
                <div className="fact-content">
                  <h4 className="fact-title">{t('diseasePrediction.didYouKnow')}</h4>
                  <p className="fact-text">{t(`diseasePrediction.facts.${plantFacts[currentFact].key}`)}</p>
                </div>
              </div>

              {/* Simple Progress Bar */}
              <div className="main-progress">
                <div className="progress-bar-container">
                  <div className="progress-bar"></div>
                </div>
                <p className="progress-text">
                  {t('diseasePrediction.analyzingImage')}
                </p>
              </div>

              {/* Spinning Animation */}
              <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="result-card">
<<<<<<< Updated upstream
            {result.crop.toLowerCase() === 'invalid' || result.crop.toLowerCase().includes('invalid') || result.crop.toLowerCase() === 'unknown' || result.disease.toLowerCase().includes('unknown') ? (
              // Invalid/Unknown image result
=======
            {result.isError ? (
              // Error result with enhanced display
              <div className="error-result">
                <div className="error-header">
                  <div className="error-icon">
                    ⚠️
                  </div>
                  <h2 className="error-title">{result.crop}</h2>
                </div>
                
                <div className="error-content">
                  <p className="error-description">{result.description}</p>
                  
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="error-suggestions">
                      <h4>{t('diseasePrediction.whatCanYouDo')}</h4>
                      <ul className="suggestions-list">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="suggestion-item">
                            <span className="suggestion-icon">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="support-section">
                    <h4>{t('diseasePrediction.needHelp')}</h4>
                    <p className="support-text">{result.solution}</p>
                  </div>
                  
                  <div className="error-actions">
                    <button 
                      className="retry-btn primary"
                      onClick={resetForm}
                    >
                      {t('diseasePrediction.tryAgain')}
                    </button>
                  </div>
                </div>
              </div>
            ) : result.crop.toLowerCase() === 'invalid' || result.crop.toLowerCase().includes('invalid') ? (
              // Invalid image result
>>>>>>> Stashed changes
              <div className="invalid-result">
                <div className="invalid-header">
                  <h2 className="invalid-title">
                    {t('diseasePrediction.invalidImage')}
                  </h2>
                </div>
                
                <div className="invalid-content">
                  <div className="invalid-icon">
                    !
                  </div>
                  <h3 className="invalid-message">{t('diseasePrediction.invalidMessage')}</h3>
                  <p className="invalid-description">
                    {t('diseasePrediction.invalidDescription')}
                  </p>

                  {/* Supported Crops Section */}
                  <div className="supported-crops-section">
                    <h4 className="crops-title">{t('diseasePrediction.supportedCrops.title')}</h4>
                    <p className="crops-subtitle">{t('diseasePrediction.supportedCrops.subtitle')}</p>
                    
                    <div className="crops-grid">
                      <div className="crop-item">🍎 {t('diseasePrediction.crops.apple')}</div>
                      <div className="crop-item">🫐 {t('diseasePrediction.crops.blueberry')}</div>
                      <div className="crop-item">🍒 {t('diseasePrediction.crops.cherry')}</div>
                      <div className="crop-item">🌽 {t('diseasePrediction.crops.corn')}</div>
                      <div className="crop-item">🍇 {t('diseasePrediction.crops.grape')}</div>
                      <div className="crop-item">🍊 {t('diseasePrediction.crops.orange')}</div>
                      <div className="crop-item">🍑 {t('diseasePrediction.crops.peach')}</div>
                      <div className="crop-item">🫑 {t('diseasePrediction.crops.bellPepper')}</div>
                      <div className="crop-item">🥔 {t('diseasePrediction.crops.potato')}</div>
                      <div className="crop-item">🍇 {t('diseasePrediction.crops.raspberry')}</div>
                      <div className="crop-item">🌱 {t('diseasePrediction.crops.soybean')}</div>
                      <div className="crop-item">🎃 {t('diseasePrediction.crops.squash')}</div>
                      <div className="crop-item">🍓 {t('diseasePrediction.crops.strawberry')}</div>
                      <div className="crop-item">🍅 {t('diseasePrediction.crops.tomato')}</div>
                    </div>
                    
                    <p className="crops-note">{t('diseasePrediction.supportedCrops.note')}</p>
                  </div>

                  {/* How It Works Section */}
                  <div className="how-it-works-section">
                    <h4 className="how-title">{t('diseasePrediction.howItWorks.title')}</h4>
                    <div className="steps-container">
                      <div className="step-item">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h5>{t('diseasePrediction.howItWorks.step1.title')}</h5>
                          <p>{t('diseasePrediction.howItWorks.step1.description')}</p>
                        </div>
                      </div>
                      <div className="step-item">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h5>{t('diseasePrediction.howItWorks.step2.title')}</h5>
                          <p>{t('diseasePrediction.howItWorks.step2.description')}</p>
                        </div>
                      </div>
                      <div className="step-item">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h5>{t('diseasePrediction.howItWorks.step3.title')}</h5>
                          <p>{t('diseasePrediction.howItWorks.step3.description')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Collection Notice */}
                  <div className="data-notice">
                    <div className="notice-icon">📊</div>
                    <div className="notice-content">
                      <h5>{t('diseasePrediction.dataNotice.title')}</h5>
                      <p>{t('diseasePrediction.dataNotice.description')}</p>
                    </div>
                  </div>
                  
                  <div className="image-requirements">
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.clearView')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.goodLighting')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.sharpImage')}</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-icon">•</span>
                      <span>{t('diseasePrediction.requirements.focusPlant')}</span>
                    </div>
                  </div>
                  
                  <div className="invalid-actions">
                    <button 
                      className="retry-btn"
                      onClick={resetForm}
                    >
                      {t('diseasePrediction.reuploadImage')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Valid result
              <>
                <h2 className="result-title">
                  {t('diseasePrediction.predictionResult')}
                  {result.confidence && (
                    <span className="confidence-badge">{result.confidence}% {t('diseasePrediction.confidence')}</span>
                  )}
                </h2>
                
                <div className="result-info">
                  <div className="info-row">
                    <strong>{t('diseasePrediction.crop')}:</strong> <span className="crop-name">{result.crop}</span>
                  </div>
                  <div className="info-row">
                    <strong>{t('diseasePrediction.disease')}:</strong> 
                    <span className="disease-name">{getTranslatedDiseaseName(result.disease, i18n.language)}</span>
                  </div>
                  {result.severity && (
                    <div className="info-row">
                      <strong>{t('diseasePrediction.severity')}:</strong> 
                      <span className={`severity-badge severity-${result.severity.toLowerCase()}`}>
                        {getTranslatedSeverity(result.severity, i18n.language)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="result-description">
                  <h4>{t('diseasePrediction.description')}</h4>
                  <p className="result-desc">{result.description}</p>
                </div>

                {result.solution && (
                  <div className="solution-section">
                    <h4>{t('diseasePrediction.aiSolution')}</h4>
                    <div className="solution-content">
                      {formatSolution(result.solution)}
                    </div>
                  </div>
                )}

                <div className="recommendation-section">
                  <h4>{t('diseasePrediction.recommendations')}</h4>
                  <div className="recommendation-content">
                    {formatSolution(result.recommendation)}
                  </div>
                </div>

                <div className="result-actions">
                  <button 
                    className="new-prediction-btn"
                    onClick={resetForm}
                  >
                    {t('diseasePrediction.analyzeAnother')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePrediction;
