# 🏦 Credit Risk Scoring

> Predict loan default risk with explainable AI — built with TensorFlow, SHAP, FastAPI, and React.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)
![SHAP](https://img.shields.io/badge/SHAP-explainability-blueviolet)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-frontend-61DAFB?logo=react)

---

## ✨ What it does

Submit a loan applicant's profile → get an instant **APPROVE / REVIEW / REJECT** verdict with default probability and **SHAP-powered explanation** of which factors drove the decision.

**3 verdicts:** 🔴 Reject · 🟡 Review · 🟢 Approve

---

## 🧠 Model Architecture

```
Input(22) → Dense(64, ReLU) → Dropout(0.3) → Dense(32, ReLU) → Dropout(0.2) → Dense(16, ReLU) → Dense(1, Sigmoid)
```

| Detail | Value |
|---|---|
| Framework | TensorFlow / Keras |
| Dataset | Credit Risk Dataset (Kaggle, 32k samples) |
| Features | 22 (after one-hot encoding) |
| Optimizer | Adam |
| Loss | Binary Crossentropy |
| Decision Threshold | 0.3 (tuned for higher recall) |
| Test Accuracy | ~92% |

---

## ⚖️ Handling Class Imbalance — SMOTE

Dataset was imbalanced (78% safe, 22% default). Handled via **SMOTE** on training data only:

```
Before SMOTE: 20,373 safe  vs  5,686 default
After SMOTE:  20,373 safe  vs  20,373 default  ✅
```

SMOTE generates synthetic minority samples by interpolating between existing ones — giving the model equal exposure to both classes.

> ⚠️ SMOTE is applied **after** train/test split — test data always stays real and untouched.

---

## 🔍 Explainability — SHAP

Every prediction comes with a SHAP explanation showing which features increased or decreased default risk:

```json
{ "feature": "loan_percent_income", "impact": 0.8878, "direction": "increases risk" },
{ "feature": "person_income",       "impact": -0.173, "direction": "decreases risk" }
```

Banks are legally required to explain loan rejections — SHAP makes this possible.

---

## 🚀 Getting Started

### Backend
```bash
cd backend
venv\Scripts\activate       # Windows
uvicorn main:app --reload
# → http://127.0.0.1:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 📡 API

```http
POST /predict
```
```json
// Request
{
  "person_age": 23, "person_income": 15000,
  "loan_amnt": 10000, "loan_int_rate": 18.5,
  "loan_percent_income": 0.67, "loan_grade": "E",
  "cb_person_default_on_file": "Y", ...
}

// Response
{
  "prediction": "Default",
  "default_probability": 91.33,
  "safe_probability": 8.67,
  "risk_level": "High",
  "explanation": [...]
}
```

---

## 💡 Key Learnings

- **SMOTE** for handling extreme class imbalance — generates synthetic minority samples
- **Threshold tuning** — lowering from 0.5 to 0.3 increases recall on defaulters
- **SHAP DeepExplainer** for neural network explainability
- Saving `shap_background.npy` instead of pickling the explainer (SymbolicTensor issue)
- 3-layer ANN for more complex tabular patterns
- Precision vs Recall tradeoff in high-stakes domains

---

## 🗂️ Stack

`TensorFlow` · `SHAP` · `FastAPI` · `React` · `Vite` · `Tailwind CSS` · `Pandas` · `imbalanced-learn`