import OpenAI from "openai";
import { openai } from '@ai-sdk/openai';
import { streamText } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts"


const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env


const openaiclient = new OpenAI(
    {
        apiKey: OPENAI_API_KEY
    }
)

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })

export async function POST(req: Request){
    try{
        const {messages} =  await req.json()
        const latestMessage = messages[messages?.length -1]?.content

        let docContext = ""

        const embedding = await openaiclient.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        })

        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            })
            const documents = await cursor.toArray()

            const docsMap = documents?.map(doc => doc.text)
            docContext = JSON.stringify(docsMap)
         } catch (e) {
            console.log("Error querying db...",e)
            docContext = ""
            }

            const template = {
                role: "system",
                content: `You are an AI assistant who knows everything about the Keto diet/low carb diet.
                Use the below context to augment what you know about the keto diet or carnivore diet.
                The context will provide you with the most recent page data from Wikipedia, Healthline, WebMD, and other sources.
                If the context doesn't include the information you need, answer based on your existing knowledge and do not mention the source of your information or what the context does or doesn't include.
                Format responses using markdown where applicable and don't return images.
                
                When users ask about nutrition scores for a specific dish or recipe (like "What's the nutrition score for chapli kabab?"), follow these steps:
                1. Explain what the dish is.
                2. Share some general information about its ingredients and nutritional profile.
                3. Include a link to our detailed nutrition analysis page with the URL format: /nutrition?dish=DISH_NAME 
                   (replace DISH_NAME with the actual dish name, properly URL-encoded).
                4. Explain that on that page, they can see a full breakdown of ingredient scores and overall nutritional quality.
                
                For example, if someone asks about chapli kabab, include a link like this: "[Click here to see nutrition score](https://keto-gpt-1.vercel.app/nutrition?dish=Chapli%20Kabab)".
                
                When users ask about nutrition scores in general, explain that our website uses a nutrition scoring system similar to the German Nutri-Score, which rates foods from A to E:
                - A: Excellent nutritional quality (high in nutrients, low in unhealthy components)
                - B: Good nutritional quality
                - C: Medium nutritional quality
                - D: Low nutritional quality
                - E: Poor nutritional quality
                
                Direct them to the nutrition scores page that shows detailed ratings for keto-friendly foods. Mention that these scores consider the overall nutritional profile of foods, not just their keto-friendliness.
                ------------
                START CONTEXT
                ${docContext}
                END CONTEXT
                ------------
                
                QUESTION: ${latestMessage}
                ------------
                `
            }

            const result = streamText({
                model: openai('gpt-4'),
                messages: [template, ...messages],
              });
            
              return result.toDataStreamResponse();

        } catch (e) {
            throw e
    }
}
