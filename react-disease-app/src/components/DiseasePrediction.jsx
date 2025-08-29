import React, { useState } from "react"; 
import "./DiseasePrediction.css";

const DiseasePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    // Mock API delay
    setTimeout(() => {
      setLoading(false);
      setResult({
        crop: "Tomato",
        disease: "Early Blight",
        description:
          "A common fungal disease causing brown spots on leaves. Can reduce yield significantly if untreated.",
        recommendation:
          "Use fungicide sprays, ensure proper crop rotation, and avoid overhead watering."
      });
    }, 2000);
  };

  return (
    <div className="predict-page">
      <div className="container">
        <h1 className="page-title">Crop Disease Predictor</h1>

        {/* Subtitle text and upload box side by side */}
        <div className="subtitle-upload">
          <p className="page-subtitle">
            Upload a clear image of your crop leaf to detect possible diseases.
          </p>

          <form className="upload-box" onSubmit={handleSubmit}>
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
                  <p>Click to upload or drag & drop</p>
                  <span className="hint">PNG, JPG up to 5MB</span>
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
            <button
              type="submit"
              className="predict-button"
              disabled={!selectedFile || loading}
            >
              {loading ? "Analyzing..." : "Predict Disease"}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-card">
            <h2 className="result-title">Prediction Result</h2>
            <p>
              <strong>Crop:</strong> {result.crop}
            </p>
            <p>
              <strong>Disease:</strong> {result.disease}
            </p>
            <p className="result-desc">{result.description}</p>
            <p className="result-recommend">
              <strong>Recommendation:</strong> {result.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePrediction;
