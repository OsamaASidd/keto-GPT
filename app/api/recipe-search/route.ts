import OpenAI from "openai";
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { dishName } = await req.json();
    
    if (!dishName) {
      return new NextResponse(
        JSON.stringify({ error: 'Dish name is required' }),
        { status: 400 }
      );
    }

    console.log(`Searching for recipe: ${dishName}`);

    // Use OpenAI to get recipe information
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable culinary assistant specializing in recipes and nutrition. 
          Provide a detailed recipe when asked about a dish. Format the response as a JSON object with the following properties:
          - name: The full name of the dish
          - description: A brief description of the dish, its origin, and characteristics (1-2 sentences)
          - ingredients: An array of individual ingredients, with each ingredient as a simple string in lowercase (e.g., "ground beef", "salt", "olive oil")
          
          Be specific and accurate. Include all key ingredients. Do not include measurements or instructions.
          Make sure the ingredients list is simple and focuses on main ingredients that would impact nutrition.
          Limit to 5-15 ingredients total, focusing on the most important ones for nutritional analysis.`
        },
        {
          role: "user",
          content: `Provide a recipe for ${dishName} formatted as JSON.`
        }
      ],
    });

    const jsonContent = response.choices[0].message.content;
    console.log("API Response:", jsonContent);
    
    const recipeData = JSON.parse(jsonContent);
    
    return NextResponse.json(recipeData);
  } catch (error) {
    console.error('Error in recipe search:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to get recipe information',
        details: error.message 
      }),
      { status: 500 }
    );
  }
}