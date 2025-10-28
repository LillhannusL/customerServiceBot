import { createClient } from '@supabase/supabase-js';
import { OllamaEmbeddings } from '@langchain/ollama';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

//hämta miljövariabler
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

//skapa embedding, ollama modell
const embedding = new OllamaEmbeddings({ model: 'llama3.1:8b' });
//skapa supabaseClient
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

//skapa vectorstore skicka med embedding och object med innehåll client, tabelname och queryname
const vectorstore = new SupabaseVectorStore(embedding, {
	client: supabaseClient,
	tableName: 'documents',
	queryName: 'match_documents',
});

//hämta document
const retriveDocuments = vectorstore.asRetriever();

export { retriveDocuments };
