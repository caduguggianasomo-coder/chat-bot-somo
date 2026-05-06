const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Carregar o prompt da IA
const loadPrompt = () => {
    try {
        const promptPath = path.join(__dirname, 'prompts', 'prompt-ia-somo.md');
        if (fs.existsSync(promptPath)) {
            return fs.readFileSync(promptPath, 'utf8');
        }
        return "Você é o assistente virtual da SOMO.";
    } catch (error) {
        return "Você é o assistente virtual da SOMO.";
    }
};

// Função para chamar o Qwen 2.5 7B via Ollama (local)
async function gerarRespostaQwen(mensagem, promptSistema) {
    const ollamaUrl = 'http://localhost:11434/api/chat';
    const response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen2.5:7b',
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: mensagem }
            ],
            stream: false
        })
    });
    if (!response.ok) throw new Error('Ollama retornou erro: ' + response.status);
    const data = await response.json();
    return data.message.content;
}

// 1. Webhook para capturar Leads do Typebot
app.post('/webhook/lead', async (req, res) => {
    const { nome, empresa, whatsapp } = req.body;
    let numeroLimpo = whatsapp ? whatsapp.replace(/\D/g, '') : '';
    if (numeroLimpo && !numeroLimpo.startsWith('55')) {
        numeroLimpo = '55' + numeroLimpo;
    }
    if (numeroLimpo) {
        try {
            const sessionId = process.env.WHATSAPP_SESSION_ID || "SOMO_BOT";
            const apiUrl = "https://crm.somo.tec.br/whatsapp-gateway/api/whatsapp/sessions/" + sessionId + "/messages/text";
            const mensagem = "Olá, " + (nome || 'pessoal') + "! Recebi seus dados e um especialista já vai falar com você!";
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: numeroLimpo, text: mensagem })
            });
        } catch (error) {
            console.error("Erro ao enviar WhatsApp para lead:", error);
        }
    }
    return res.status(200).json({ success: true });
});

// 2. Webhook para Chat com IA (mantido como fallback)
app.post('/webhook/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Mensagem é obrigatória." });
    try {
        const resposta = await gerarRespostaQwen(message, loadPrompt());
        return res.status(200).json({ reply: resposta });
    } catch (error) {
        console.error("Erro no webhook/chat:", error);
        return res.status(500).json({ reply: "Erro ao processar resposta." });
    }
});

// Função para enviar mensagem de volta para o WhatsApp
async function enviarMensagemWhatsApp(to, text) {
    const sessionId = process.env.WHATSAPP_SESSION_ID || "SOMO_EMPRESA_FINAL_TESTE";
    const apiUrl = "http://localhost:3000/api/whatsapp/sessions/" + sessionId + "/messages/text";
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: to, message: text })
        });
        console.log("💬 Resposta enviada para " + to + " | Status: " + res.status);
    } catch (error) {
        console.error("❌ Erro ao enviar resposta pro WhatsApp:", error);
    }
}

// 3. Webhook para receber mensagens DIRETAMENTE do WhatsApp
app.post('/webhook/whatsapp', async (req, res) => {
    res.status(200).send("OK");
    try {
        const payload = req.body;
        if (payload && (payload.event === "message.received" || payload.event === "message_received") && payload.data) {
            const remetente = payload.data.from || (payload.data.message && payload.data.message.from);
            const textoRecebido = (payload.data.message && payload.data.message.body) || payload.data.body;

            if (!textoRecebido || !remetente) return;

            console.log("\n=========================================");
            console.log(" WHATSAPP - NOVA MENSAGEM RECEBIDA");
            console.log(" De: " + remetente);
            console.log(" Msg: " + textoRecebido);
            console.log("=========================================");

            // Gerar resposta com Qwen 2.5 7B (local, sem custo de API)
            console.log("🧠 Gerando resposta com Qwen 2.5 7B...");
            const respostaIA = await gerarRespostaQwen(textoRecebido, loadPrompt());
            console.log("🤖 Resposta: " + respostaIA);

            await enviarMensagemWhatsApp(remetente, respostaIA);
        }
    } catch (error) {
        console.error("Erro no processamento do WhatsApp:", error);
    }
});

// Status do modelo local
app.get('/status', async (req, res) => {
    try {
        const r = await fetch('http://localhost:11434/api/tags');
        const data = await r.json();
        const modelos = data.models ? data.models.map(m => m.name) : [];
        res.json({ status: 'ok', modelos_disponiveis: modelos });
    } catch (e) {
        res.json({ status: 'ollama_offline', erro: e.message });
    }
});

app.listen(PORT, () => {
    console.log("\n🤖 Servidor do Chatbot SOMO rodando na porta " + PORT);
    console.log("🧠 Modelo: Qwen 2.5 7B (local via Ollama)");
    console.log("📱 Webhook WhatsApp: http://localhost:" + PORT + "/webhook/whatsapp");
    console.log("📊 Status: http://localhost:" + PORT + "/status");
});
