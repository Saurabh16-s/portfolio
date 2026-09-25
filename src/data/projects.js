export const projects = [
  {
    title: 'Trippy',
    tag: 'Tour & Travel',
    image: '/projects/trip.png',
    description:
      'Full-stack travel booking platform — React, Spring Boot, PostgreSQL, AWS (EC2/SQS/SES) — with a LangGraph + Groq LLaMA 3.3 70B agentic AI microservice on FastAPI, Dockerized behind Nginx with DuckDNS/HTTPS. Primary proof point for internship applications.',
    stack: ['React', 'Spring Boot', 'PostgreSQL', 'AWS', 'LangGraph', 'FastAPI', 'Docker'],
    github: 'https://github.com/Saurabh16-s/Tour-and-Travel-Web-Application',
  },
  {
    title: 'PayFlow',
    tag: 'Payment Gateway',
    image: '/projects/payflow.png',
    description:
      'Spring Boot + React payment orchestration system with idempotency keys, a double-entry ledger, and Bucket4j rate limiting. Built for Stripe-style internship applications.',
    stack: ['Java', 'Spring Boot', 'React', 'Bucket4j'],
    github: 'https://github.com/Saurabh16-s/Payment-Gateway',
  },
  {
    title: 'Industry AI Adoption Research Agent',
    tag: 'AI / Agents',
    image: '/projects/research.png',
    description:
      'A 3-node LangGraph-style pipeline (Tavily search → Gemini summarize → Gemini report) on a FastAPI backend, generating industry case-study reports.',
    stack: ['LangGraph', 'Gemini', 'Tavily', 'FastAPI'],
    github: 'https://github.com/Saurabh16-s/Industry-AI-Adoption-Research-Agent',
  },
  {
    title: 'File Uploader',
    tag: 'Backend Utility',
    image: '/projects/file.png',
    description:
      'S3-based image uploader (Java, MIT licensed) — also reused as the "One Piece Wanted Poster" uploader variant.',
    stack: ['Java', 'AWS S3'],
    github: 'https://github.com/Saurabh16-s/File-Uploader',
  },
  {
    title: 'Lecture Notes & Quiz Generator',
    tag: 'AI / Agents',
    image: '/projects/lecture.png',
    description:
      'LLM agent that generates CSE lecture notes and quizzes — built for the COER AI Champion cohort screening.',
    stack: ['LLM', 'Python'],
    github: 'https://github.com/Saurabh16-s/Lecture-Notes-Quiz-Generator',
  },
    {
    title: 'Premier League Stats',
    tag: 'Backend',
    image: '/projects/league.png',
    description: 'Backend-only project for tracking and serving Premier League statistics.',
    stack: ['Backend'],
    github: 'https://github.com/Saurabh16-s/Premiar-League-Stats',
  },
  {
    title: 'Wexa CognoDB',
    tag: 'Take-Home',
    description: 'Graph-database take-home assignment (Java) built for the Wexa AI hiring process.',
    stack: ['Java', 'Graph DB'],
    github: 'https://github.com/Saurabh16-s/Wexa-cognodb',
  },
  
  {
    title: 'Pagination API',
    tag: 'Backend Utility',
    description:
      'Cursor-based pagination API (Node.js + PostgreSQL) over 200k seeded rows, deployed on Render/Neon/Vercel — built as the CodeVector Labs take-home.',
    stack: ['Node.js', 'PostgreSQL', 'Render', 'Neon'],
    github: 'https://github.com/Saurabh16-s/pagination',
  },
  {
    title: 'EyeShooter',
    tag: 'Browser Game',
    description:
      'Browser-based webcam penalty shootout game using MediaPipe for eye/gesture tracking.',
    stack: ['JavaScript', 'MediaPipe'],
    github: 'https://github.com/Saurabh16-s/eyeshooter',
    demo: 'https://github.com/Saurabh16-s/eyeshooterwc',
  },

]