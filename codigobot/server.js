const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Configurações iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

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
        console.error("Erro ao carregar o prompt:", error);
        return "Você é o assistente virtual da SOMO.";
    }
};

// 1. Webhook para capturar Leads do Typebot
app.post('/webhook/lead', async (req, res) => {
    const { nome, empresa, whatsapp, servico_interesse, principal_problema, urgencia } = req.body;

    console.log("=========================================");
    console.log(" NOVO LEAD RECEBIDO DO TYPEBOT");
    console.log("=========================================");
    console.log(`Nome: ${nome || 'Não informado'}`);
    console.log(`Empresa: ${empresa || 'Não informada'}`);
    console.log(`WhatsApp: ${whatsapp || 'Não informado'}`);
    console.log(`Serviço: ${servico_interesse || 'Não informado'}`);
    console.log(`Problema: ${principal_problema || 'Não informado'}`);
    console.log(`Urgência: ${urgencia || 'Não informada'}`);
    console.log("=========================================");

    // Formatando o número do WhatsApp (Removendo espaços, traços e parênteses)
    let numeroLimpo = whatsapp ? whatsapp.replace(/\D/g, '') : '';
    // Adicionando 55 se não tiver
    if (numeroLimpo && !numeroLimpo.startsWith('55')) {
        numeroLimpo = '55' + numeroLimpo;
    }

    if (numeroLimpo) {
        try {
            const sessionId = process.env.WHATSAPP_SESSION_ID || "SOMO_BOT"; // Pode mudar o nome da sessão no .env
            const apiUrl = `https://crm.somo.tec.br/whatsapp-gateway/api/whatsapp/sessions/${sessionId}/messages/text`;

            const mensagem = `Olá, ${nome || 'pessoal'}! Aqui é o assistente da SOMO. Recebi seus dados sobre o projeto para "${empresa || 'sua empresa'}" e um especialista já vai falar com você!`;

            console.log(`Enviando WhatsApp para ${numeroLimpo}...`);

            const wpRes = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: numeroLimpo,
                    text: mensagem
                })
            });

            if (wpRes.ok) {
                console.log("✅ Mensagem de WhatsApp enviada com sucesso!");
            } else {
                console.error("❌ Falha ao enviar WhatsApp:", await wpRes.text());
            }
        } catch (error) {
            console.error("❌ Erro na integração com WhatsApp:", error);
        }
    } else {
        console.log("⚠️ Nenhum número válido recebido para disparar mensagem.");
    }

    return res.status(200).json({
        success: true,
        message: "Lead recebido com sucesso!"
    });
});

// 2. Webhook para Chat com IA (OpenAI / ChatGPT)
app.post('/webhook/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("OPENAI_API_KEY não configurada no arquivo .env ou no Render");
        return res.status(500).json({
            error: "Configuração ausente.",
            reply: "Desculpe, estou passando por problemas técnicos temporários. Por favor, tente novamente mais tarde."
        });
    }

    try {
        const openai = new OpenAI({ apiKey: apiKey });
        const promptBase = loadPrompt();

        // Montando o histórico de mensagens para a OpenAI
        let messages = [
            { role: "system", content: promptBase }
        ];

        // Se houver histórico anterior vindo do Typebot, adiciona
        if (history && Array.isArray(history)) {
            history.forEach(h => {
                messages.push({
                    role: h.role === 'user' ? 'user' : 'assistant',
                    content: h.text
                });
            });
        }

        // Adiciona a mensagem atual do usuário
        messages.push({ role: "user", content: message });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Você pode mudar para gpt-4o ou gpt-4 se quiser
            messages: messages,
            temperature: 0.7,
        });

        const responseText = completion.choices[0].message.content;

        return res.status(200).json({
            reply: responseText
        });
    } catch (error) {
        console.error("Erro na integração com a OpenAI:", error);
        return res.status(500).json({
            reply: "Houve um erro ao processar sua resposta. Posso encaminhar sua dúvida para um especialista?"
        });
    }
});

// Função para enviar mensagem de volta para o WhatsApp
async function enviarMensagemWhatsApp(to, text) {
    const sessionId = process.env.WHATSAPP_SESSION_ID || "SOMO_BOT_NOVO";
    // O Node e a API do WhatsApp estão no mesmo servidor, então usamos localhost:3000
    const apiUrl = `http://localhost:3000/api/whatsapp/sessions/${sessionId}/messages/text`;
    
    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: to, text: text })
        });
        console.log(`💬 Resposta enviada para ${to}`);
    } catch (error) {
        console.error("❌ Erro ao enviar resposta pro WhatsApp:", error);
    }
}

// 3. Webhook para receber mensagens DIRETAMENTE do WhatsApp
app.post('/webhook/whatsapp', async (req, res) => {
    // Retornamos 200 rápido para a API não dar timeout
    res.status(200).send("OK");

    try {
        const payload = req.body;
        
        // Verifica se é um evento de recebimento de mensagem
        if (payload && payload.event === "message.received" && payload.data) {
            const remetente = payload.data.from; // ex: 5511999999999
            const textoRecebido = payload.data.message;

            // Evitar responder a mensagens vazias ou mensagens do próprio bot
            if (!textoRecebido || !remetente) return;

            console.log(`\n=========================================`);
            console.log(` WHATSAPP - NOVA MENSAGEM RECEBIDA`);
            console.log(` De: ${remetente}`);
            console.log(` Msg: ${textoRecebido}`);
            console.log(`=========================================`);

            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                console.error("Falta API Key da OpenAI!");
                return;
            }

            const openai = new OpenAI({ apiKey: apiKey });
            const promptBase = loadPrompt();

            // Pede para a OpenAI gerar a resposta
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: promptBase },
                    { role: "user", content: textoRecebido }
                ],
                temperature: 0.7,
            });

            const respostaIA = response.choices[0].message.content;
            
            // Dispara a resposta gerada de volta pro cliente no WhatsApp
            await enviarMensagemWhatsApp(remetente, respostaIA);
        }
    } catch (error) {
        console.error("Erro no processamento do WhatsApp:", error);
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`\n🤖 Servidor do Chatbot SOMO rodando na porta ${PORT}`);
    console.log(`🔌 Webhook de Leads: http://localhost:${PORT}/webhook/lead`);
    console.log(`🧠 Webhook de Chat IA (OpenAI): http://localhost:${PORT}/webhook/chat`);
    console.log(`📱 Webhook de WhatsApp: http://localhost:${PORT}/webhook/whatsapp`);
});
