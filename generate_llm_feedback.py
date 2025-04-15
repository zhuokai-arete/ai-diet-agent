# generate_llm_feedback.py
import openai

client = openai.OpenAI(
    base_url="https://api.deepseek.com/v1",
    api_key="sk-c8cd17b77764463da9bd39bcc6ef552f"  # 替换为你自己的key
)

def generate_prompt(user_profile, feedback_scores=None):
    feedback_text = ""
    if feedback_scores:
        feedback_text = f"""
【用户反馈】
- 上轮推荐满意度：{feedback_scores.get("satisfaction", "无")}
- 健康达成度：{feedback_scores.get("health", "无")}
- 热量控制：{feedback_scores.get("calorie", "无")}
- 饱腹感：{feedback_scores.get("satiety", "无")}
请根据反馈优化方案。
"""

    return f"""
你是一个营养学专家，请根据以下用户信息生成一份减脂饮食计划：

【用户信息】
- 性别：{user_profile['性别']}
- 年龄：{user_profile['年龄']} 岁
- 身高：{user_profile['身高']} cm
- 体重：{user_profile['体重']} 斤
- 饮食偏好：{user_profile['偏好']}

{feedback_text}

【要求】
1. 总热量控制在 1800 千卡以内
2. 鼓励使用高蛋白食物
3. 输出结构化 JSON 格式，每顿饭包括食材英文名(en_name)、中文名(zh_name)、重量(weight_g)
4. 注意上面重量(weight_g)的输出单位为g
5. 四餐（breakfast / lunch / dinner / snack）差异尽量明显，食物尽可能不重复

请仅输出结构化 JSON 对象（从大括号“{{”开始），如下格式：
{{
  "meal_plan": {{
    "breakfast": [...],
    "lunch": [...],
    "dinner": [...],
    "snack": [...]
  }}
}}
"""

def run_deepseek_prompt(user_profile, feedback_scores=None):
    prompt = generate_prompt(user_profile, feedback_scores)
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.95
    )
    return response.choices[0].message.content

def generate_llm_candidates(user_profile, n=5, feedback_scores=None):
    return [run_deepseek_prompt(user_profile, feedback_scores) for _ in range(n)]
