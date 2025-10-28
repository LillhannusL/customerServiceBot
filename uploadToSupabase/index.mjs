import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OllamaEmbeddings } from '@langchain/ollama';
import 'dotenv/config';

//hämta url o api-key från miljövariabler
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
	//läser in textfilen
	const text = await readFile(
		`${process.cwd()}/technova-faq-policydokument.txt`,
		'utf-8'
	);
	//Skapar en textsplitter som delar texten i chunks
	const text_splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 350,
		seperators: ['\n\n', '\n', ' ', ''],
		chunkOverlap: 50,
	});
	//delar upp texten i dokument/chunks
	const splittedText = await text_splitter.createDocuments([text]);
	//Skapar en supabaseClient med url och api-nyckel
	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);
	//Skapar embedding för varje chunk med ollama och lagrar dem i supabase
	await SupabaseVectorStore.fromDocuments(
		splittedText,
		new OllamaEmbeddings({ model: 'llama3.1:8b' }),
		{ client: supabaseClient, tableName: 'documents' }
	);

	console.log(splittedText);
} catch (error) {
	console.log(error);
}
