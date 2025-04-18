# ✅ choose_best_embedding.py：仅推理用，基于embedding + 数值特征预测推荐评分
from sentence_transformers import SentenceTransformer
import joblib
import numpy as np
import pandas as pd

# === 加载模型 ===
model = joblib.load("embedding_model.pkl")
embedder = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# 数值字段顺序与训练时保持一致
NUMERIC_FIELDS = ["age", "height", "weight", "sport_freq", "cares_about_eating"]

# === 推荐选择器函数 ===
def choose_best_recommendation(user_row: pd.Series, plans: list[str]) -> dict:
    """
    输入：
        - user_row: 包含用户信息的 pandas Series（字段包含 NUMERIC_FIELDS 和 preference_text）
        - plans: LLM 生成的推荐方案文本列表
    输出：
        - dict，包括最佳推荐文本、预测得分、全部推荐及得分
    """
    user_text = str(user_row["preference_text"])
    user_vec = embedder.encode(user_text)

    numeric_feats = np.array([user_row[col] for col in NUMERIC_FIELDS])

    rows = []
    for plan_text in plans:
        plan_vec = embedder.encode(plan_text)
        features = np.concatenate([user_vec, plan_vec, numeric_feats])
        rows.append(features)

    X = np.vstack(rows)
    scores = model.predict(X)
    best_idx = int(np.argmax(scores))

    return {
        "best_plan": plans[best_idx],
        "best_score": scores[best_idx],
        "all_scores": list(zip(plans, scores))
    }