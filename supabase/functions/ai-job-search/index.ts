
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

    // Build search query based on user preferences
    const jobTitlesText = jobTitles?.length ? jobTitles.join(' or ') : 'any position';
    const locationsText = locations?.length ? locations.join(' or ') : 'any location';
    const experienceText = yearsExperience > 0 ? ` for candidates with ${yearsExperience} years of experience` : '';

    const searchQuery = `Find 10 current job openings for ${jobTitlesText} positions in ${locationsText}${experienceText}. Please provide specific job listings with company names, job titles, locations, and brief descriptions. Focus on recent postings from job boards and company websites.`;

    console.log('Searching for jobs with query:', searchQuery);

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
            content: 'You are a job search assistant. Provide specific, real job listings with company names, job titles, locations, salary ranges when available, and brief descriptions. Format your response as a JSON array with objects containing: title, company, location, salary, description, and source fields.'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
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

    console.log('AI Response:', aiResponse);

    // Try to extract JSON from the response, fallback to parsing text
    let jobs = [];
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobs = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse text response into structured data
        const lines = aiResponse.split('\n').filter(line => line.trim());
        jobs = lines.slice(0, 10).map((line, index) => ({
          title: `Job Opportunity ${index + 1}`,
          company: 'Various Companies',
          location: 'Multiple Locations',
          salary: 'Competitive',
          description: line.trim(),
          source: 'AI Search Results'
        }));
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Create fallback response
      jobs = [{
        title: 'Job Search Results',
        company: 'Multiple Companies',
        location: 'Various Locations',
        salary: 'Competitive',
        description: aiResponse.substring(0, 500) + '...',
        source: 'AI Search Results'
      }];
    }

    return new Response(JSON.stringify({ jobs: jobs.slice(0, 10) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-job-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      jobs: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
