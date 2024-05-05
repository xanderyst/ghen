import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const user = await User.findById(params.id);
        console.log('user', user);
        if (!user) return new Response("User Not Found", { status: 404 });

        return new Response(JSON.stringify(user.today), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { guessHistory, charactersArray, characterIndex } = await request.json();
    console.log('guessHistory', guessHistory);
    console.log('charactersArray', charactersArray);
    console.log('characterIndex', characterIndex);
    try {
        await connectToDB();

        // Find the existing prompt by ID
        // const existingUser = await User.findById(params.id);

        // if (!existingUser) {
        //     return new Response("User not found", { status: 404 });
        // }

        // if (!existingUser.progress) {
        //     existingUser.progress = {};
        // }
        
        const updatedUser = await User.findByIdAndUpdate(params.id, 
            { 
                today: {
                    guessHistory,
                    charactersArray,
                    characterIndex
                }
            },
            { strict:false, new: true });

        // Update the prompt with new data
        // existingUser.progress.charactersToReview = charactersToReview;
        // existingUser.progress.charactersLearned = charactersLearned;
        // existingUser.progress.characterStartIndex = characterStartIndex;
        // console.log('existingUser', existingUser);
        // await existingUser.save();
        console.log('today updatedUser', updatedUser);
        return new Response(JSON.stringify(updatedUser.today), { status: 200 });
    } catch (error) {
        console.log('error', error);
        return new Response("Error Updating Progress", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();
        console.log('params.id', params.id);
        // Find the prompt by ID and remove it
        console.log('before api call');
        const findPost = await Prompt.findByIdAndDelete(params.id);
        console.log('after api call');
        console.log('findPost', findPost);
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};