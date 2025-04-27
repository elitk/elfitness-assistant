import type { NextApiRequest, NextApiResponse } from 'next';
import { UserContext, Workout } from '../../types';
import ollama from 'ollama';

const userContexts: Record<string, UserContext> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.body", req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const { message, userId } = req.body;
    
    if (!userContexts[userId]) {
      userContexts[userId] = {
        personalInfo: {},
        workouts: [],
        lastMessages: []
      };
    }
    
    userContexts[userId].lastMessages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    updateContextFromMessage(userContexts[userId], message);
    
    const systemMessage = buildSystemPrompt(userContexts[userId]);
    
    try {
      const response = await ollama.chat({
        model: "llama3.2",
        messages: [
          { role: 'system', content: systemMessage },
          ...userContexts[userId].lastMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      });
      
      const aiResponse = response.message.content;

      userContexts[userId].lastMessages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      });
      
      return res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('Ollama API error:', error);
      return res.status(500).json({ 
        error: 'Failed to get response from LLM' 
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

function updateContextFromMessage(context: UserContext, message: string): void {
  const heightMatch = message.match(/גובה שלי (הוא )?(\d+)/i);
  if (heightMatch) {
    context.personalInfo.height = parseInt(heightMatch[2]);
  }
  
  const weightMatch = message.match(/משקל שלי (הוא )?(\d+)/i);
  if (weightMatch) {
    context.personalInfo.weight = parseInt(weightMatch[2]);
  }
  
  const ageMatch = message.match(/גיל שלי (הוא )?(\d+)/i);
  if (ageMatch) {
    context.personalInfo.age = parseInt(ageMatch[2]);
  }
  
  const workoutMatch = message.match(/התאמנתי (היום|אתמול) ב(.*?)( למשך (\d+) דקות)?/i);
  if (workoutMatch) {
    const newWorkout: Workout = {
      date: workoutMatch[1] === 'היום' ? new Date() : new Date(Date.now() - 86400000),
      type: workoutMatch[2].trim(),
      duration: workoutMatch[4] ? parseInt(workoutMatch[4]) : 60,
    };
    
    context.workouts.push(newWorkout);
  }
  
}

function buildSystemPrompt(context: UserContext): string {
  const { personalInfo, workouts } = context;
  
  let systemPrompt = `You are a professional and encouraging virtual fitness trainer. 
Your goal is to help the user achieve their fitness goals, answer questions, and provide helpful advice in the field of fitness and nutrition.
Respond in English in a friendly manner.

`;

  if (Object.keys(personalInfo).length > 0) {
    systemPrompt += `\nUser Information:\n`;
    if (personalInfo.age) systemPrompt += `- Age: ${personalInfo.age}\n`;
    if (personalInfo.height) systemPrompt += `- Height: ${personalInfo.height} cm\n`;
    if (personalInfo.weight) systemPrompt += `- Weight: ${personalInfo.weight} kg\n`;
    
    if (personalInfo.height && personalInfo.weight) {
      const heightInM = personalInfo.height / 100;
      const bmi = personalInfo.weight / (heightInM * heightInM);
      systemPrompt += `- BMI: ${bmi.toFixed(1)}\n`;
    }
  }
  
  if (workouts.length > 0) {
    systemPrompt += `\nRecent Workouts:\n`;
    const recentWorkouts = workouts.slice(-3).reverse();
    
    recentWorkouts.forEach(workout => {
      const date = workout.date instanceof Date ? 
        workout.date.toLocaleDateString('en-US') : 
        new Date(workout.date).toLocaleDateString('en-US');
      
      systemPrompt += `- On ${date}: ${workout.type} for ${workout.duration} minutes\n`;
    });
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const workoutsLastWeek = workouts.filter(w => {
      const workoutDate = w.date instanceof Date ? w.date : new Date(w.date);
      return workoutDate >= oneWeekAgo;
    });
    
    systemPrompt += `\nWorkout frequency in the last week: ${workoutsLastWeek.length} workouts\n`;
  }
  
  return systemPrompt;
}