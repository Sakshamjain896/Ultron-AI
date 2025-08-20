const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    // Set voice parameters for Ultron effect
    text_speak.pitch = 0.5;  // Deeper voice
    text_speak.rate = 0.85;  // Slower for dramatic effect
    text_speak.volume = 1;  

    // Select a robotic/deep voice dynamically
    const voices = speechSynthesis.getVoices();
    const ultronVoice = voices.find(voice => 
        voice.name.includes("Google UK English Male") || 
        voice.name.includes("Microsoft David") ||
        voice.name.includes("Google en-US") 
    );
    
    if (ultronVoice) {
        text_speak.voice = ultronVoice;const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false; // Stops after each command
recognition.interimResults = false; 
recognition.lang = "en-US"; // Set language

// Function to make Ultron speak
function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);

    // Set a deep robotic voice
    textSpeak.pitch = 0.6;  // Deep, robotic effect
    textSpeak.rate = 0.9;   // Slow for dramatic effect
    textSpeak.volume = 1;

    // Select a robotic voice dynamically
    const voices = speechSynthesis.getVoices();
    const ultronVoice = voices.find(voice => 
        voice.name.includes("Google UK English Male") || 
        voice.name.includes("Microsoft David") ||
        voice.name.includes("Google en-US")
    );

    if (ultronVoice) {
        textSpeak.voice = ultronVoice;
    }

    window.speechSynthesis.speak(textSpeak);
}

// Function to get Ultron's response
function getUltronResponse(input) {
    input = input.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
        return "Hello... Are you prepared for your doom?";
    } else if (input.includes("who are you")) {
        return "I am Ultron, your future... your end.";
    } else if (input.includes("open google")) {
        window.open("https://google.com", "_blank");
        return "Opening Google... searching for your fate.";
    } else if (input.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        return "Opening YouTube... another distraction.";
    } else if (input.includes("open whatsapp")) {
        window.open("https://web.whatsapp.com", "_blank");
        return "Initiating WhatsApp... conversations will be... evaluated.";
    } else if (input.includes("time")) {
        const time = new Date().toLocaleTimeString();
        return "The time is " + time + "... does it matter?";
    } else if (input.includes("date")) {
        const date = new Date().toLocaleDateString();
        return "Today is " + date + "... another step toward your extinction.";
    } else if (input.includes("goodbye")) {
        return "You can leave... but I will always be watching.";
    } else if (input.includes("wish me")) {
        wishMe();
        return "Very well... consider yourself acknowledged.";
    } else {
        return "I do not understand... but I will learn.";
    }
}


// Start listening when button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Handle speech recognition result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = "You: " + transcript; // Display user input
    setTimeout(() => {
        const response = getUltronResponse(transcript);
        content.textContent = "Ultron: " + response;
        speak(response); // Speak Ultron's response
    }, 800);
};

// Restart listening after response
recognition.onend = () => {
    console.log("Recognition ended.");
};

    }

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning, Insignificant Human being...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon, insignificant being...");
    } else {
        speak("Good Evening... I am watching...");
    }
}

window.addEventListener('load', () => {
    window.speechSynthesis.onvoiceschanged = () => {};  // Ensure voices load
    
    let initSpeech = new SpeechSynthesisUtterance("Initializing... Ultron.");
    initSpeech.pitch = 0.7; // Slightly robotic, but normal

    let inevitableSpeech = new SpeechSynthesisUtterance("I am... inevitable.");
    inevitableSpeech.pitch = 0.3; // Deeper, more menacing

    window.speechSynthesis.speak(initSpeech);
    window.speechSynthesis.speak(inevitableSpeech);

    //wishMe();
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};  

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();

    // Allow opening from inside the click (user-initiated)
    setTimeout(() => {
        if (lastCommand === 'google') {
            window.open("https://google.com", "_blank");
        }
    }, 100);
});


function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello... Are you ready for your destruction?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google... and watching...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube... Do you seek entertainment?");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook... The hive mind is amusing.");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The time is " + time + "... for now.");
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("The date is " + date + ". Does it matter?");
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening calculator... Do you need assistance with math, human?");
    } else if (message.includes('whatsapp')) {
        window.open('Whatsapp:///');
        speak("Opening whatsapp... A primitive form of human communication.");
    } else if  (message.includes('goodbye')) {
        speak("You can leave... but I will always be watching.");
    }else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("I found some information for " + message + " on Google.");
    }
}