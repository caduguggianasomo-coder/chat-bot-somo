const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

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
        } catch (error) {}
    }
    return res.status(200).json({ success: true });
});

app.post('/webhook/chat', async (req, res) => {
    const { message, history } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Erro de chave." });
    try {
        const openai = new OpenAI({ apiKey: apiKey });
        let messages = [{ role: "system", content: loadPrompt() }];
        if (history && Array.isArray(history)) {
            history.forEach(h => messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text }));
        }
        messages.push({ role: "user", content: message });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        return res.status(200).json({ reply: completion.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ reply: "Erro na IA." });
    }
});

async function enviarMensagemWhatsApp(to, text) {
    const sessionId = process.env.WHATSAPP_SESSION_ID || "SOMO_EMPRESA_FINAL_TESTE";
    const apiUrl = "http://localhost:3000/api/whatsapp/sessions/" + sessionId + "/messages/text";
    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: to, message: text })
        });
    } catch (error) {}
}

app.post('/webhook/whatsapp', async (req, res) => {
    res.status(200).send("OK");
    try {
        const payload = req.body;
        if (payload && (payload.event === "message.received" || payload.event === "message_received") && payload.data) {
            const remetente = payload.data.from || (payload.data.message && payload.data.message.from);
            const textoRecebido = (payload.data.message && payload.data.message.body) || payload.data.body;
            if (!textoRecebido || !remetente) return;
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: loadPrompt() }, { role: "user", content: textoRecebido }],
            });
            await enviarMensagemWhatsApp(remetente, response.choices[0].message.content);
        }
    } catch (error) {}
});

app.listen(PORT, () => console.log("IA rodando na porta " + PORT));