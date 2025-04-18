
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

---
## ✨ Repository Structure
```
📦 AI-Nutrition-Recommender
│
├── embedding_recommender_multi.py        # 🔁 Train multi-objective RL scoring model using embedding vectors
├── main_v4_loop_fixed.py                 # 🚀 Main program: generates, scores, explains, and loops with feedback
│
├── choose_best_embedding.py              # 🧠 Utility: selects the best plan based on total or multi-metric score
├── generate_llm_feedback.py              # 📝 Utility: builds new prompts with user feedback for adaptive generation
│
├── structured_training_data.csv          # 📊 Training dataset with user plans and annotated feedback (satisfaction, health, etc.)
├── utils/                                # 🔧 Helper functions (e.g., embedding computation, JSON parsing, scoring rules)
│
├── frontend/                             # 🌐 Frontend interface (Next.js + Tailwind)
│   ├── components/                       # React components: form, recommendation display, feedback form
│   ├── pages/                            # API routes and frontend logic
│   └── styles/                           # Tailwind and global CSS
│
├── README.md                             # 📘 Project overview and usage instructions
├── requirements.txt                      # 🧪 Python dependency list
└── demo/                                 # 📽️ Screenshots, video demos, and outputs (optional)
```
