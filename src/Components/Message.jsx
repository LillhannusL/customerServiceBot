import './Message.css';

function Message({ content, role }) {
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
