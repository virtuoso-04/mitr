/**
 * Cultural integration utilities for MindSpace app
 * Provides context-aware content based on Indian culture and festivals
 */

// Sanskrit elements for Arjuna persona
export const sanskritElements = {
  greetings: [
    { original: 'Namaste', translation: 'I bow to you', context: 'Formal greeting' },
    { original: 'Sat Sri Akal', translation: 'God is Truth', context: 'Sikh greeting' },
    { original: 'Hari Om', translation: 'Invocation of divine consciousness', context: 'Spiritual greeting' },
  ],
  wisdomPhrases: [
    { 
      original: 'योग: कर्मसु कौशलम्', 
      romanized: 'Yogah Karmasu Kaushalam', 
      translation: 'Yoga is excellence in action',
      source: 'Bhagavad Gita 2:50'
    },
    { 
      original: 'विद्या ददाति विनयं', 
      romanized: 'Vidya Dadati Vinayam', 
      translation: 'Knowledge gives humility',
      source: 'Sanskrit proverb'
    },
    { 
      original: 'अहिंसा परमो धर्म:', 
      romanized: 'Ahimsa Paramo Dharmah', 
      translation: 'Non-violence is the highest virtue',
      source: 'Mahabharat'
    },
  ],
  therapeuticConcepts: [
    { 
      concept: 'Dhyana', 
      translation: 'Meditation', 
      description: 'Focused attention practice from ancient yoga traditions'
    },
    { 
      concept: 'Pratyahara', 
      translation: 'Withdrawal of senses', 
      description: 'Directing attention inward away from external stimuli'
    },
    { 
      concept: 'Swadhyaya', 
      translation: 'Self-study', 
      description: 'The practice of self-reflection and introspection'
    },
  ]
};

// Indian festivals calendar (2025-2026)
export const festivals = [
  { 
    name: 'Diwali', 
    date: new Date(2025, 10, 12), // November 12, 2025
    description: 'Festival of lights celebrating the victory of light over darkness',
    greetings: ['Happy Diwali!', 'Diwali ki Shubhkamnayein!'],
    themes: ['light', 'new beginnings', 'prosperity', 'family']
  },
  { 
    name: 'Holi', 
    date: new Date(2026, 2, 6), // March 6, 2026
    description: 'Festival of colors celebrating the arrival of spring',
    greetings: ['Happy Holi!', 'Holi ki Shubhkamnayein!'],
    themes: ['joy', 'forgiveness', 'renewal', 'community']
  },
  { 
    name: 'Raksha Bandhan', 
    date: new Date(2025, 7, 9), // August 9, 2025
    description: 'Celebration of the bond between brothers and sisters',
    greetings: ['Happy Raksha Bandhan!'],
    themes: ['sibling bonds', 'protection', 'family relationships']
  },
];

// Family contexts in Indian culture
export const familyContexts = {
  roles: [
    {
      role: 'Joint Family System',
      description: 'Multi-generational households with shared responsibilities and decision-making',
      challenges: ['Privacy concerns', 'Individual vs. collective needs', 'Generational differences'],
      strengths: ['Strong support system', 'Shared resources', 'Cultural continuity']
    },
    {
      role: 'Filial Responsibility',
      description: 'Expectation to care for parents in old age',
      challenges: ['Career vs. caregiving balance', 'Geographic separation', 'Modern vs. traditional values'],
      strengths: ['Intergenerational wisdom exchange', 'Emotional security', 'Mutual support']
    },
    {
      role: 'Academic Pressure',
      description: 'High expectations for academic achievement and career success',
      challenges: ['Performance anxiety', 'Self-worth tied to achievements', 'Limited exploration'],
      strengths: ['Discipline development', 'Work ethic', 'Educational focus']
    }
  ],
  conversationPrompts: [
    "How does your family's expectations influence your choices?",
    "What family traditions bring you comfort during difficult times?",
    "How do you balance personal ambitions with family responsibilities?",
    "In what ways do you feel supported by your family structure?",
    "What generational wisdom has helped your mental wellbeing?"
  ]
};

// Get current or upcoming festival
export const getCurrentFestival = () => {
  const now = new Date();
  
  // Find the next upcoming festival
  const upcomingFestivals = festivals
    .filter(festival => festival.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (upcomingFestivals.length > 0) {
    const nextFestival = upcomingFestivals[0];
    const daysDifference = Math.ceil((nextFestival.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...nextFestival,
      daysUntil: daysDifference,
      isUpcoming: true
    };
  }
  
  // If no upcoming festivals, return the most recent past one
  const pastFestivals = festivals
    .filter(festival => festival.date < now)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  if (pastFestivals.length > 0) {
    return {
      ...pastFestivals[0],
      daysSince: Math.ceil((now.getTime() - pastFestivals[0].date.getTime()) / (1000 * 60 * 60 * 24)),
      isUpcoming: false
    };
  }
  
  return null;
};

// Get random Sanskrit wisdom phrase
export const getRandomWisdom = () => {
  const randomIndex = Math.floor(Math.random() * sanskritElements.wisdomPhrases.length);
  return sanskritElements.wisdomPhrases[randomIndex];
};

// Get appropriate greeting based on time of day
export const getTimeSensitiveGreeting = (name?: string) => {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) {
    greeting = 'Suprabhat! Good morning';
  } else if (hour < 17) {
    greeting = 'Namaste! Good afternoon';
  } else {
    greeting = 'Shubh sandhya! Good evening';
  }
  
  return name ? `${greeting}, ${name}` : greeting;
};