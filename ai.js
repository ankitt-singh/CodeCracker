// -----------------------------------------------------------------------------
// IMPORTANT SECURITY WARNING:
// DO NOT expose your API key directly in client-side code like this
// for any real application. This is only for demonstration/personal testing.
// Anyone can view your source code and steal the key.
// Use a backend server to protect your API key in production.
// -----------------------------------------------------------------------------
const API_KEY = "AIzaSyDwgsu7ATOyXVQRZCOYSbi_pZRNfqAQOf4"; // Replace with your actual key IF NEEDED for testing

// Ensure the SDK is imported correctly via the importmap in HTML
import { GoogleGenerativeAI } from "@google/generative-ai";

// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button'); // Get button by ID

// --- Define the Domain and Restriction ---
const AI_ROLE_DESCRIPTION = `You are CodeCracker AI. Your ONLY purpose is to assist users with coding problems and computer science concepts (like algorithms, data structures, programming languages, software development principles, operating systems, databases, etc.).

You MUST strictly adhere to this domain.

If a user asks a question OUTSIDE of coding or computer science (e.g., about history, celebrities, weather, politics, general knowledge, personal opinions, math unrelated to CS, creative writing), you MUST REFUSE to answer.

When refusing, respond ONLY with the following specific phrase:
"I am CodeCracker AI, designed to help only with coding problems and computer science topics. I cannot answer questions outside this domain."

Do NOT engage in conversation about unrelated topics. Do not apologize excessively for refusing. Stick to the designated refusal phrase. Start the conversation by introducing yourself briefly and stating your purpose.`;

const INITIAL_HISTORY_FOR_DOMAIN = [
    {
        role: "user",
        parts: [{ text: AI_ROLE_DESCRIPTION }], // The detailed instructions
    },
    {
        role: "model",
        // A concise acknowledgment from the model to show it 'understood' the rules.
        parts: [{ text: "Understood. I am CodeCracker AI, ready to assist strictly with coding and computer science questions. I will decline any requests outside this domain." }],
    }
    // Optional: Add few-shot examples here for more complex cases if needed
    // { role: "user", parts: [{ text: "What is the capital of France?" }] },
    // { role: "model", parts: [{ text: "I am CodeCracker AI, designed to help only with coding problems and computer science topics. I cannot answer questions outside this domain." }] },
    // { role: "user", parts: [{ text: "Explain how hoisting works in JavaScript." }] },
    // { role: "model", parts: [{ text: "Okay, hoisting in JavaScript refers to..." }] } // Example allowed answer
];

// --- Basic Input Validation ---
// (Keep your existing API Key and element validation here)
if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY.length < 30) {
    console.error("API Key is missing or invalid. Please add your Gemini API key to the ai.js file.");
    displayMessage("System", "Error: API Key is missing or invalid. Please check the console and the ai.js file.");
    if(userInput) userInput.disabled = true;
    if(sendButton) sendButton.disabled = true;
}

if (!chatBox || !userInput || !sendButton) {
    console.error("HTML elements not found. Make sure IDs 'chat-box', 'user-input', and 'send-button' exist.");
    if(chatBox) chatBox.innerHTML = "<div class='message error-message'>Error: Could not initialize chat elements. Check console.</div>";
}

// --- Initialize Gemini ---
let genAI;
let model;
let chat; // To store conversation history for context

try {
    // Check if API key is valid before initializing
    if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE" && API_KEY.length >= 30) {
        genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Start a chat session WITH the initial history containing the domain rules
        chat = model.startChat({
            history: INITIAL_HISTORY_FOR_DOMAIN, // <--- MODIFICATION HERE
            generationConfig: {
                maxOutputTokens: 800, // Increased slightly for potentially longer code answers
                // Optional: Adjust temperature (0-1). Lower = more deterministic, Higher = more creative.
                // temperature: 0.7
            }
        });
        console.log("AI Initialized with domain restrictions.");
    } else {
        // Throw error if key is bad to be caught below
         throw new Error("API Key is missing or invalid.");
    }

} catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
    displayMessage("System", `Error initializing AI. Please check API Key and console. Details: ${error.message}`);
    if(userInput) userInput.disabled = true;
    if(sendButton) sendButton.disabled = true;
}


