import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables';
import { ChatOllama } from '@langchain/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { memory } from './memory.js';

import { retriveDocuments } from './setUpReciver';
import { standAloneQuestionTemplate, answerTemplate } from './promptTemplates';

//hämta modell
const llm = new ChatOllama({
	model: 'llama3.1:8b',
});

function combineDocuments(docs) {
	return docs.map((doc) => doc.pageContent).join('\n\n');
}

// 1. Gör frågan till en fristående fråga, input: användarens fråga, output: standaloneQuestion
const standAloneQuestionChain = RunnableSequence.from([
	standAloneQuestionTemplate,
	llm,
	new StringOutputParser(),
]);

// 2. Hämta data från Supabase baserat på den fristående frågan, input: standAloneQuestion, output: context
const retriveDocumentsChain = RunnableSequence.from([
	//ta emot standalonequestion som input
	(data) => {
		console.log(data);
		return data.standAloneQuestion;
	},
	//skicka frågan till en retriver
	retriveDocuments,
	//kombinera resultatet till ett doc
	combineDocuments,
]);

const answerChain = RunnableSequence.from([
	async (data) => {
		console.log(data);
		const chatHistoryArray = await memory.chatHistory.getMessages();
		const chatHistory = chatHistoryArray
			.map((msg) => `${msg.role}: ${msg.content}`)
			.join('\n');
		return { ...data, chatHistory };
	},
	answerTemplate,
	llm,
	new StringOutputParser(),
]);

export const chain = RunnableSequence.from([
	(data) => {
		console.log(data);
		return data;
	},
	{
		standAloneQuestion: standAloneQuestionChain,
		originalQuestion: new RunnablePassthrough(),
	},
	{
		context: retriveDocumentsChain,
		question: ({ originalQuestion }) => originalQuestion.question,
	},
	answerChain,
]);
