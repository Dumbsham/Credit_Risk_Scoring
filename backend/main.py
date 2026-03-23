from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import pickle
import json
import pandas as pd
import shap

# --- App setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load everything ---
model = tf.keras.models.load_model("credit_model.keras")

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("feature_columns.json", "r") as f:
    feature_columns = json.load(f)

shap_background = np.load("shap_background.npy")

# Recreate SHAP explainer
explainer = shap.DeepExplainer(model, shap_background)
print("SHAP explainer ready!")

# --- Input schema ---
class ApplicantInput(BaseModel):
    person_age: float
    person_income: float
    person_emp_length: float
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_cred_hist_length: float
    person_home_ownership: str
    loan_intent: str
    loan_grade: str
    cb_person_default_on_file: str

# --- Routes ---
@app.get("/")
def root():
    return {"message": "Credit Risk API is running!"}

@app.post("/predict")
def predict(data: ApplicantInput):
    # 1. Convert to dataframe
    input_dict = data.model_dump()
    input_df = pd.DataFrame([input_dict])

    # 2. One-hot encode
    cat_cols = ['person_home_ownership', 'loan_intent',
                'loan_grade', 'cb_person_default_on_file']
    input_encoded = pd.get_dummies(input_df, columns=cat_cols, drop_first=True)

    # 3. Align columns
    input_encoded = input_encoded.reindex(
        columns=feature_columns, fill_value=0
    )

    # 4. Scale
    input_scaled = scaler.transform(input_encoded)

    # 5. Predict with 0.3 threshold
    probability = float(model.predict(input_scaled)[0][0])
    prediction = 1 if probability > 0.3 else 0

    # 6. SHAP explanation
    shap_values = explainer.shap_values(input_scaled)
    shap_vals = shap_values[0].flatten()

    # Top 6 features
    indices = np.argsort(np.abs(shap_vals))[::-1][:6]
    explanation = [
        {
            "feature": feature_columns[i],
            "impact": round(float(shap_vals[i]), 4),
            "direction": "increases risk" if shap_vals[i] > 0 else "decreases risk"
        }
        for i in indices
    ]

    # 7. Risk level
    if probability > 0.6:
        risk_level = "High"
    elif probability > 0.3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "prediction": "Default" if prediction == 1 else "Safe",
        "default_probability": round(probability * 100, 2),
        "safe_probability": round((1 - probability) * 100, 2),
        "risk_level": risk_level,
        "explanation": explanation
    }