import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { userId, prompt, tag } = await request.json();
    console.log('this is called');
    try {
        await connectToDB();
        const newPrompt = new Prompt({ creator: userId, prompt, tag });
        console.log('newPrompt', newPrompt);
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}