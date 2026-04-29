# SOMO Chatbot Antigravity

Base pronta para montar o chatbot da SOMO sem n8n, usando os modelos:

1. Menu / botões
3. Chatbot com IA
5. Híbrido bot + humano

Objetivo: criar um MVP gratuito para testar a conversa, primeiro por link no Typebot, depois com possibilidade de integração ao WhatsApp.

## Estrutura

- `prompts/`: prompts prontos para IA
- `fluxos/`: roteiro completo da conversa
- `typebot/`: instruções para montar no Typebot
- `docs/`: contexto da empresa e regras comerciais
- `checklists/`: lista de validação antes de publicar
- `config/`: variáveis e configurações sugeridas

## Caminho recomendado

1. Criar um Typebot novo
2. Copiar o fluxo de `fluxos/fluxo-principal.md`
3. Usar o prompt de `prompts/prompt-ia-somo.md`
4. Testar o chatbot por link
5. Ajustar respostas e perguntas
6. Só depois conectar ao WhatsApp

