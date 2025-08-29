# Disease Prediction React App

A modern React application for plant disease prediction using your existing Python machine learning models.

## Features

- Clean, modern UI for uploading plant leaf images
- Real-time disease prediction using your existing Python models
- Displays crop type, disease name, and detailed description
- Responsive design that works on all devices
- Integration with your existing Python API

## Setup Instructions

### 1. Start the Python API Server

First, make sure your Python environment is activated and all dependencies are installed:

```bash
cd "d:\Model"
.\env\Scripts\activate
python api_server.py
```

This will start the API server on `http://127.0.0.1:8000`

### 2. Start the React Development Server

In a new terminal, navigate to the React app directory:

```bash
cd "d:\Model\react-disease-app"
npm run dev
```

This will start the React development server on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Click "Choose Image" to upload a plant leaf image
3. Select an image file (JPG, PNG, etc.)
4. Click "Predict Disease" to analyze the image
5. View the results showing:
   - **Crop**: The type of crop detected
   - **Disease**: The disease identified (if any)
   - **Description**: Detailed information about prevention and treatment

## API Endpoints

The Python API server provides the following endpoint:

- `POST /predict` - Upload an image file for disease prediction
  - Input: Image file (multipart/form-data)
  - Output: JSON with crop, disease, and description

## Technologies Used

- **Frontend**: React + Vite
- **HTTP Client**: Axios
- **Backend**: FastAPI (Python)
- **Machine Learning**: Your existing PyTorch and scikit-learn models
- **AI Analysis**: Google Gemini API

## File Structure

```
react-disease-app/
├── src/
│   ├── components/
│   │   ├── DiseasePrediction.jsx    # Main component
│   │   └── DiseasePrediction.css    # Styling
│   ├── App.jsx                      # Root component
│   └── App.css                      # Global styles
├── public/                          # Static assets
├── package.json                     # Dependencies
└── vite.config.js                  # Vite configuration
```

## Troubleshooting

### API Connection Issues
- Make sure the Python API server is running on port 8000
- Check that CORS is properly configured
- Verify your Python environment has all required packages

### Image Upload Issues
- Ensure the image is in a supported format (JPG, PNG, GIF, etc.)
- Check that the image file size is reasonable
- Make sure the image contains plant/leaf content for best results

### Prediction Issues
- Verify all Python models are properly loaded
- Check that the Gemini API key is correctly configured
- Ensure the rice model functions are properly imported

## Notes

- This React app uses your existing Python models without any modifications
- The API server (`api_server.py`) acts as a bridge between React and your ML models
- All machine learning processing happens on the Python backend
- The React frontend only handles the user interface and image upload+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
