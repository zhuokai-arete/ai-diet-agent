import { NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface UserProfile {
  性别: string;
  年龄: number;
  体重: number;
  身高: number;
  运动频率: number;
  是否重视吃: number;
  饮食习惯: string;
  偏好: string;
  需求: string;
}

interface FeedbackScores {
  satisfaction?: number;
  health?: number;
  calorie?: number;
  satiety?: number;
  feedback_comment?: string;
}

export async function POST(request: Request) {
  try {
    const { userProfile, feedback_scores } = await request.json();

    // 获取当前工作目录
    const currentDir = process.cwd();
    
    // 构建Python脚本的绝对路径
    const pythonScript = path.join(currentDir, '后端api部分', 'main_v4_loop_fixed.py');
    
    // 使用引号包裹路径，处理空格和特殊字符
    const pythonCommand = `python3 "${pythonScript}"`;
    
    // 设置环境变量
    const env = {
      ...process.env,
      PYTHONPATH: path.join(currentDir, '后端api部分'),
      USER_PROFILE: JSON.stringify(userProfile),
      FEEDBACK_SCORES: JSON.stringify(feedback_scores || {})
    };

    // 执行Python脚本
    const { stdout, stderr } = await execAsync(pythonCommand, {
      env,
      cwd: path.join(currentDir, '后端api部分')
    });

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // 解析Python脚本的输出
    const result = JSON.parse(stdout);

    return NextResponse.json({
      meal_plan: result.meal_plan,
      scores: result.scores,
      explanation: result.explanation
    });
  } catch (error) {
    console.error('Error in recommendation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
} 