export interface Env {
	AI: Ai;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === "GET") {
			const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f0f4f8;
        }
        .chat-container {
            width: 100%;
            max-width: 480px;
            height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            overflow: hidden;
        }
        #chat-box {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-right: 10px;
        }
        .message {
            max-width: 75%;
            padding: 10px;
            border-radius: 15px;
            display: inline-block;
            line-height: 1.5;
            font-size: 16px;
            word-wrap: break-word;
            box-sizing: border-box;
            width: fit-content;
        }
        .user {
            background-color: #007bff;
            color: white;
            align-self: flex-end;
            border-top-left-radius: 0;
        }
        .assistant {
            background-color: #e4e6eb;
            color: #333;
            align-self: flex-start;
            border-top-right-radius: 0;
        }
        .assistant code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: Consolas, Monaco, "Courier New", Courier, monospace;
        }
        .assistant pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: Consolas, Monaco, "Courier New", Courier, monospace;
        }
        .assistant a {
            color: #007bff;
            text-decoration: none;
        }
        .assistant a:hover {
            text-decoration: underline;
        }
        .input-container {
            display: flex;
            margin-top: 10px;
            align-items: center;
        }
        textarea {
            width: 100%;
            padding: 10px 15px;
            font-size: 16px;
            border-radius: 30px;
            border: 1px solid #ccc;
            outline: none;
            resize: none;
            transition: all 0.3s ease;
        }
        textarea:focus {
            border-color: #007bff;
        }
        button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 30px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #0056b3;
        }
        @media (max-width: 600px) {
            .chat-container {
                width: 95%;
                height: 90vh;
            }
        }
		.typing-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.typing-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #ccc;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <div class="chat-container">
        <div id="chat-box"></div>
        <div class="input-container">
            <textarea id="user-input" placeholder="Ask something..."></textarea>
            <button id="send-button">Send</button>
        </div>
    </div>
    <script>
        function autoResizeTextarea() {
            const textarea = document.getElementById('user-input');
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        async function sendMessage() {
            const userMessage = document.getElementById("user-input").value.trim();
            if (!userMessage) return;

            displayMessage("user", userMessage);

            const typingIndicator = showTypingIndicator();

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ messages: userMessage }),
                });

                const data = await response.json();
                const assistantMessage = data?.response || "Sorry, I couldn't understand that.";

                typingIndicator.remove();
                typeMessage("assistant", assistantMessage);
            } catch (error) {
                typingIndicator.remove();
                displayMessage("assistant", "Oops! Something went wrong.");
            }

            const inputField = document.getElementById("user-input");
            inputField.value = '';
            autoResizeTextarea();
        }

        function displayMessage(role, message) {
            const chatBox = document.getElementById("chat-box");
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", role);
            messageElement.innerHTML = marked.parse(message);
            chatBox.appendChild(messageElement);
            scrollToBottom();
        }

        function typeMessage(role, message) {
            const chatBox = document.getElementById("chat-box");
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", role);
            chatBox.appendChild(messageElement);

            let i = 0;
            const parsedMessage = marked.parse(message);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parsedMessage;
            const finalText = tempDiv.textContent || tempDiv.innerText;

            messageElement.innerHTML = '';

            function typeNextCharacter() {
                if (i < finalText.length) {
                    messageElement.textContent += finalText.charAt(i);
                    i++;
                    scrollToBottom();
                    setTimeout(typeNextCharacter, 50);
                } else {
                    messageElement.innerHTML = parsedMessage;
                    scrollToBottom();
                }
            }

            typeNextCharacter();
        }

        function showTypingIndicator() {
    		const chatBox = document.getElementById("chat-box");
    		const typingElement = document.createElement("div");
    		typingElement.classList.add("message", "assistant");
    		typingElement.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    		chatBox.appendChild(typingElement);
    		chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
    		return typingElement;
  		}

        function scrollToBottom() {
            const chatBox = document.getElementById("chat-box");
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        document.getElementById("send-button").onclick = sendMessage;
        document.getElementById("user-input").addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.ctrlKey) {
                event.preventDefault();
                sendMessage();
            } else if (event.key === 'Enter' && event.ctrlKey) {
                event.preventDefault();
                this.value += '\\n';
                autoResizeTextarea();
            }
        });

        document.getElementById("user-input").addEventListener('input', autoResizeTextarea);
    </script>
</body>
</html>`;
			return new Response(html, { headers: { "Content-Type": "text/html" } });
		}

		if (request.method === "POST") {
			const body = await request.json();
			const messages = [
				{ role: "system", content: "You are a friendly assistant, using markdown formatting." },
				{ role: "user", content: body.messages },
			];

			try {
				const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages });
				return new Response(JSON.stringify(response), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: "Failed to process the request." }), {
					status: 500,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		return new Response("Method Not Allowed", { status: 405 });
	},
} satisfies ExportedHandler<Env>;
