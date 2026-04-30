# Instruções para Configuração Manual (Typebot)

Como você pediu, eu criei a parte de código (o servidor Node.js com integração do Gemini e Webhooks). Agora, aqui estão os passos que você precisa fazer manualmente no painel do Typebot para fazer tudo funcionar.

---

## 1. Configurando a Captura de Leads (Webhook)

Quando o lead preencher as informações no Typebot, você vai enviar os dados para o código salvar.

### No Typebot:
1. Vá até o fluxo onde você pergunta o Nome, WhatsApp, Empresa, etc.
2. Logo após a última pergunta, arraste um bloco de **Webhook** (na categoria Integrações).
3. Configure o Webhook assim:
   - **Método:** `POST`
   - **URL:** `http://localhost:3000/webhook/lead` (ou a URL do seu servidor hospedado)
   - **Headers:** `Content-Type: application/json`
   - **Body (JSON):**
     ```json
     {
       "nome": "{{nome}}",
       "empresa": "{{empresa}}",
       "whatsapp": "{{whatsapp}}",
       "servico_interesse": "{{servico}}",
       "principal_problema": "{{problema}}",
       "urgencia": "{{urgencia}}"
     }
     ```
     *(Substitua os `{{campos}}` pelos nomes exatos das variáveis que você criou no Typebot).*

---

## 2. Configurando o Chat de IA Aberto

Para responder dúvidas abertas dos clientes usando a inteligência artificial do Gemini com o tom de voz da SOMO.

### No Typebot:
1. No bloco "Tenho uma dúvida", arraste um bloco de **Input de Texto Livre** para salvar a pergunta do usuário na variável `{{pergunta_usuario}}`.
2. Logo depois, arraste um bloco de **Webhook**.
3. Configure assim:
   - **Método:** `POST`
   - **URL:** `http://localhost:3000/webhook/chat`
   - **Headers:** `Content-Type: application/json`
   - **Body (JSON):**
     ```json
     {
       "message": "{{pergunta_usuario}}"
     }
     ```
4. Em **Response (Resposta)** do webhook no Typebot:
   - Mapeie o retorno do JSON para salvar na variável `{{resposta_ia}}`.
   - O campo JSON retornado pelo servidor é `reply`.
5. Adicione um bloco de **Mensagem** de texto logo abaixo mostrando: `{{resposta_ia}}`.

---

## 3. Como Rodar o Código Localmente

1. Abra o terminal na pasta `codigobot`.
2. Rode o comando para instalar as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo chamado `.env` baseado no `.env.example` e coloque sua chave de API do Gemini:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

*(Nota: Se quiser testar o Typebot Web na internet com o servidor local, você precisará usar uma ferramenta como o **ngrok** para expor a porta 3000 para a internet e colocar a URL do ngrok no Typebot).*
