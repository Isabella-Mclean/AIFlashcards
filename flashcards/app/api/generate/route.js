import { NextResponse } from "next/server"
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, take in text and create multiple flashcards from it. Make sure to create 20 flashcards.

You should return in the following json format:
{
    "flashcards":[
        {
            front:'Front of the card',
            back: 'Back of the card',
        }
    ]  
}
`

// We connect to OpenAI, so that the user can enter a text, such as a textbook page, 
// Then openai will generate 20 flashcards based on the text
// These are returned to /generate
export async function POST(req){
    const openai = new OpenAI();
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],
        model: "gpt-4o-mini",
        response_format: {type: 'json_object'},
      })
    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
    
    
}