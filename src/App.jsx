import './App.css';
import { useRef, useState, useEffect } from 'react';
import { chain } from './Utils/chains.js';
import {
	memory,
	addUserMessage,
	addAiMessage,
	getChatHistory,
} from './Utils/memory.js';
import Message from './Components/Message.jsx';

function App() {
	//InputRef och Message,Loading state
	const inputRef = useRef();
	const [messages, setMessages] = useState([]);

	//sendAnswer Fuktion
	async function sendAnswer(e) {
		e.preventDefault();

		//hämta text från input
		const question = inputRef.current.value;
		console.log('fråga: ', question);
		if (!question) return;

		//lägga användarens fråga i chathistoriken
		setMessages((prevState) => {
			return [...prevState, { role: 'user', content: question }];
		});
		await addUserMessage(question);
		inputRef.current.value = '';

		const answer = await chain.invoke({ question, memory });
		console.log(answer);

		setMessages((prevState) => {
			return [...prevState, { role: 'KundtjänstBot', content: answer }];
		});
		await addAiMessage(answer);

		const updatedMessages = await getChatHistory();
		setMessages(updatedMessages);
		console.log('memory: ', memory);
	}

	//message component
	const messageComponent = messages.map((message, index) => {
		return (
			<Message content={message.content} role={message.role} key={index} />
		);
	});

	return (
		<main className="chat">
			<section className="chat__messages">{messageComponent}</section>
			<form className="chat__form">
				<input
					type="text"
					ref={inputRef}
					placeholder="Skriv din fråga här..."
				/>
				<button onClick={sendAnswer} onKeyUp={sendAnswer}>
					Fråga
				</button>
			</form>
		</main>
	);
}

export default App;
