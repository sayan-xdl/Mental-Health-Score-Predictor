# OMNIMIND — Mental Health Score Predictor

OMNIMIND is an end-to-end machine learning web application that estimates a student's wellbeing score from demographic information, digital habits and lifestyle.

##  Live Demo

- **Frontend:** https://mental-health-score-predictor-1-5303.onrender.com
- **Backend:** https://mental-health-score-predictor-op15.onrender.com

##  Features

- Estimated wellbeing score on a **1–10 scale**
- FastAPI backend with Pydantic validation
- Responsive HTML/CSS/JavaScript frontend
- Scikit-learn Pipeline
- Random Forest regression algorithm
- Hyperparameter tuning
- Render deployment

##  Tech Stack

- **ML:** Python, Pandas, NumPy, Scikit-learn, Random Forest, RandomizedSearchCV, Joblib
- **Backend:** FastAPI, Pydantic, Uvicorn, CORS
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Render

##  Input Features

Age, gender, country, academic level, most-used platform, social-media activity, daily social-media usage, phone unlocks, study hours, physical activity, sleep hours, and stress level.


##  ML Workflow

1. **Data Cleaning:** Removed duplicate rows and grouped less common countries together.
2. **Preprocessing (ColumnTransformer):** Removed skewness and scaled the skewed feature, scaled non-skewed features (StandardScaler), applied ordinal encoding on stress level (OrdinalEncoder) and one-hot encoding on other categorical columns (OneHotEncoder).
3. **Modeling:** Tested three models—Linear Regression, default Random Forest, and tuned Random Forest—to select the best one.
4. **Evaluation:** Evaluated using $R^2$, MAE, and RMSE.
5. **Saving the Model:** Saved the final tuned Pipeline to Mental_Health_Model.pkl using Joblib.

##  Model Performance (Test Set)

* **$R^2$ Score:** 0.8725
* **MAE:** 0.3584
* **RMSE:** 0.4732

##  Backend

* **FastAPI:** Runs the /predict route and loads the model once at startup so predictions return instantly.
* **Pydantic Validation:** Validates all incoming user inputs before running the model.
* **CORS:** Configured cross-origin resource sharing so that frontend can communicate with the backend.

##  Deployment

Hosted on **Render**:

* **Backend (Web Service):** Runs the FastAPI app with Uvicorn.
  * **Start Command:** uvicorn main:app --host 0.0.0.0 --port $PORT.
* **Frontend (Static Site):** Serves the user interface.

##  Disclaimer

OMNIMIND is an experimental ML project. Its output is an estimated score, not a medical diagnosis. It must not be used to assess a real mental-health condition.

##  Author

**Sayan** — [sghosh0529@gmail.com](mailto:sghosh0529@gmail.com)

