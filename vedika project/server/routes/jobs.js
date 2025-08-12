const express = require('express');
const router = express.Router();

// Mock data for Indian job trends (in real app, this would come from external APIs)
const jobTrends = [
  {
    skill: 'React',
    demand: 95,
    growth: 12.5,
    avgSalary: 850000, // In INR
    jobCount: 15420,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Python',
    demand: 92,
    growth: 15.2,
    avgSalary: 900000, // In INR
    jobCount: 18250,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Machine Learning',
    demand: 88,
    growth: 18.7,
    avgSalary: 1100000, // In INR
    jobCount: 8950,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Node.js',
    demand: 85,
    growth: 10.3,
    avgSalary: 820000, // In INR
    jobCount: 12340,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Data Science',
    demand: 90,
    growth: 16.8,
    avgSalary: 950000, // In INR
    jobCount: 11200,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'AWS',
    demand: 87,
    growth: 14.2,
    avgSalary: 1050000, // In INR
    jobCount: 9870,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Java',
    demand: 89,
    growth: 11.5,
    avgSalary: 880000, // In INR
    jobCount: 15600,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Angular',
    demand: 78,
    growth: 8.9,
    avgSalary: 780000, // In INR
    jobCount: 8900,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'DevOps',
    demand: 86,
    growth: 13.7,
    avgSalary: 980000, // In INR
    jobCount: 7600,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  },
  {
    skill: 'Cybersecurity',
    demand: 91,
    growth: 19.2,
    avgSalary: 1200000, // In INR
    jobCount: 5400,
    indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
  }
];

