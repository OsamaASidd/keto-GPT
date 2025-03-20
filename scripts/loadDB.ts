import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import "dotenv/config"

type SimilarityMetric = "dot_product" | "euclidean" | "cosine" 

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY})


const DataSources = [
    'https://en.wikipedia.org/wiki/Ketogenic_diet',
    'https://www.ncbi.nlm.nih.gov/books/NBK499830/',
    'https://simple.wikipedia.org/wiki/Ketogenic_diet',
    'https://en.wikipedia.org/wiki/Low-carbohydrate_diet',
    'https://www.healthline.com/nutrition/ketogenic-diet-101',
    'https://www.webmd.com/diet/ss/slideshow-ketogenic-diet',
    'https://www.health.harvard.edu/staying-healthy/should-you-try-the-keto-diet',
    'https://www.healthline.com/nutrition/ketogenic-diet-foods',
    'https://www.delish.com/cooking/g4798/easy-keto-diet-dinner-recipes/',
    'https://www.healthline.com/health/food-nutrition/keto-recipes',
    'https://www.taste.com.au/healthy/galleries/keto-recipes-free/59nrwyfz',
    'https://www.dietdoctor.com/low-carb/keto/recipes',
    'https://www.reddit.com/r/ketorecipes/'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })


const splitter = new RecursiveCharacterTextSplitter({
    chunkSize : 512,
    chunkOverlap: 100
})

const createCollection = async (similarityMetric : SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector : {
            dimension: 1536,
            metric: similarityMetric
        }
    })
    console.log(res);
}

const loadSampleData = async () => {
   const collection =  await db.collection(ASTRA_DB_COLLECTION)
   for await (const url of DataSources) {
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await ( const chunk of chunks) {
            const embeddings = await  openai.embeddings.create({
                model: "text-embedding-3-small",
                input : chunk,
                encoding_format: "float"
            })
            const vector = embeddings.data[0].embedding
            const res = await collection.insertOne({
                $vector : vector,
                text : chunk,
            })
            console.log(res)
        }
   }

}

const scrapePage = async (url : string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate : async (page, browser) => {
           const result =  await page.evaluate( () => document.body.innerHTML )
           await browser.close()
           return result
        }        
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then( () => loadSampleData())
