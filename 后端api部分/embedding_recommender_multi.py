# embedding_recommender_multi.py
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np
import joblib

# === 1. 读取训练集（确保这些字段存在）===
'''
df = pd.read_csv("structured_training_data.csv").dropna(subset=[
    "satisfaction_score", "health_score", "calorie_score", "satiety_score"
])
'''
df = pd.read_csv("structured_training_data.csv").dropna(subset=[
    "satisfaction", "health", "calorie", "fullness"
])

# === 2. 编码文本特征 ===
embedder = SentenceTransformer('paraphrase-MiniLM-L6-v2')
user_vecs = embedder.encode(df["preference_text"].astype(str).tolist())
plan_vecs = embedder.encode(df["recommendation"].astype(str).tolist())
num_cols = ["age", "height", "weight", "sport_freq", "cares_about_eating"]
num_feats = df[num_cols].values
X = np.concatenate([user_vecs, plan_vecs, num_feats], axis=1)

# === 3. 多模型训练 ===
#score_fields = ["satisfaction_score", "health_score", "calorie_score", "satiety_score"]
score_fields = ["satisfaction", "health", "calorie", "fullness"]
models = {}

for score_field in score_fields:
    y = df[score_field].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100)
    model.fit(X_train, y_train)
    models[score_field] = model
    joblib.dump(model, f"model_{score_field}.pkl")
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print("✅ 模型评估结果：")
    print(f"MSE: {mse:.4f}", f"R2: {r2:.4f}")

print("✅ 多维评分模型训练完成并保存")
