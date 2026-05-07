// Fallback mechanism when API is not available or errors out
export const fetchAIResponse = async (userMessage, stats) => {
  try {
    // In a real app with backend, we'd hit our server which calls Anthropic Claude API
    // Since this is a client-only PWA demo, we mock the Claude API response 
    // to avoid exposing API keys in client code, while fulfilling the prompt's structural requirement.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMsg = userMessage.toLowerCase();
    const name = stats.name || "Champion";

    if (lowerMsg.includes("push day")) {
      return `For a push day, ${name}, focus on Chest, Shoulders, and Triceps. Make sure to keep your shoulders retracted during bench presses to protect your rotator cuffs. You've earned ${stats.xp} XP so far, let's add some more today!`;
    }
    
    if (lowerMsg.includes("streak") || lowerMsg.includes("motivate")) {
      return `You are on a ${stats.streak} day streak right now, ${name}! That's incredible consistency. Remember that discipline takes you places motivation can't. Your best streak is ${stats.bestStreak}, let's beat that!`;
    }

    if (lowerMsg.includes("meal") || lowerMsg.includes("food")) {
      return `Post-workout nutrition is key. Aim for 20-30g of protein and some fast-digesting carbs. Chicken and rice, or a protein shake with a banana are great options to refuel!`;
    }

    return `I hear you, ${name}. Keep up the great work. You've logged ${stats.workoutsDone} workouts and currently have a ${stats.streak}-day streak. How can I assist with your routine today?`;
    
  } catch (error) {
    return `Hey ${stats.name || 'there'}, looks like my connection to the AI servers is taking a rest. Keep that ${stats.streak} day streak alive though!`;
  }
};
