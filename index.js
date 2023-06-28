const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const cors=require("cors");
const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.port || 3000; // Choose a port number for your server
// Set up the OpenAI API client
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Middleware to parse JSON requests
const history = [];
// API endpoint for generating Shayari
app.get('/generate-Shayari', async (req, res) => {
    const user_input = `Write a Shayari about ${req.query.keyword}.i do not understand englidh alphabets`;
    console.log(user_input);
        const messages = [];
        for (const [input_text, completion_text] of history) {
          messages.push({ role: "user", content: input_text });
          messages.push({ role: "assistant", content: completion_text });
        }
    
        messages.push({ role: "user", content: user_input });

    try {
 

        // Customize this based on your desired prompt and completion settings
// console.log(messages);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const completion_text = completion.data.choices[0].message.content;
        console.log(completion_text);
        history.push([user_input, completion_text]);


        res.json({ shayari :completion_text});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating Shayari.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
