import pandas as pd
import json
import joblib
import numpy as np
import re
import os
from sentence_transformers import SentenceTransformer
from generate_llm_feedback import generate_llm_candidates, run_deepseek_prompt
from flask import Flask, request, jsonify

# 获取当前脚本所在目录的绝对路径
current_dir = os.path.dirname(os.path.abspath(__file__))

# ====== 加载模型 ======
model_files = {
    "satisfaction_score": "model_satisfaction.pkl",
    "health_score": "model_health.pkl",
    "calorie_score": "model_calorie.pkl",
    "satiety_score": "model_fullness.pkl"
}

MODELS = {
    score_type: joblib.load(os.path.join(current_dir, filename))
    for score_type, filename in model_files.items()
}
WEIGHTS = {"satisfaction_score": 0.3, "health_score": 0, "calorie_score": 0.3, "satiety_score": 0.3}
NUMERIC_FIELDS = ["age", "height", "weight", "sport_freq", "cares_about_eating"]
embedder = SentenceTransformer("paraphrase-MiniLM-L6-v2")

def predict_scores(user_row, plan_text):
    user_vec = embedder.encode(str(user_row["preference_text"]))
    plan_vec = embedder.encode(plan_text)
    num_feats = [user_row[col] for col in NUMERIC_FIELDS]
    features = np.concatenate([user_vec, plan_vec, num_feats])
    return {key: model.predict([features])[0] for key, model in MODELS.items()}

def combine_scores(score_dict, weights=WEIGHTS):
    return sum(score_dict[k] * weights[k] for k in weights)

def extract_json_from_text(text):
    try:
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group())
        else:
            raise ValueError("未找到合法的 JSON 格式")
    except json.JSONDecodeError as e:
        print("⚠️ JSON 解析失败：", e)
        print("⚠️ 原始文本为：\n", text)
        raise

def explain_plan_with_llm(plan_text, user_profile, feedback_scores=None):
    plan_data = extract_json_from_text(plan_text)
    plan_str = json.dumps(plan_data, ensure_ascii=False, indent=2)

    feedback_text = f"【用户反馈】上轮用户评价：{feedback_scores['feedback_comment']}\n" if feedback_scores else ""

    prompt = f"""
你是一个营养师，请基于用户信息、上轮反馈（如有）和推荐计划，向用户说明你推荐了哪些食物，以及它们是否回应了用户的关注点。

【用户信息】
性别：{user_profile["性别"]}
年龄：{user_profile["年龄"]}
身高：{user_profile["身高"]}
体重：{user_profile["体重"]}
运动频率：{user_profile["运动频率"]}
偏好：{user_profile["偏好"]}
需求：{user_profile["需求"]}
是否重视吃：{user_profile["是否重视吃"]}
饮食习惯：{user_profile["饮食习惯"]}
其中是否重视吃，1表示重视，0表示不重视

{feedback_text}
【推荐方案】
{plan_str}
    """

    explanation = run_deepseek_prompt(prompt)
    return explanation

def run_cycle(user_profile, user_row, feedback_scores=None):
    plans = generate_llm_candidates(user_profile, n=5, feedback_scores=feedback_scores)
    results = []
    for plan in plans:
        scores = predict_scores(user_row, plan)
        total = combine_scores(scores)
        results.append((plan, scores, total))
    best_plan, best_scores, _ = max(results, key=lambda x: x[2])
    explanation = explain_plan_with_llm(best_plan, user_profile, feedback_scores)
    return best_plan, best_scores, explanation

def process_recommendation(user_profile, feedback_scores=None):
    # 构建user_row
    user_row = pd.Series({
        "age": user_profile["年龄"],
        "height": user_profile["身高"],
        "weight": user_profile["体重"],
        "sport_freq": user_profile["运动频率"],
        "cares_about_eating": user_profile["是否重视吃"],
        "preference_text": user_profile["偏好"],
        "demand_text": user_profile["需求"]
    })

    # 运行推荐循环
    best_plan, best_scores, explanation = run_cycle(user_profile, user_row, feedback_scores)

    # 确保返回的数据结构正确
    meal_plan = extract_json_from_text(best_plan)
    
    # 确保每个餐点都有数据
    if "breakfast" not in meal_plan:
        meal_plan["breakfast"] = []
    if "lunch" not in meal_plan:
        meal_plan["lunch"] = []
    if "dinner" not in meal_plan:
        meal_plan["dinner"] = []
    if "snack" not in meal_plan:
        meal_plan["snack"] = []

    # 返回结果
    return {
        "meal_plan": meal_plan,
        "scores": best_scores,
        "explanation": explanation
    }

# 如果是直接运行脚本（通过环境变量）
if __name__ == "__main__":
    try:
        # 从环境变量获取数据
        user_profile = json.loads(os.environ.get('USER_PROFILE', '{}'))
        feedback_scores = json.loads(os.environ.get('FEEDBACK_SCORES', '{}'))
        
        # 处理推荐
        result = process_recommendation(user_profile, feedback_scores)
        
        # 输出结果
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        exit(1)
