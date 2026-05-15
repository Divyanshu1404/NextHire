export const scoreResumeMatch = async ({ resumeText, jobDescription }) => {
  const resume = String(resumeText || '').toLowerCase();
  const job = String(jobDescription || '').toLowerCase();

  if (!resume || !job) {
    const error = new Error('Resume text and job description are required');
    error.statusCode = 400;
    throw error;
  }

  const keywords = Array.from(new Set(job.split(/[^a-z0-9]+/i).filter(Boolean)));
  const matches = keywords.filter((keyword) => resume.includes(keyword));
  const score = Math.round((matches.length / Math.max(keywords.length, 1)) * 100);

  return {
    score,
    matchedKeywords: matches,
    suggestedAction: score >= 80 ? 'auto_shortlist' : score >= 50 ? 'review_manually' : 'reject',
  };
};
