import { RunnableLambda } from '@langchain/core/runnables';

export const classifyQuestion = new RunnableLambda({
	func: async (data) => {
		const question = data.originalQuestion.question;
		let category = 'allmänt';

		if (
			question.includes('kostar') ||
			question.includes('pris') ||
			question.includes('orderbekräftelse')
		) {
			category = 'beställningar';
		} else if (
			question.includes('leverans') ||
			question.includes('levererar') ||
			question.includes('beställning') ||
			question.includes('frakt') ||
			question.includes('spåra') ||
			question.includes('spårning')
		) {
			category = 'leverans';
		} else if (
			question.includes('garanti') ||
			question.includes('produkt') ||
			question.includes('reservdel')
		) {
			category = 'produkter';
		} else if (
			question.includes('retur') ||
			question.includes('returnera') ||
			question.includes('återbetalning')
		) {
			category = 'retur & återbetalning';
		} else if (
			question.includes('trasig') ||
			question.includes('reklamation') ||
			question.includes('reklamerar') ||
			question.includes('kontakta')
		) {
			category = 'support';
		}

		return { ...data, category };
	},
});
