# ✅ score_aggregator.py：多目标评分融合器

def aggregate_scores(scores: dict, weights: dict = None) -> float:
    """
    输入：
        scores: dict，包含多个维度得分，如：
            {
                "satisfaction": 4.2,
                "health": 4.6,
                "fullness": 3.9,
                "calorie": 4.4
            }
        weights: dict，可选，指定每个评分维度的加权权重，若为空默认均等加权

    输出：
        float，总分数（0~5），作为最终推荐评分
    """
    if weights is None:
        weights = {key: 1.0 for key in scores.keys()}

    total_weight = sum(weights.values())
    weighted_sum = sum(scores[key] * weights.get(key, 1.0) for key in scores.keys())

    final_score = round(weighted_sum / total_weight, 4)
    return final_score


# 示例调用
if __name__ == "__main__":
    multi_scores = {
        "satisfaction": 4.3,
        "health": 4.7,
        "fullness": 4.0,
        "calorie": 4.2
    }

    weights = {
        "satisfaction": 0.4,
        "health": 0.3,
        "fullness": 0.2,
        "calorie": 0.1
    }

    total = aggregate_scores(multi_scores, weights)
    print("最终推荐得分：", total)
