# Policy Impact Analysis Simulator

This project is a web-based tool that leverages AI to generate policy impact analysis. It consists of a backend built with Flask and a frontend built with React. The application uses GPT-Neo to analyze policy inputs and provide insights on the potential impact on specific target groups.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Frontend](#frontend)
- [License](#license)

## Features

- **AI-Powered Analysis**: Utilizes the GPT-Neo model to generate detailed analysis of policy impact based on inputs like policy name, budget, target group, duration, and expected outcome.
- **Dynamic Frontend**: React-based frontend that allows users to input policy details and receive an analysis, complete with a visual chart of impact over time.
- **Chart Visualization**: Displays a chart that represents the impact over the specified duration.

## Installation

### Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/ivezeh/policy-impact-analysis.git
    cd policy-impact-analysis/backend
    ```

2. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the Flask server:
    ```bash
    python app.py
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Run the React development server:
    ```bash
    npm start
    ```

## Usage

1. Start the Flask backend server as described above.
2. Start the React frontend server as described above.
3. Open your browser and navigate to `http://localhost:3000`.
4. Fill in the policy details in the form, including policy name, budget, target group, duration, and expected outcome.
5. Click the "Analyze Policy Impact" button to submit the form.
6. View the AI-generated policy analysis and chart visualization.

## API

### `POST /api/analyze`

Endpoint to analyze policy impact using AI.

#### Request Body

- `policy_name` (string): Name of the policy.
- `budget` (number): Budget allocated to the policy.
- `target_group` (string): Target group affected by the policy.
- `duration` (number): Duration of the policy in years.
- `expected_outcome` (string): Expected outcome of the policy.

#### Example
```json
{
  "policy_name": "Healthcare Reform",
  "budget": 1000000,
  "target_group": "Low-Income Families",
  "duration": 5,
  "expected_outcome": "Improved healthcare access for low-income families"
}
