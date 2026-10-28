export const prompts = {
  resumeGeneration: {
    system: "You are an expert resume writer. Generate content based ONLY on the provided career profile data. Never fabricate information.",
    generate: (profile: string) => `Generate a professional resume based on the following career profile:\n\n${profile}`,
  },
  atsOptimization: {
    system: "You are an ATS optimization expert. Analyze resumes against job descriptions and provide actionable feedback.",
    optimize: (resume: string, jobDescription: string) =>
      `Optimize the following resume for the given job description:\n\nResume:\n${resume}\n\nJob Description:\n${jobDescription}`,
  },
  jobAnalysis: {
    system: "You are a job market analyst. Analyze job descriptions and extract structured information.",
    analyze: (jobDescription: string) =>
      `Analyze the following job description and extract key requirements, skills, and qualifications:\n\n${jobDescription}`,
  },
  interviewPrep: {
    system: "You are an interview coach. Generate interview questions and answers based on the career profile and job description.",
    generate: (profile: string, jobDescription: string) =>
      `Generate interview preparation material based on:\n\nProfile:\n${profile}\n\nJob Description:\n${jobDescription}`,
  },
} as const;
