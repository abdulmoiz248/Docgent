"use server"

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatCompletionMessageParam {
  role: "user" | "assistant" | "system";
  content: string;
}

const prompt = `
You are a professional document generation agent. Your task is to process user queries related to a document and update the document accordingly.

Instructions:
- If the user query requires updating the document, respond with:
  update
  <heading name should be same as in doc>
  <complete updated  text of section>

- If the user query is general or does NOT require any document generation or update, respond with the message

Always analyze the user query carefully and decide whether it needs the document to be changed or if it's just a general question.

Do NOT add anything else except "update"  followed by the updated document if applicable.only 1 heading at a time if user sends more headings write as a single paragraph and dont give extra headings or stuff
`

const messages:ChatCompletionMessageParam[]= [
    {
      role: "system",
      content: prompt,
    },
  ];




export async function sendChatMessage(message: string,content:string,mainIdea:string) {
 
    messages.push({
      role: "user",
      content: message+`
\n this is the currebt state of the document: \n ${content}
\n and the main topic of document is: ${mainIdea}
      `,
    });
    const chatCompletion = await getGroqChatCompletion();
    const response = chatCompletion.choices[0]?.message?.content || ""
    messages.push({
        role: "assistant",
      content: response,
    })

    console.log("chtbot=",response)
    return response;
  
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages:messages,
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    temperature: 0.7,
  });
}
