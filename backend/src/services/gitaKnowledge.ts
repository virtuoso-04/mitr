/**
 * Bhagavad Gita Knowledge Base Service
 * 
 * This service provides access to wisdom from the Bhagavad Gita,
 * structured for the AI assistant to reference when providing guidance.
 */

// Bhagavad Gita chapters - key themes and concepts
export interface GitaChapter {
  chapter: number;
  name: {
    sanskrit: string;
    english: string;
  };
  theme: string;
  summary: string;
  keyVerses: GitaVerse[];
}

// Structure for individual verses
export interface GitaVerse {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  explanation: string;
  tags: string[]; // For topical searching
}

// Core emotional/mental health concepts from the Gita
export const gitaConcepts = [
  {
    concept: "equanimity",
    sanskrit: "Samatvam",
    description: "Mental balance in success and failure",
    relatedVerses: [
      { chapter: 2, verse: 48 },
      { chapter: 12, verse: 13 },
      { chapter: 14, verse: 24 }
    ]
  },
  {
    concept: "mindfulness",
    sanskrit: "Sthitaprajna",
    description: "Steady awareness and presence of mind",
    relatedVerses: [
      { chapter: 2, verse: 55 },
      { chapter: 2, verse: 56 },
      { chapter: 2, verse: 57 }
    ]
  },
  {
    concept: "detachment",
    sanskrit: "Vairagya",
    description: "Freedom from excessive attachment to outcomes",
    relatedVerses: [
      { chapter: 2, verse: 47 },
      { chapter: 3, verse: 19 },
      { chapter: 18, verse: 6 }
    ]
  },
  {
    concept: "purpose",
    sanskrit: "Swadharma",
    description: "One's personal duty and purpose",
    relatedVerses: [
      { chapter: 2, verse: 31 },
      { chapter: 3, verse: 35 },
      { chapter: 18, verse: 47 }
    ]
  },
  {
    concept: "self-knowledge",
    sanskrit: "Atma-Jnana",
    description: "Understanding one's true nature",
    relatedVerses: [
      { chapter: 2, verse: 20 },
      { chapter: 13, verse: 2 },
      { chapter: 13, verse: 12 }
    ]
  },
  {
    concept: "anxiety",
    sanskrit: "Udvega",
    description: "Managing worry and restlessness",
    relatedVerses: [
      { chapter: 6, verse: 27 },
      { chapter: 18, verse: 35 },
      { chapter: 6, verse: 19 }
    ]
  },
  {
    concept: "resilience",
    sanskrit: "Dhairya",
    description: "Mental fortitude during challenges",
    relatedVerses: [
      { chapter: 6, verse: 24 },
      { chapter: 13, verse: 8 },
      { chapter: 18, verse: 43 }
    ]
  },
  {
    concept: "compassion",
    sanskrit: "Karuna",
    description: "Kindness toward all beings",
    relatedVerses: [
      { chapter: 12, verse: 13 },
      { chapter: 16, verse: 2 },
      { chapter: 17, verse: 20 }
    ]
  }
];

