
import pandas as pd
import json
import joblib
import numpy as np
import re
from sentence_transformers import SentenceTransformer
from generate_llm_feedback import generate_llm_candidates, run_deepseek_prompt

# ====== 加载模型 ======
MODELS = {
    k: joblib.load(f"model_{k}.pkl")
    for k in ["satisfaction_score", "health_score", "calorie_score", "satiety_score"]
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

def run_cycle(user_profile, user_row, feedback_scores=None, round_num=1):
    print(f"\n=== 第 {round_num} 轮推荐 ===")
    plans = generate_llm_candidates(user_profile, n=5, feedback_scores=feedback_scores)
    results = []
    for plan in plans:
        scores = predict_scores(user_row, plan)
        total = combine_scores(scores)
        results.append((plan, scores, total))
    best_plan, best_scores, _ = max(results, key=lambda x: x[2])
    print("\n📊 得分解释：\n", f"满意度：{best_scores['satisfaction_score']:.2f}, 热量控制：{best_scores['calorie_score']:.2f}, 饱腹感：{best_scores['satiety_score']:.2f}")
    print("\n🤖 LLM解释推荐方案如下：\n", explain_plan_with_llm(best_plan, user_profile, feedback_scores))
    return best_plan

print("请输入用户信息：")
age = int(input("年龄: "))
height = int(input("身高(cm): "))
weight = int(input("体重(斤): "))
gender = input("性别（男/女）: ")
frequency = int(input("一周运动几次 : "))
preference_text = input("饮食偏好描述（如：喜欢鸡肉，不吃辣）: ")
demand_text = input("需求 ：")
cares = int(input("是否重视吃（填1表示重视，填0表示不那么重视）: "))
eat_habit = input("饮食习惯（如：少食，正常或多食）: ")

user_row = pd.Series({
    "age": age, "height": height, "weight": weight,
    "sport_freq": frequency, "cares_about_eating": cares,
    "preference_text": preference_text,
    "demand_text": demand_text
})
user_profile = {
    "性别": gender, "年龄": age, "体重": weight,
    "身高": height, "运动频率": frequency, "是否重视吃": cares,
    "饮食习惯": eat_habit, "偏好": preference_text, "需求": demand_text
}

feedback_scores = None
round_num = 1

while True:
    best_plan = run_cycle(user_profile, user_row, feedback_scores, round_num)
    print("\n🔁 请根据推荐方案给出反馈（1-5分），或输入 q 退出")
    satisfaction = input("满意度评分：")
    if satisfaction.strip().lower() == 'q':
        print("程序结束。")
        break
    calorie = input("热量控制评分：")
    if calorie.strip().lower() == 'q':
        print("程序结束。")
        break
    satiety = input("饱腹感评分：")
    if satiety.strip().lower() == 'q':
        print("程序结束。")
        break
    feedback_text = input("请写一句话评价这份推荐方案（用于下一轮优化，或输入 q 退出）: ")
    if feedback_text.strip().lower() == 'q':
        print("程序结束。")
        break

    feedback_scores = {
        "satisfaction": int(satisfaction),
        "calorie": int(calorie),
        "satiety": int(satiety),
        "feedback_comment": feedback_text
    }
    round_num += 1
