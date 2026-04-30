# Como montar no Typebot

## 1. Criar o bot

Acesse o Typebot e crie um novo fluxo.

Nome sugerido:

SOMO Assistente Comercial

## 2. Criar bloco de boas-vindas

Mensagem:

Olá! Sou o assistente virtual da SOMO. Para te ajudar melhor, escolha uma opção:

Botões:

- Quero criar um site
- Quero automatizar meu atendimento
- Quero um sistema para minha empresa
- Quero melhorar vendas e marketing
- Tenho uma dúvida
- Quero falar com um especialista

## 3. Criar um grupo para cada opção

Cada botão deve direcionar para um grupo específico:

- Grupo Site
- Grupo Automação
- Grupo Sistema
- Grupo Marketing
- Grupo Dúvida com IA
- Grupo Atendimento Humano

## 4. Bloco de IA

No grupo "Tenho uma dúvida", adicionar integração com IA usando Gemini ou outro modelo disponível.

Usar o arquivo:

`prompts/prompt-ia-somo.md`

## 5. Captura de dados

Criar campos para:

- nome
- empresa
- whatsapp
- servico_interesse
- principal_problema
- urgencia

## 6. Teste inicial

Testar por link antes de conectar ao WhatsApp.

Verificar se:

- O menu inicial está claro
- A IA não inventa preço
- O bot coleta os dados certos
- O encaminhamento humano funciona
