# Disease Prediction React App

A modern React application for crop disease prediction using AI-powered image analysis. This app connects to a FastAPI backend that uses multiple ML models and Gemini AI for comprehensive disease analysis.

## Features

- **Image Upload**: Drag & drop or click to upload crop images
- **AI-Powered Analysis**: Uses ResNet9 and specialized rice disease models
- **Gemini Integration**: Generates detailed solutions and recommendations
- **Real-time Predictions**: Get instant disease identification
- **Comprehensive Results**: Includes crop type, disease name, description, and AI-generated solutions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Vite
- Modern CSS with responsive design
- Drag & drop file upload

### Backend  
- FastAPI
- PyTorch models
- Google Gemini AI
- PIL for image processing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip package manager

### 1. Install Frontend Dependencies

```bash
# Navigate to the project directory
cd react-disease-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React app will be available at `http://localhost:5173`

### 2. Install Backend Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# OR if you're using the main project environment
pip install fastapi uvicorn python-multipart pillow torch torchvision google-generativeai python-dotenv numpy
```

### 3. Setup Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the API Server

```bash
# Start the FastAPI server
python api_server.py
```

The API will be available at `http://localhost:8001`

### 5. Using the Application

1. Open the React app in your browser
2. Upload a clear image of a crop leaf
3. Click "Predict Disease" 
4. View the comprehensive results including:
   - Crop identification
   - Disease diagnosis  
   - Confidence score
   - Detailed description
   - AI-generated solutions
   - Prevention tips

## API Endpoints

### `POST /predict-disease`
- **Description**: Predict disease from uploaded image
- **Input**: Image file (PNG, JPG, JPEG)
- **Output**: JSON with crop, disease, description, solution, confidence, and severity

### `GET /health`
- **Description**: Health check endpoint
- **Output**: Server status and model loading status

## Model Information

The application uses multiple AI models:

1. **ResNet9**: General crop disease detection
2. **Rice Disease Model**: Specialized for rice crop analysis  
3. **Gemini AI**: Generates detailed solutions and recommendations

## File Structure

```
react-disease-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   │   └── DiseasePrediction/
│   │       ├── DiseasePrediction.jsx
│   │       └── DiseasePrediction.css
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── api_server.py       # FastAPI backend
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
└── README.md
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Ensure the FastAPI server is running on port 8001
2. **Model Loading Errors**: Check that model files exist in the correct paths
3. **Gemini API Errors**: Verify your API key is correctly set in the environment

### Development Mode

If the API is not available, the app will fall back to mock data for demonstration purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
