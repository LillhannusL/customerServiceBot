import './Message.css';

//hämta props; content, role
function Message({ content, role }) {
	//skapa är egetMeddelande, sätt de till role och kolla om det är "user"
	const isOwnMessage = role === 'user';

	return (
		<article className={`message ${isOwnMessage ? 'user' : 'bot'}`}>
			<section className="message__bubble">
				<span className="role">{role}</span>
				<p>{content}</p>
			</section>
		</article>
	);
}

export default Message;
