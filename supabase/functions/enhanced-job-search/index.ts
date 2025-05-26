
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitles, locations, yearsExperience } = await req.json();
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    // Build enhanced search query
    const jobTitlesText = jobTitles?.length ? jobTitles.join(' or ') : 'any position';
    const locationsText = locations?.length ? locations.join(' or ') : 'any location';
    const experienceText = yearsExperience > 0 ? ` for candidates with ${yearsExperience} years of experience` : '';

    const searchQuery = `Find 8 current job openings for ${jobTitlesText} positions in ${locationsText}${experienceText}. 

Please provide specific job listings with:
1. Company name
2. Job title
3. Location
4. Salary range (if available)
5. Brief job description
6. Direct application link or company careers page URL

Focus on recent postings from major job boards like Indeed, LinkedIn Jobs, Glassdoor, AngelList, and company career pages. Include the direct URL where candidates can apply for each position.`;

    console.log('Enhanced job search query:', searchQuery);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a job search specialist. Provide specific, real job listings with company names, job titles, locations, salary ranges when available, brief descriptions, and most importantly - direct application URLs. Format your response as a JSON array with objects containing: title, company, location, salary, description, apply_url, and source fields. The apply_url should be a direct link to apply for the job.'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 3000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Enhanced AI Response:', aiResponse);

    // Try to extract JSON from the response, with enhanced fallback parsing
    let jobs = [];
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobs = JSON.parse(jsonMatch[0]);
      } else {
        // Enhanced fallback: parse text response into structured data with apply links
        const sections = aiResponse.split(/\d+\.\s+/).filter(section => section.trim());
        jobs = sections.slice(0, 8).map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim());
          
          // Extract job details from text
          let title = `Job Opportunity ${index + 1}`;
          let company = 'Various Companies';
          let location = 'Multiple Locations';
          let salary = 'Competitive';
          let description = '';
          let apply_url = '';
          
          lines.forEach(line => {
            const lower = line.toLowerCase().trim();
            if (lower.includes('company:') || lower.includes('employer:')) {
              company = line.split(':')[1]?.trim() || company;
            } else if (lower.includes('title:') || lower.includes('position:') || lower.includes('job:')) {
              title = line.split(':')[1]?.trim() || title;
            } else if (lower.includes('location:')) {
              location = line.split(':')[1]?.trim() || location;
            } else if (lower.includes('salary:') || lower.includes('pay:')) {
              salary = line.split(':')[1]?.trim() || salary;
            } else if (lower.includes('apply:') || lower.includes('url:') || lower.includes('link:') || line.includes('http')) {
              const urlMatch = line.match(/https?:\/\/[^\s]+/);
              if (urlMatch) {
                apply_url = urlMatch[0];
              }
            } else if (lower.includes('description:')) {
              description = line.split(':')[1]?.trim() || '';
            } else if (!lower.includes(':') && line.length > 20) {
              description = description ? `${description} ${line}` : line;
            }
          });

          // If no apply URL found, generate a search URL
          if (!apply_url) {
            const searchQuery = encodeURIComponent(`${title} ${company} job application`);
            apply_url = `https://www.google.com/search?q=${searchQuery}`;
          }

          return {
            title: title.length > 5 ? title : `Job Opportunity ${index + 1}`,
            company,
            location,
            salary,
            description: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
            apply_url,
            source: 'Enhanced AI Search Results'
          };
        });
      }
    } catch (parseError) {
      console.error('Error parsing enhanced AI response:', parseError);
      // Create enhanced fallback response
      jobs = [{
        title: 'Job Search Results Available',
        company: 'Multiple Companies',
        location: 'Various Locations',
        salary: 'Competitive',
        description: aiResponse.substring(0, 500) + '...',
        apply_url: 'https://www.linkedin.com/jobs/',
        source: 'Enhanced AI Search Results'
      }];
    }

    // Ensure all jobs have required fields and limit to 8 results
    const enhancedJobs = jobs.slice(0, 8).map((job, index) => ({
      title: job.title || `Job Opportunity ${index + 1}`,
      company: job.company || 'Company Name',
      location: job.location || 'Location',
      salary: job.salary || 'Competitive',
      description: job.description || 'Job description available upon application.',
      apply_url: job.apply_url || `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company + ' job')}`,
      source: job.source || 'Enhanced AI Search'
    }));

    return new Response(JSON.stringify({ jobs: enhancedJobs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-job-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      jobs: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
