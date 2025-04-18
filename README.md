
## 🍚🍔 AI-Diet-Agent

A personalized AI diet recommendation agent powered by reinforcement learning and adaptive AI assistance.

---
## ⭐ Project Overview

This project aims to build a personalized AI system that recommends daily diet plans based on user goals (e.g., fat loss, muscle gain), physical parameters, and historical behavior. The system simulates economic decision-making under constraints (satisfaction, health targets, and calorie budget), integrates reinforcement learning to optimize recommendations, and uses a large language model (LLM) to generate interpretable suggestions.

---
## 🎯 Project Background

Traditional nutrition products often focus on "physiological optimality" and assume that humans will strictly follow nutritional rules for diet management. This approach ignores the diversity of individual goals, irrational behavior, and psychological fatigue of long-term persistence.

Although web AI question-and-answer tools based on large models can provide a certain degree of freedom, their use threshold is high: users need to actively describe problems, set goals, and make feedback adjustments, which not only increases the cost of information input, but also requires users to have long-term planning capabilities and decision-making execution capabilities. This type of system is more like "auxiliary consultation" rather than "intelligent companionship and guidance."

---
## 🚀 Motivation & Innovation value

This project remodels dietary behavior as a "multi-objective optimization process under limited resources", introduces the utility function, budget constraints and behavioral dynamic system in economics, and builds a personalized behavior-goal intelligent agent driven by reinforcement learning to achieve the following innovative values:

### 📏 From a Nutrition Perspective:
Instead of applying a unified health standard to everyone, we combine individual physiological conditions and dietary preferences to dynamically generate recommendations under a multi-objective balance (satisfaction/health goals/calorie control), providing users with scientific and truly personalized dietary advice.

### 💵 From an Economics Perspective:
A system that simulates "real human decision-making" was built to depict the utility maximization path under "limited rationality + delayed gratification + resource constraints", thus answering the question: "Why do people know they are healthy but find it difficult to stick to it?" and providing a sustainable optimization path to make "healthy eating" as natural as "breathing".

### 🤖 From an AI Product Perspective:
Evolve "question-and-answer AI" into a "structured decision support system" so that AI does not just answer questions, but helps users save time, reduce thinking burden, and improve execution through strategy learning, truly becoming a behavioral intelligent entity that "understands you".

## 📁 Project Directory Structure

```
📦 AI-Nutrition-Recommender
│
├── app/                               # 🔧 Next.js app directory (pages & routing)
├── components/                        # 🧩 React components (form, feedback, display)
├── backend/                           # 🧠 Python backend logic (model + generation + scoring)
│   ├── embedding_recommender_multi.py     # Train multi-objective RL model
│   ├── main_v4_loop_fixed.py              # Main closed-loop execution: generate, score, explain, feedback
│   ├── choose_best_embedding.py           # Selects best plan using embedding similarity
│   └── generate_llm_feedback.py           # Injects user feedback into prompt
│
├── README.md                         # 📘 Project overview and documentation
├── task.md                           # 🗂️ Project to-do and progress log
├── package.json                      # 📦 Node.js project config
├── package-lock.json                 # 🔐 Dependency lockfile
├── package-lock 2.json              # ⚠️ Duplicate lockfile (can remove)
├── tailwind.config.js               # 🎨 Tailwind CSS config
├── postcss.config.js                # 🧪 CSS processor config
├── tsconfig.json                    # 🧱 TypeScript config
├── next-env.d.ts                    # 🌐 Next.js type declarations
```

