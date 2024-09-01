import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';

interface Result {
  policy_name: string;
  budget: number;
  target_group: string;
  duration: number;
  expected_outcome: string;
  analysis: string;  // Assuming analysis is returned as a JSON string
}

interface Analysis {
  overview: string;
  impact: string;
  conclusion: string;
}

const policyOptions = [
  { label: "Healthcare Reform", value: "Healthcare Reform" },
  { label: "Education Funding", value: "Education Funding" },
  { label: "Climate Change Policy", value: "Climate Change Policy" },
  { label: "Tax Reform", value: "Tax Reform" }
];

const targetGroupOptions = [
  { label: "Low-Income Families", value: "Low-Income Families" },
  { label: "Small Businesses", value: "Small Businesses" },
  { label: "Students", value: "Students" },
  { label: "Senior Citizens", value: "Senior Citizens" }
];

export default function Home() {
  const [policyName, setPolicyName] = useState<string>(policyOptions[0].value);
  const [budget, setBudget] = useState<number>(0);
  const [targetGroup, setTargetGroup] = useState<string>(targetGroupOptions[0].value);
  const [duration, setDuration] = useState<number>(1);
  const [expectedOutcome, setExpectedOutcome] = useState<string>('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisParsed, setAnalysisParsed] = useState<Analysis | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        policy_name: policyName,
        budget: budget,
        target_group: targetGroup,
        duration: duration,
        expected_outcome: expectedOutcome,
        // Modify the prompt to request a structured response
        prompt: `Please provide a detailed analysis in the following structure: 
        {
          "overview": "Brief overview of the policy",
          "impact": "Detailed impact on the target group",
          "conclusion": "Overall conclusion and recommendations"
        }`
      });

      setResult(response.data);

      // Try to parse the analysis as JSON
      try {
        const parsedAnalysis: Analysis = JSON.parse(response.data.analysis);
        setAnalysisParsed(parsedAnalysis);
      } catch (jsonError) {
        setError("Failed to parse the analysis as JSON. Displaying raw text instead.");
        setAnalysisParsed(null);
      }
    } catch (error) {
      setError('Failed to fetch results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = (analysis: Analysis | string) => {
    if (typeof analysis === 'string') {
      // Return raw text if not parsed as JSON
      return <p>{analysis}</p>;
    }
    return (
      <div>
        <h4>Overview</h4>
        <p>{analysis.overview}</p>
        <h4>Impact</h4>
        <p>{analysis.impact}</p>
        <h4>Conclusion</h4>
        <p>{analysis.conclusion}</p>
      </div>
    );
  };

  const chartData = result ? {
    labels: Array.from({ length: duration }, (_, i) => `Year ${i + 1}`),
    values: Array.from({ length: duration }, (_, i) => Math.random() * 100), // Placeholder values
  } : null;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Policy Impact Analysis Simulator</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="policyName">Policy Name:</label>
            <select
              id="policyName"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              style={selectStyle}
            >
              {policyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="budget">Budget:</label>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              min="0"
              step="0.01"
              style={inputStyle}
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="targetGroup">Target Group:</label>
            <select
              id="targetGroup"
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              style={selectStyle}
            >
              {targetGroupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="duration">Duration (years):</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="1"
              style={inputStyle}
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="expectedOutcome">Expected Outcome:</label>
            <input
              id="expectedOutcome"
              type="text"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Policy Impact'}
          </button>
        </form>
      </div>

      {error && (
        <div style={cardStyle}>
          <h2 style={errorTitleStyle}>Error</h2>
          <p style={errorMessageStyle}>{error}</p>
        </div>
      )}

      {result && (
        <div style={cardStyle}>
          <h2 style={resultTitleStyle}>Impact Analysis Result</h2>
          <p><strong>Policy Name:</strong> {result.policy_name}</p>
          <p><strong>Budget:</strong> ${result.budget}</p>
          <p><strong>Target Group:</strong> {result.target_group}</p>
          <p><strong>Duration:</strong> {result.duration} years</p>
          <p><strong>Expected Outcome:</strong> {result.expected_outcome}</p>
          <h3 style={analysisTitleStyle}>AI-Generated Analysis:</h3>
          <div style={analysisTextStyle}>
            {analysisParsed ? renderAnalysis(analysisParsed) : renderAnalysis(result.analysis)}
          </div>

          {chartData && (
            <div style={chartContainerStyle}>
              <ChartComponent data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Inline styles for the components
const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif'
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px'
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#333'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const inputGroupStyle = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px'
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: '20px',
  transition: 'background-color 0.3s'
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3'
};

const errorTitleStyle = {
  color: '#ff0000',
  textAlign: 'center'
};

const errorMessageStyle = {
  color: '#ff0000',
  textAlign: 'center'
};

const resultTitleStyle = {
  fontSize: '20px',
  marginBottom: '10px'
};

const analysisTitleStyle = {
  marginTop: '20px',
  fontSize: '18px',
  fontWeight: 'bold'
};

const analysisTextStyle = {
  marginTop: '10px',
  lineHeight: 1.6
};

const chartContainerStyle = {
  marginTop: '20px'
};