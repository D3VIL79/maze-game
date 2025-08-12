const express = require('express');
const router = express.Router();

// Chatbot responses database
const chatbotResponses = {
  greetings: [
    "Hello! I'm your AI career assistant. How can I help you today?",
    "Hi there! I'm here to help with your career development. What would you like to know?",
    "Welcome! I can assist you with resume analysis, job matching, and skill development."
  ],
  
  resume_help: [
    "To upload your resume:\n1. Go to the 'Resume Upload' page\n2. Click 'Choose File' and select your PDF resume\n3. Click 'Upload & Analyze'\n4. Wait for the analysis to complete\n\nYour resume will be analyzed for skills, experience level, and job matches. The results will be available across all tabs!",
    "Uploading a resume is easy! Just visit the Resume Upload page, select your PDF file, and click analyze. The system will extract your skills and match you with relevant jobs."
  ],
  
  job_matching: [
    "To find matching jobs:\n1. Upload your resume first (if not done already)\n2. Go to the 'Job Matching' page\n3. View personalized job recommendations based on your skills\n4. Use filters to narrow down results\n5. Click 'Apply' to go to the job application page\n\nJobs are ranked by match score - higher scores mean better fits!",
    "Job matching works best when you upload your resume first. The system analyzes your skills and experience to find the most relevant opportunities for you."
  ],
  
  skill_suggestions: [
    "For skill suggestions:\n1. Upload your resume to get personalized recommendations\n2. Go to 'Skill Suggestions' page\n3. View skill gaps and upgrade recommendations\n4. Track your progress for each skill using the progress bars\n5. Add new skills to track manually\n6. Click learning platform links to start learning\n\nFocus on high-priority skills first for maximum impact!",
    "Skill suggestions are personalized based on your resume analysis. You can track your progress and find learning resources for each recommended skill."
  ],
  
  market_insights: [
    "To view market insights:\n1. Go to 'Market Insights' page\n2. View general market trends and salary data\n3. If you've uploaded a resume, see personalized market demand for your skills\n4. Check which skills are in high demand\n5. Use this data to prioritize your skill development\n\nMarket insights help you make informed career decisions!",
    "Market insights show you current industry trends, salary data, and demand for specific skills. This helps you make informed decisions about your career development."
  ],
  
  progress_tracking: [
    "To track skill progress:\n1. Go to 'Skill Suggestions' page\n2. Find the 'Skill Progress Tracking' section\n3. Use + and - buttons to update your progress\n4. Add new skills to track using the input field\n5. Progress is automatically saved and persists across sessions\n6. Completed skills show a green checkmark\n\nTrack your progress to stay motivated and see your growth!",
    "Progress tracking helps you stay motivated and see your skill development over time. You can manually update your progress and add new skills to track."
  ],
  
  general_help: [
    "I can help you with:\n\n📄 **Resume Analysis**: Upload and analyze your resume for skills and experience\n💼 **Job Matching**: Find jobs that match your profile\n🎯 **Skill Suggestions**: Get personalized skill recommendations\n📊 **Market Insights**: View industry trends and demand\n📈 **Progress Tracking**: Monitor your skill development\n\nTry asking about any of these features or use the quick reply buttons below!",
    "I'm your AI career assistant! I can help with resume analysis, job matching, skill suggestions, market insights, and progress tracking. What would you like to know?"
  ]
};

// Get chatbot response
router.post('/message', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage = message.toLowerCase();
    let response = '';
    let responseType = 'general';

    // Determine response type based on user message
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      responseType = 'greetings';
    } else if (userMessage.includes('upload') || userMessage.includes('resume')) {
      responseType = 'resume_help';
    } else if (userMessage.includes('job') || userMessage.includes('match') || userMessage.includes('find')) {
      responseType = 'job_matching';
    } else if (userMessage.includes('skill') || userMessage.includes('suggestion')) {
      responseType = 'skill_suggestions';
    } else if (userMessage.includes('market') || userMessage.includes('trend')) {
      responseType = 'market_insights';
    } else if (userMessage.includes('progress') || userMessage.includes('track')) {
      responseType = 'progress_tracking';
    } else if (userMessage.includes('help')) {
      responseType = 'general_help';
    }

    // Get random response from the appropriate category
    const responses = chatbotResponses[responseType] || chatbotResponses.general_help;
    response = responses[Math.floor(Math.random() * responses.length)];

    // Simulate processing delay
    setTimeout(() => {
      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString()
      });
    }, 500);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      error: 'Internal server error',
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
    });
  }
});

// Get quick reply suggestions
router.get('/quick-replies', (req, res) => {
  try {
    const quickReplies = [
      { text: "How to upload resume?", icon: "FileText" },
      { text: "Find matching jobs", icon: "Briefcase" },
      { text: "Skill suggestions", icon: "Target" },
      { text: "Market trends", icon: "TrendingUp" },
      { text: "Track skill progress", icon: "Target" }
    ];

    res.json({
      success: true,
      quickReplies
    });
  } catch (error) {
    console.error('Quick replies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