// Mock Indian job listings with valid application URLs
const jobListings = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TCS',
    location: 'Mumbai, Maharashtra',
    salary: '₹12,00,000 - ₹15,00,000',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    description: 'We are looking for an experienced React developer for our Mumbai office. You will be responsible for building scalable web applications and mentoring junior developers.',
    matchScore: 95,
    applicationUrl: 'https://www.tcs.com/careers/india',
    postedDate: '2024-01-15',
    jobType: 'Full-time',
    experience: 'senior',
    isActive: true
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'Infosys',
    location: 'Bangalore, Karnataka',
    salary: '₹10,00,000 - ₹13,00,000',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
    description: 'Join our team in Bangalore to build scalable web applications. Work with cutting-edge technologies and be part of innovative projects.',
    matchScore: 88,
    applicationUrl: 'https://career.infosys.com/jobsearch/',
    postedDate: '2024-01-12',
    jobType: 'Full-time',
    experience: 'mid',
    isActive: true
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    company: 'Wipro',
    location: 'Hyderabad, Telangana',
    salary: '₹13,00,000 - ₹16,00,000',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'AWS'],
    description: 'Develop cutting-edge ML solutions in our Hyderabad office. Work on AI/ML projects that impact millions of users worldwide.',
    matchScore: 75,
    applicationUrl: 'https://careers.wipro.com/careers-home/',
    postedDate: '2024-01-10',
    jobType: 'Full-time',
    experience: 'senior',
    isActive: true
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'HCL',
    location: 'Pune, Maharashtra',
    salary: '₹11,00,000 - ₹14,00,000',
    requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
    description: 'Join our DevOps team in Pune to manage cloud infrastructure. Help us build and maintain robust CI/CD pipelines.',
    matchScore: 82,
    applicationUrl: 'https://www.hcltech.com/careers',
    postedDate: '2024-01-08',
    jobType: 'Full-time',
    experience: 'mid',
    isActive: true
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'Tech Mahindra',
    location: 'Chennai, Tamil Nadu',
    salary: '₹12,00,000 - ₹15,00,000',
    requiredSkills: ['Python', 'Data Science', 'SQL', 'Machine Learning'],
    description: 'Work with big data and analytics in our Chennai office. Transform data into actionable insights for business decisions.',
    matchScore: 90,
    applicationUrl: 'https://careers.techmahindra.com/',
    postedDate: '2024-01-05',
    jobType: 'Full-time',
    experience: 'senior',
    isActive: true
  },
  {
    id: 6,
    title: 'Java Developer',
    company: 'Cognizant',
    location: 'Delhi, NCR',
    salary: '₹9,00,000 - ₹12,00,000',
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
    description: 'Develop enterprise applications in our Delhi office. Work on large-scale projects for Fortune 500 companies.',
    matchScore: 85,
    applicationUrl: 'https://careers.cognizant.com/global/en',
    postedDate: '2024-01-03',
    jobType: 'Full-time',
    experience: 'junior',
    isActive: true
  },
  {
    id: 7,
    title: 'Frontend Developer',
    company: 'Accenture',
    location: 'Gurgaon, Haryana',
    salary: '₹8,00,000 - ₹11,00,000',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    description: 'Create beautiful and responsive user interfaces. Work with modern frontend frameworks and tools.',
    matchScore: 92,
    applicationUrl: 'https://careers.accenture.com/in/en',
    postedDate: '2024-01-14',
    jobType: 'Full-time',
    experience: 'junior',
    isActive: true
  },
  {
    id: 8,
    title: 'Backend Developer',
    company: 'Capgemini',
    location: 'Pune, Maharashtra',
    salary: '₹10,00,000 - ₹13,00,000',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    description: 'Build robust backend services and APIs. Work on microservices architecture and cloud deployment.',
    matchScore: 87,
    applicationUrl: 'https://www.capgemini.com/in-en/careers/',
    postedDate: '2024-01-11',
    jobType: 'Full-time',
    experience: 'mid',
    isActive: true
  },
  {
    id: 9,
    title: 'Python Developer',
    company: 'L&T Infotech',
    location: 'Mumbai, Maharashtra',
    salary: '₹8,50,000 - ₹11,50,000',
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    description: 'Develop scalable web applications using Python. Work on enterprise-level projects with modern frameworks.',
    matchScore: 78,
    applicationUrl: 'https://www.lntinfotech.com/careers/',
    postedDate: '2024-01-09',
    jobType: 'Full-time',
    experience: 'junior',
    isActive: true
  },
  {
    id: 10,
    title: 'Cloud Solutions Architect',
    company: 'Mindtree',
    location: 'Bangalore, Karnataka',
    salary: '₹15,00,000 - ₹20,00,000',
    requiredSkills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    description: 'Design and implement cloud solutions for enterprise clients. Lead cloud migration and optimization projects.',
    matchScore: 70,
    applicationUrl: 'https://www.mindtree.com/careers',
    postedDate: '2024-01-07',
    jobType: 'Full-time',
    experience: 'senior',
    isActive: true
  },
  {
    id: 11,
    title: 'UI/UX Designer',
    company: 'Zensar',
    location: 'Pune, Maharashtra',
    salary: '₹7,00,000 - ₹10,00,000',
    requiredSkills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    description: 'Create intuitive and beautiful user experiences. Work on digital transformation projects for global clients.',
    matchScore: 65,
    applicationUrl: 'https://www.zensar.com/careers',
    postedDate: '2024-01-06',
    jobType: 'Full-time',
    experience: 'junior',
    isActive: true
  },
  {
    id: 12,
    title: 'Cybersecurity Analyst',
    company: 'Mphasis',
    location: 'Bangalore, Karnataka',
    salary: '₹9,00,000 - ₹12,00,000',
    requiredSkills: ['Cybersecurity', 'SIEM', 'Penetration Testing', 'Network Security'],
    description: 'Protect digital assets and infrastructure. Conduct security assessments and implement security measures.',
    matchScore: 80,
    applicationUrl: 'https://careers.mphasis.com/',
    postedDate: '2024-01-04',
    jobType: 'Full-time',
    experience: 'mid',
    isActive: true
  }
];

// Get job market trends
router.get('/trends', (req, res) => {
  try {
    res.json({
      success: true,
      data: jobTrends,
      timestamp: new Date().toISOString(),
      region: 'India'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get job recommendations based on skills
router.get('/match/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    // In real app, fetch user skills from database
    // For now, return mock recommendations
    res.json({
      success: true,
      data: jobListings,
      userId,
      timestamp: new Date().toISOString(),
      region: 'India'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all job listings
router.get('/listings', (req, res) => {
  try {
    res.json({
      success: true,
      data: jobListings,
      timestamp: new Date().toISOString(),
      region: 'India'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
