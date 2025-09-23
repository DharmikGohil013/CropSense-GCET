# Repository Guidelines

## Project Structure & Module Organization
The root FastAPI/Gradio service lives in `app.py` with supporting pickled artifacts in `models/` and shared helpers under `utils/`. Static assets served by the API are in `static/` and HTML templates in `templates/`. `api_server.py` exposes a lighter-weight API surface for integrations. The `react-disease-app/` folder contains the Vite React dashboard (`src/`, `public/`, `eslint.config.js`), while `rice-disease-detection/` holds the training workflow (`src/api`, `src/models`, `src/routes`, and `tests/`). Leave the checked-in `env/` virtual environment untouched and prefer creating a fresh one locally.

## Build, Test, and Development Commands
- `python -m pip install -r requirements.txt` — sync Python dependencies for the FastAPI service.
- `python app.py` — launch the combined Gradio/FastAPI server on `http://127.0.0.1:7862`.
- `uvicorn api_server:app --reload --port 8000` — start the REST-focused API if you do not need the Gradio UI.
- `cd react-disease-app && npm install` then `npm run dev` — boot the React UI with hot reload.
- `cd react-disease-app && npm run lint` — lint front-end code via ESLint.

## Coding Style & Naming Conventions
Use 4-space indentation in Python, snake_case for functions/variables, and CapWords for classes, matching `utils/*.py`. Keep imports grouped stdlib/third-party/local and avoid absolute API keys in commits—load them from `.env`. For React, prefer functional components, camelCase for hooks/utilities, SCSS-like class names in `App.css`, and run ESLint before pushing.

## Testing Guidelines
Python unit tests live in `rice-disease-detection/tests/` and rely on `unittest`. Run `python -m unittest discover -s rice-disease-detection/tests` before submitting. Add focused test modules named `test_<feature>.py` and aim to cover API clients (`src/api`) and route handlers (`src/routes`). For the React app, add lightweight component tests or stories if behavior changes the API surface; at minimum run the lint suite.

## Commit & Pull Request Guidelines
Recent history is terse; moving forward, use imperative, descriptive commit subjects (e.g., `feat: add rice yield calibration flow`) with optional body outlining context and test evidence. Each PR should include: summary of changes, linked issue or task ID, screenshots/GIFs for UI updates, and notes on new environment variables or migrations. Ensure CI commands above pass locally before requesting review, and keep PRs scoped to a coherent feature or fix.
