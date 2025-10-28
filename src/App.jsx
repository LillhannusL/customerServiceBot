import './App.css';
import { useRef, useState, useEffect } from 'react';

import { chain } from './Utils/chains.js';

import Message from './Components/Message.jsx';

function App() {
	//InputRef och Message,Loading state
	const inputRef = useRef();
	const [messages, setMessages] = useState([]);

	//sendAnswer Fuktion
	async function sendAnswer(e) {
		e.preventDefault();

		if (e.type === 'click' || e.key === 'enter') {
			//hämta text från input
			const question = inputRef.current.value;
			console.log('fråga: ', question);
			inputRef.current.value = '';

			//lägga användarens fråga i chathistoriken
			setMessages((prevState) => {
				return [...prevState, { role: 'user', content: question }];
			});

			const answer = await chain.invoke({ question });
			console.log(answer);

			setMessages((prevState) => {
				return [...prevState, { role: 'assistant', content: answer }];
			});
		}
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
				<input type="text" ref={inputRef} />
				<button onClick={sendAnswer} onKeyUp={sendAnswer}>
					Fråga
				</button>
			</form>
		</main>
	);
}

export default App;
