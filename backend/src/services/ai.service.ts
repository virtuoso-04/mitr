import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AI_CONFIG, PERSONAS, CRISIS_CONFIG } from '../config';
import gitaKnowledge, { 
  findRelevantGitaWisdom, 
  formatVerseForDisplay, 
  GitaVerse, 
  keyWellnessVerses 
} from './gitaKnowledge';

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

interface AIResponse {
  text: string;
  gitaVerse?: {
    sanskrit: string;
    citation: string;
    translation: string;
    explanation?: string;
  };
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
  async generateResponse(message: string, persona: 'arjuna' | 'maya', conversationHistory: ChatMessage[] = []): Promise<AIResponse> {
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
      
      // Extract topics from user message for Gita wisdom
      const topics = this.extractTopicsFromMessage(message);
      const gitaWisdom = findRelevantGitaWisdom(topics);
      
      // Enhance the system prompt with Gita wisdom if relevant verses are found
      let enhancedSystemPrompt = systemPrompt;
      let selectedVerse: GitaVerse | undefined;
      
      if (gitaWisdom.verses.length > 0) {
        // Select the most relevant verse (first match for simplicity)
        selectedVerse = gitaWisdom.verses[0];
        
        // Add Gita wisdom to the prompt
        enhancedSystemPrompt += `\n\nHere is wisdom from the Bhagavad Gita that may be relevant:
        Chapter ${selectedVerse.chapter}, Verse ${selectedVerse.verse}:
        "${selectedVerse.translation}"
        
        When appropriate, incorporate this wisdom into your guidance.`;
      }
      
      // Prepare conversation history
      let chat = model.startChat({
        history: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      });
      
      // Send system prompt as the first message if starting a new conversation
      if (conversationHistory.length === 0) {
        await chat.sendMessage(enhancedSystemPrompt);
      }
      
      // Generate response
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      
      // Prepare response object
      const response: AIResponse = {
        text: responseText
      };
      
      // Add Gita verse if one was found
      if (selectedVerse) {
        response.gitaVerse = formatVerseForDisplay(selectedVerse);
      }
      
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        text: "I'm having trouble processing your message right now. Could you try again in a moment?"
      };
    }
  }
  
  /**
   * Extract potential mental health topics from user message
   */
  private extractTopicsFromMessage(message: string): string[] {
    // Simple keyword-based approach
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    // Map of keywords to topics
    const topicKeywords: Record<string, string[]> = {
      "anxiety": ["anxiety", "anxious", "worry", "stress", "nervous", "fear", "panic"],
      "depression": ["depression", "depressed", "sad", "hopeless", "unmotivated", "tired", "empty"],
      "anger": ["anger", "angry", "upset", "frustrated", "mad", "irritated"],
      "grief": ["grief", "loss", "death", "mourning", "missing"],
      "self-esteem": ["confidence", "self-esteem", "worth", "value", "insecure"],
      "purpose": ["purpose", "meaning", "direction", "lost", "confused", "dharma", "duty"],
      "relationships": ["relationship", "friend", "family", "partner", "colleague", "conflict"],
      "mindfulness": ["mindfulness", "meditation", "present", "awareness", "focus", "attention"],
      "resilience": ["resilience", "strength", "overcome", "challenge", "difficult", "tough"],
      "detachment": ["attachment", "detachment", "letting go", "holding on", "control"]
    };
    
    // Check for topic keywords in the message
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    // If no specific topics found, add some general ones
    if (topics.length === 0) {
      topics.push("mindfulness", "resilience");
    }
    
    return topics;
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
