import './App.css';

//hämta modell
//PromptTemplates, answerPrompt

function App() {
	//InputRef och Message,Loading state

	//combineDocuments funktion

	//sendAnswer Fuktion
	//hämta text från input
	//lägga användarens fråga i chathistoriken

	//skapa kedja av runnablesequence
	//Gör om frågan till standalonequestion
	//omvandla svaret till text
	//hämta relaterade dokument, kombinera till en sammanhängade text
	//skapa slutsteg
	//skicka frågan + context till modellen
	//få tillbaka svar
	//Kör Kedjan med användarens fråga som input
	//Lägg till modellens svar i chatthistoriken
	//sätt loading till false

	//message component

	return (
		<main className="chat">
			<section className="chat__messages">messages</section>
			<form className="chat__form">
				<input type="text" />
				<button>Fråga</button>
			</form>
		</main>
	);
}

export default App;
