import pandas as pd

# 读取文件
df = pd.read_csv("cleaneddata.csv")

# 显示缺失情况
print(df.isnull().sum())

# 常见处理方式：用平均值 / 中位数填充，或直接删除缺失太多的列
df_filled = df.fillna(0)  # 数值字段用均值填充

# 保存新文件
df_filled.to_csv("cleaneddata_filled.csv", index=False)

