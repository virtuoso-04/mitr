import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AI_CONFIG, PERSONAS, CRISIS_CONFIG } from '../config';

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

class AIService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    if (!AI_CONFIG.geminiApiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(AI_CONFIG.geminiApiKey);
  }

  /**
   * Generate a response from the AI with a specific persona
   */
  async generateResponse(message: string, persona: 'arjuna' | 'maya', conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Select the appropriate model
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-pro",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
      
      // Get system prompt for the selected persona
      const systemPrompt = PERSONAS[persona].systemPrompt;
      
      // Prepare conversation history
      let chat;
      
      if (conversationHistory.length > 0) {
        chat = model.startChat({
          history: conversationHistory,
          systemInstruction: systemPrompt,
        });
      } else {
        chat = model.startChat({
          systemInstruction: systemPrompt,
        });
      }
      
      // Generate response
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble processing your message right now. Could you try again in a moment?";
    }
  }
  
  /**
   * Detect if a message indicates a crisis situation
   */
  async detectCrisis(message: string): Promise<{ isCrisis: boolean; score: number }> {
    try {
      const lowerMessage = message.toLowerCase();
      
      // Simple keyword-based detection
      let crisisScore = 0;
      
      // Check for high-risk keywords (direct indications of crisis)
      for (const keyword of CRISIS_CONFIG.highRiskKeywords) {
        if (lowerMessage.includes(keyword)) {
          crisisScore += 0.4; // Higher weight for direct crisis indicators
        }
      }
      
      // Check for medium-risk keywords (indirect indications of crisis)
      for (const keyword of CRISIS_CONFIG.mediumRiskKeywords) {
        if (lowerMessage.includes(keyword)) {
          crisisScore += 0.2; // Lower weight for indirect indicators
        }
      }
      
      // For more sophisticated implementations, we would use a dedicated AI model
      // trained specifically for crisis detection
      
      // Limit score to a maximum of 1.0
      crisisScore = Math.min(crisisScore, 1.0);
      
      return {
        isCrisis: crisisScore >= CRISIS_CONFIG.thresholdScore,
        score: crisisScore
      };
    } catch (error) {
      console.error('Error in crisis detection:', error);
      // Default to considering it a crisis if we encounter an error
      // (better safe than sorry in a mental health application)
      return { isCrisis: true, score: 1.0 };
    }
  }
}

export default new AIService();
