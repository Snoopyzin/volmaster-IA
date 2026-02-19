const moodTextArea = document.getElementById("mood-textarea");
const searchButton = document.getElementById("search-button");
const chatHistory = document.getElementById("chat-history");

let conversationHistory = [];

document.addEventListener("DOMContentLoaded", () => {
	setupEventListeners();
});

function setupEventListeners() {
	// Enter para enviar (Shift+Enter para nova linha)
	moodTextArea.addEventListener("keydown", event => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSearch();
		}
	});

	// Auto-resize textarea
	moodTextArea.addEventListener("input", () => {
		moodTextArea.style.height = "auto";
		moodTextArea.style.height = Math.min(moodTextArea.scrollHeight, 120) + "px";
	});

	searchButton.addEventListener("click", handleSearch);
}

function handleSearch() {
	const question = moodTextArea.value.trim();

	if (!question) {
		alert("Por favor, digite sua pergunta!");
		return;
	}

	// Ativar o histórico de chat
	chatHistory.classList.add("active");

	// Adicionar pergunta do usuário ao histórico
	addQuestionToHistory(question);

	// Limpar textarea
	moodTextArea.value = "";
	moodTextArea.style.height = "auto";

	// Buscar resposta na base de conhecimento
	const result = searchKnowledge(question);

	// Adicionar resposta ao histórico
	setTimeout(() => {
		addResponseToHistory(result);
	}, 300);

	// Salvar no histórico interno
	conversationHistory.push({
		question: question,
		answer: result,
		timestamp: new Date()
	});
}

function addQuestionToHistory(question) {
	const questionDiv = document.createElement("div");
	questionDiv.className = "question-bubble";
	questionDiv.textContent = question;
	chatHistory.appendChild(questionDiv);
}

function addResponseToHistory(result) {
	const responseDiv = document.createElement("div");
	responseDiv.className = "response-bubble";

	if (result.found) {
		responseDiv.innerHTML = `
			<div class="response-header">
				<span class="response-icon">📋</span>
				<span class="response-title">Resposta encontrada</span>
			</div>
			<div class="topic-badge">Tópico: ${formatTopic(result.topic)}</div>
			<div class="response-content">
				${formatAnswerHTML(result.answer)}
			</div>
			<div class="contact-prompt">
				💡 <span>Dúvidas? Entre em contato!</span>
			</div>
		`;
	} else {
		responseDiv.innerHTML = `
			<div class="response-header">
				<span class="response-icon" style="color: #ff4444;">⚠️</span>
				<span class="response-title" style="color: #ff4444;">Informação não encontrada</span>
			</div>
			<div class="response-content">
				<p>${result.answer}</p>
				<p style="margin-top: 12px;"><strong>💡 Sugestão:</strong> Tente usar palavras-chave como: vocom, tech tool, login, apci, programação, cartão de tarefa, etc.</p>
			</div>
			<div class="contact-prompt">
				💡 <span>Dúvidas? Entre em contato!</span>
			</div>
		`;
	}

	chatHistory.appendChild(responseDiv);
	scrollToBottom();
}

function formatTopic(topic) {
	return topic
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatAnswerHTML(answer) {
	const lines = answer.split("\n");
	let formatted = "";

	lines.forEach(line => {
		if (line.trim().startsWith("•")) {
			if (!formatted.includes("<ul>")) {
				formatted += "<ul>";
			}
			formatted += `<li>${line.replace("•", "").trim()}</li>`;
		} else if (line.trim()) {
			if (formatted.includes("<ul>") && !formatted.includes("</ul>")) {
				formatted += "</ul>";
			}
			formatted += `<p>${line.trim()}</p>`;
		}
	});

	if (formatted.includes("<ul>") && !formatted.includes("</ul>")) {
		formatted += "</ul>";
	}

	return formatted;
}

function scrollToBottom() {
	chatHistory.scrollTop = chatHistory.scrollHeight;
}
