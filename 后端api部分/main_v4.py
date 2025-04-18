
import pandas as pd
import json
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer
from generate_llm_feedback import generate_llm_candidates

# ====== 加载多模型 ======
MODELS = {
    k: joblib.load(f"model_{k}.pkl")
    for k in ["satisfaction_score", "health_score", "calorie_score", "satiety_score"]
}
WEIGHTS = {"satisfaction_score": 0.3, "health_score": 0, "calorie_score": 0.2, "satiety_score": 0.2}
NUMERIC_FIELDS = ["age", "height", "weight", "sport_freq", "cares_about_eating"]
embedder = SentenceTransformer("paraphrase-MiniLM-L6-v2")

# ====== 用户信息（示例） ======
user_row = pd.Series({
    "age": 22, "height": 180, "weight": 150, "sport_freq": 4,
    "cares_about_eating": 1, "preference_text": "喜欢牛肉、西兰花、不吃花椒"
})
user_profile = {
    "性别": "男", "年龄": user_row["age"], "体重": user_row["weight"],
    "身高": user_row["height"], "偏好": user_row["preference_text"]
}

# ====== 打分函数 ======
def predict_scores(user_row, plan_text):
    user_vec = embedder.encode(str(user_row["preference_text"]))
    plan_vec = embedder.encode(plan_text)
    num_feats = [user_row[col] for col in NUMERIC_FIELDS]
    features = np.concatenate([user_vec, plan_vec, num_feats])
    return {
        key: model.predict([features])[0]
        for key, model in MODELS.items()
    }

def combine_scores(score_dict, weights=WEIGHTS):
    return sum(score_dict[k] * weights[k] for k in weights)

def explain_plan(plan, score_dict):
    return f"""推荐方案得分如下：
    - 满意度：{score_dict['satisfaction_score']:.2f}
    - 热量控制：{score_dict['calorie_score']:.2f}
    - 饱腹感：{score_dict['satiety_score']:.2f}
该方案在多个维度表现出色，尤其在{"、".join(sorted(score_dict, key=score_dict.get, reverse=True)[:2])}方面。"""

# ====== 生成推荐方案并打分 ======
plans = generate_llm_candidates(user_profile, n=5)
results = []
for plan in plans:
    scores = predict_scores(user_row, plan)
    total = combine_scores(scores)
    results.append((plan, scores, total))

best_plan, best_scores, _ = max(results, key=lambda x: x[2])

print("\n✅ 最优推荐方案：\n", best_plan)
print("\n📊 得分解释：\n", explain_plan(best_plan, best_scores))

# ====== 收集用户反馈 ======
print("\n🔁 请根据推荐方案给出反馈（1-5分）")
feedback_scores = {
    "satisfaction": int(input("满意度评分：")),
    "calorie": int(input("热量控制评分：")),
    "satiety": int(input("饱腹感评分：")),
}
