from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)

# Load the GPT-Neo model and tokenizer
model_name = "EleutherAI/gpt-neo-1.3B"  # You can also try the larger "gpt-neo-2.7B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

def generate_policy_analysis(policy_name, budget, target_group, duration, expected_outcome):
    prompt = (
        f"Analyze the following policy:\n"
        f"Policy Name: {policy_name}\n"
        f"Budget: {budget}\n"
        f"Target Group: {target_group}\n"
        f"Duration: {duration} years\n"
        f"Expected Outcome: {expected_outcome}\n"
        "Provide a detailed analysis of the potential impact on the target group and overall public sector outcomes."
    )
    
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(inputs.input_ids, max_length=200, do_sample=True, temperature=0.7)
    analysis = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return analysis

@app.route('/api/analyze', methods=['POST'])
def analyze_policy():
    data = request.json
    policy_name = data.get('policy_name')
    budget = data.get('budget')
    target_group = data.get('target_group')
    duration = data.get('duration')
    expected_outcome = data.get('expected_outcome')

    analysis = generate_policy_analysis(policy_name, budget, target_group, duration, expected_outcome)

    return jsonify({
        'policy_name': policy_name,
        'budget': budget,
        'target_group': target_group,
        'duration': duration,
        'expected_outcome': expected_outcome,
        'analysis': analysis
    })

if __name__ == '__main__':
    app.run(debug=True)