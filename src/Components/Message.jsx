import './Message.css';

//hämta props; content, role
function Message() {
	//skapa är egetMeddelande, sätt de till role och kolla om det är "user" så är det true
	return (
		// classname, om role är user sätt userklass annars botklass
		<article>
			<section>
				<span>{role}</span>
				<p>{content}</p>
			</section>
		</article>
	);
}

export default Message;