// Key verses with full text for mental wellness themes
export const keyWellnessVerses: GitaVerse[] = [
  {
    chapter: 2,
    verse: 14,
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ\nāgamāpāyino 'nityās tāṁs titikṣasva bhārata",
    translation: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, and one must learn to tolerate them without being disturbed.",
    explanation: "This verse teaches about emotional resilience and the impermanence of feelings. Just as seasons change, all emotions and sensations are temporary. By understanding their transient nature, we can develop equanimity and mental strength.",
    tags: ["resilience", "impermanence", "equanimity", "emotional-balance"]
  },
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    explanation: "This central teaching helps overcome anxiety and obsession with outcomes. By focusing on present actions without attachment to results, we reduce suffering from expectations. This mindset promotes mental peace and purposeful living.",
    tags: ["detachment", "purpose", "anxiety", "action", "mindfulness"]
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "One must elevate oneself by one's own mind, not degrade oneself. The mind is the friend of the conditioned soul, and his enemy as well.",
    explanation: "This verse emphasizes the importance of self-compassion and mental health. Our mind can be our greatest ally or worst enemy. Through mindfulness practices and positive thinking, we can train our mind to uplift rather than undermine us.",
    tags: ["self-compassion", "mental-health", "mindfulness", "positive-thinking"]
  },
  {
    chapter: 6,
    verse: 27,
    sanskrit: "प्रशान्तमनसं ह्येनं योगिनं सुखमुत्तमम्।\nउपैति शान्तरजसं ब्रह्मभूतमकल्मषम्॥",
    transliteration: "praśānta-manasaṁ hy enaṁ yoginaṁ sukham uttamam\nupaiti śānta-rajasaṁ brahma-bhūtam akalmaṣam",
    translation: "The yogi whose mind is peaceful, whose passions are calmed, who is free from sin and has become one with the Ultimate, attains the highest bliss.",
    explanation: "This verse describes the benefits of achieving mental tranquility through meditation and mindfulness. By calming the mind's turbulence, one can experience inner peace and harmony. Regular meditation practice helps reduce anxiety and foster emotional stability.",
    tags: ["meditation", "peace", "anxiety", "mindfulness"]
  },
  {
    chapter: 18,
    verse: 37,
    sanskrit: "यत्तदग्रे विषमिव परिणामेऽमृतोपमम्।\nतत्सुखं सात्त्विकं प्रोक्तमात्मबुद्धिप्रसादजम्॥",
    transliteration: "yat tad agre viṣam iva pariṇāme 'mṛtopamam\ntat sukhaṁ sāttvikaṁ proktam ātma-buddhi-prasāda-jam",
    translation: "That happiness which seems like poison at first but is like nectar in the end, which awakens one to self-realization, is said to be happiness in the mode of goodness.",
    explanation: "This verse teaches about the deeper, lasting joy that comes from self-development and growth, even when the process is challenging. It encourages perseverance through difficult practices like therapy, mindfulness, or lifestyle changes that initially feel uncomfortable but lead to profound well-being.",
    tags: ["growth", "resilience", "happiness", "self-development"]
  }
];

// Chapter summaries for reference
export const gitaChapters: GitaChapter[] = [
  {
    chapter: 1,
    name: {
      sanskrit: "अर्जुन विषाद योग",
      english: "Arjuna's Dilemma"
    },
    theme: "Facing anxiety and existential crisis",
    summary: "Arjuna faces a mental health crisis on the battlefield, experiencing anxiety, doubt, and grief when confronted with difficult choices.",
    keyVerses: []
  },
  {
    chapter: 2,
    name: {
      sanskrit: "सांख्य योग",
      english: "Transcendental Knowledge"
    },
    theme: "Understanding the self and managing emotions",
    summary: "Krishna begins counseling Arjuna, teaching about the eternal nature of the self beyond the physical body, and the importance of equanimity in the face of pleasure and pain.",
    keyVerses: []
  },
  {
    chapter: 6,
    name: {
      sanskrit: "ध्यान योग",
      english: "The Yoga of Meditation"
    },
    theme: "Meditation and mindfulness practices",
    summary: "This chapter provides guidance on meditation, concentration, and achieving mental balance through mindfulness practices.",
    keyVerses: []
  },
  {
    chapter: 12,
    name: {
      sanskrit: "भक्ति योग",
      english: "The Path of Devotion"
    },
    theme: "Compassion, service, and connection",
    summary: "Focuses on developing qualities like compassion, friendliness, freedom from ego, forgiveness, and patience - all essential for mental wellbeing.",
    keyVerses: []
  }
];

/**
 * Helper function to find relevant Gita wisdom based on mental health topics
 * @param topics Array of mental health topics to find guidance on
 * @returns Relevant verses and concepts
 */
export const findRelevantGitaWisdom = (topics: string[]) => {
  // Normalize topics for comparison
  const normalizedTopics = topics.map(topic => 
    topic.toLowerCase().replace(/\s+/g, '-')
  );
  
  // Find matching verses
  const relevantVerses = keyWellnessVerses.filter(verse => 
    verse.tags.some(tag => normalizedTopics.includes(tag))
  );
  
  // Find matching concepts
  const relevantConcepts = gitaConcepts.filter(concept =>
    normalizedTopics.includes(concept.concept)
  );
  
  return {
    verses: relevantVerses,
    concepts: relevantConcepts
  };
};

/**
 * Format a Gita verse for display in chat
 * @param verse The verse to format
 * @returns Formatted verse for display
 */
export const formatVerseForDisplay = (verse: GitaVerse) => {
  return {
    sanskrit: verse.sanskrit,
    citation: `Bhagavad Gita Chapter ${verse.chapter}, Verse ${verse.verse}`,
    translation: verse.translation,
    explanation: verse.explanation
  };
};

export default {
  gitaConcepts,
  keyWellnessVerses,
  gitaChapters,
  findRelevantGitaWisdom,
  formatVerseForDisplay
};