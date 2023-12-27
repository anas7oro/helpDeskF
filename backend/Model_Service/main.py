from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = FastAPI()
print("Starting the model service...")


df = pd.read_csv('Dataset for Extrafeature.csv')
df['Priority'] = df['Priority'].map({'low': 0, 'medium': 1, 'high': 2})
df['Type'] = df['Type'].map({'software': 0, 'hardware': 1, 'network': 2})
X = df[['Priority', 'Type']]
y = df['Agent']
X_train, _, y_train, _ = train_test_split(X, y, random_state=42)
rf_classifier = RandomForestClassifier(n_estimators=10, random_state=42)
rf_classifier.fit(X_train, y_train)

train_predictions = rf_classifier.predict(X_train)
train_accuracy = accuracy_score(y_train, train_predictions)
print("Training Accuracy:", train_accuracy)


class InputData(BaseModel):
    priority: str
    type: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict")
async def predict(data: InputData):
    try:
        
        input_df = pd.DataFrame([[data.priority, data.type]], columns=['Priority', 'Type'])

        
        input_df['Priority'] = input_df['Priority'].map({'low': 0, 'medium': 1, 'high': 2})
        input_df['Type'] = input_df['Type'].map({'software': 0, 'hardware': 1, 'network': 2})

        
        probabilities = rf_classifier.predict_proba(input_df)

        
        class_labels = rf_classifier.classes_

        
        prediction = dict(zip(class_labels, probabilities[0]))

        return {"prediction": prediction}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

