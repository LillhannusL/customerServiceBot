import { BufferMemory } from 'langchain/memory';

export const memory = new BufferMemory({
	memoryKey: 'chatHistory',
	inputKey: 'question',
	returnMessages: true,
});

export const addUserMessage = async (text) => {
	memory.chatHistory.addUserMessage(text);
};

export const addAiMessage = async (text) => {
	memory.chatHistory.addAIChatMessage(text);
};

export const getChatHistory = async () => {
	const history = await memory.chatHistory.getMessages();
	return history.map((message) => {
		return {
			role: message.getType() === 'human' ? 'user' : 'KundtjänstBot',
			content: message.content,
		};
	});
};
