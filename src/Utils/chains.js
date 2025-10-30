import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables';
import { ChatOllama } from '@langchain/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { memory } from './memory.js';
import { classifyQuestion } from './classifyQuestion.js';
import { retrieveDocuments } from './setUpReciver';
import { standaloneQuestionTemplate, answerTemplate } from './promptTemplates';

//hämta modell
const llm = new ChatOllama({
	model: 'llama3.1:8b',
});

function combineDocuments(docs) {
	return docs.map((doc) => doc.pageContent).join('\n\n');
}

// Gör frågan till en fristående fråga, input: användarens fråga, output: standaloneQuestion
const standAloneQuestionChain = RunnableSequence.from([
	(data) => {
		console.log('SAQ data: ', data);
		return data;
	},
	standaloneQuestionTemplate,
	llm,
	new StringOutputParser(),
]);

//Hämta data från Supabase baserat på den fristående frågan, input: standAloneQuestion, output: context
const retrieveDocumentsChain = RunnableSequence.from([
	(data) => {
		console.log(data);
		return data.standAloneQuestion;
	},
	retrieveDocuments,
	combineDocuments,
]);

//generar svar med chathistory och category
const answerChain = RunnableSequence.from([
	async (data) => {
		console.log('input till answerChain: ', data);
		//hämtar chatHistory
		const chatHistoryArray = await memory.chatHistory.getMessages();
		const chatHistory = chatHistoryArray
			.map((msg) => `${msg.role}: ${msg.content}`)
			.join('\n');
		return { ...data, chatHistory };
	},
	{
		question: ({ question }) => question,
		context: ({ context }) => context,
		category: ({ category }) => category,
		chatHistory: ({ chatHistory }) => chatHistory,
	},
	answerTemplate,
	llm,
	new StringOutputParser(),
]);

export const chain = RunnableSequence.from([
	(data) => {
		console.log('input chain data: ', data);
		return data;
	},
	{
		standAloneQuestion: standAloneQuestionChain,
		originalQuestion: new RunnablePassthrough(),
	},
	classifyQuestion,
	(data) => {
		console.log('efter classifyQuestion: ', data);
		return data;
	},
	{
		context: retrieveDocumentsChain,
		question: ({ originalQuestion }) => originalQuestion.question,
	},
	answerChain,
]);