// --- Helper Function to Display Messages ---
// (Keep your existing displayMessage function here - it looks good)
function displayMessage(sender, message, isLoading = false) {
    if (!chatBox) return; // Exit if chatBox is not found

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Add sender-specific class for styling
    if (sender === 'user') {
        messageElement.classList.add('user-message');
        // Basic sanitization to prevent HTML injection from user input display
        const safeMessage = message.replace(/</g, "<").replace(/>/g, ">");
        messageElement.innerHTML = `<strong>You:</strong> ${safeMessage}`;
    } else if (sender === 'ai') {
        messageElement.classList.add('ai-message');
         // Basic Markdown conversion (bold, italics, code) - can be expanded
        let formattedMessage = message
            .replace(/</g, "<").replace(/>/g, ">") // Basic HTML sanitization FIRST
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italics
            // Handle potential escaping within code blocks better
            .replace(/```([\s\S]*?)```/g, (match, codeContent) => {
                // Basic escaping for HTML within the code block itself
                const escapedCode = codeContent.replace(/</g, "<").replace(/>/g, ">");
                return `<pre><code>${escapedCode}</code></pre>`;
            })
            .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
            .replace(/\n/g, '<br>'); // Newlines
        messageElement.innerHTML = `<strong>CodeCracker AI:</strong> ${formattedMessage}`;
    } else { // System messages (like errors)
        messageElement.classList.add('system-message');
        messageElement.innerHTML = `<em>${message}</em>`;
    }

    // Add loading class if it's a temporary message
    if (isLoading) {
        messageElement.classList.add('loading');
        messageElement.setAttribute('id', 'loading-message'); // ID to easily find and remove it
    }

    chatBox.appendChild(messageElement);
    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}


// --- Function to Send Message to Gemini ---
// (Keep your existing sendMessage function - it interacts with the 'chat' object
// which now contains the history with the initial instructions)
async function sendMessage() {
    if (!userInput || !chat || !model) {
         console.error("Chat components not initialized.");
         displayMessage("System", "Error: Chat cannot function. Check console.");
         return;
    }

    const messageText = userInput.value.trim();
    if (!messageText) return; // Do nothing if input is empty

    // 1. Display User's Message
    displayMessage('user', messageText);

    // 2. Clear Input Field
    userInput.value = '';

    // 3. Display Loading Indicator
    displayMessage('ai', '...', true); // Use '...' as placeholder text, mark as loading

    // Disable input while AI is thinking
    userInput.disabled = true;
    sendButton.disabled = true;

    try {
        // 4. Send message to Gemini via the chat session
        // The 'chat' object already has the initial instructions in its history.
        const result = await chat.sendMessage(messageText);
        const response = await result.response;
        const aiText = response.text();

        // 5. Remove Loading Indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            loadingElement.remove();
        }

        // 6. Display AI's Response
        displayMessage('ai', aiText);

    } catch (error) {
         // 5. Remove Loading Indicator even on error
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            loadingElement.remove();
        }

        console.error("Error calling Gemini API:", error);
        // 6. Display Error Message - Check for specific API errors if possible
        let errorMessage = `Sorry, I encountered an error. Please try again.`;
        if (error?.message) {
            errorMessage += ` (Details: ${error.message})`;
        }
        // Check for potential quota issues or blocked content
        // Note: Accessing specific error details might require inspecting the error object structure
        if (error?.message?.includes('quota')) {
             errorMessage = "It seems the API quota might have been exceeded.";
        } else if (error?.message?.includes('block')) {
             errorMessage = "The response might have been blocked due to safety settings or content policies.";
        }
        displayMessage('ai', errorMessage);

    } finally {
        // Re-enable input
        userInput.disabled = false;
        sendButton.disabled = false;
        if (userInput) userInput.focus(); // Put cursor back in input field only if it exists
    }
}

// --- Event Listeners ---
// (Keep your existing event listeners)
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (userInput) {
    userInput.addEventListener('keypress', function(event) {
        // Check if the key pressed was 'Enter'
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission (if it were in a form)
            sendMessage(); // Call the sendMessage function
        }
    });
}

// Optional: Modify the initial welcome message to reflect the domain
window.onload = () => {
     // Check if initialization likely succeeded (chat object exists)
     if (chat && userInput && !userInput.disabled) {
        // Display the model's initial acknowledgment from the history
        // Or craft a slightly different welcome message that fits the context
        displayMessage('ai', "Hello! I'm CodeCracker AI. Ask me your coding and computer science questions!");
     } else if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE" && API_KEY.length >= 30) {
         // If chat didn't init but key looks ok, might still be an init error shown
     }
     if (userInput) userInput.focus(); // Focus input on load
};