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
app.post('/webhook/lead', (req, res) => {
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

    // TODO: Aqui você pode salvar no banco de dados, enviar email, ou mandar para o Chatwoot/CRM
    
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

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`\n🤖 Servidor do Chatbot SOMO rodando na porta ${PORT}`);
    console.log(`🔌 Webhook de Leads: http://localhost:${PORT}/webhook/lead`);
    console.log(`🧠 Webhook de Chat IA (OpenAI): http://localhost:${PORT}/webhook/chat`);
});
