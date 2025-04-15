import pandas as pd

# 读取你上传的Excel文件 Sheet2
df_raw = pd.read_excel("user.xlsx", sheet_name=0)

# 引入结构化函数
def structure_user_profile(df_raw):
    df_users = df_raw.copy()
    df_users["sex"] = df_users["性别"].map({"女": 0, "男": 1})

    def parse_sport_freq(x):
        try:
            if isinstance(x, str) and "/" in x:
                a, b = map(int, x.split("/"))
                return round(a / b, 2)
            return float(x)
        except:
            return 0

    df_users["sport_freq"] = df_users["运动频率（/周）"].apply(parse_sport_freq)
    df_users["cares_about_eating"] = df_users["是否重视吃"].map({"是": 1, "否": 0})
    df_users["need"] = df_users["需求(健身,减脂)"].fillna("未知")

    structured_users = df_users[[
        "性别", "年龄", "身高", "体重（斤）", "sport_freq", "偏好（喜欢的食物，不喜欢的食物，如爱吃肉，不喜吃蔬菜）",
        "need", "饮食习惯", "cares_about_eating"
    ]].copy()
    structured_users = structured_users.rename(columns={
        "性别": "sex_label",
        "年龄": "age",
        "身高": "height",
        "体重（斤）": "weight",
        "偏好（喜欢的食物，不喜欢的食物，如爱吃肉，不喜吃蔬菜）": "preference_text",
        "饮食习惯": "eat_habit"
    })
    return structured_users

def structure_user_feedback(df_raw):
    feedback_rows = []
    for idx, row in df_raw.iterrows():
        for n in range(1, 6):  # 推荐策略1~5
            base = f"推荐策略{n}"
            if base in row and pd.notna(row[base]):
                if n == 1:
                    suffix = ""
                else:
                    suffix = f".{n - 1}"

                feedback_rows.append({
                    "user_id": idx,
                    "plan_id": n - 1,
                    "recommendation": row[base],
                    "satisfaction": row.get(f"满意度{suffix}", None),
                    "health": row.get(f"健康目标达成度{suffix}", None),
                    "calorie": row.get(f"热量预算达成度{suffix}", None),
                    "fullness": row.get(f"饱腹感{suffix}", None),
                    "total_score": row.get(f"总分{suffix}", None),
                })
    return pd.DataFrame(feedback_rows)


def join_user_and_feedback(user_df, feedback_df):
    feedback_df = feedback_df.copy()
    feedback_df["user_id"] = feedback_df["user_id"].astype(int)
    user_df = user_df.copy()
    user_df["user_id"] = user_df.index.astype(int)
    return feedback_df.merge(user_df, on="user_id", how="left")

# 主流程执行
df_user = structure_user_profile(df_raw)
df_feedback = structure_user_feedback(df_raw)
df_final = join_user_and_feedback(df_user, df_feedback)


print(df_final.head())  # 预览前几条
df_final.to_csv("structured_training_data.csv", index=False, encoding="utf-8-sig")  # 保存结构化数据

