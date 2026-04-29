---
name: somo-chatbot-builder
description: criar, revisar ou orientar a construção do chatbot da somo sem n8n, especialmente para prototipar grátis usando menu/botões, chatbot com ia e modelo híbrido bot + humano. usar quando o usuário pedir ajuda para montar fluxo, prompt, arquitetura, integração, documentação, backlog, código ou checklist para um chatbot comercial da somo em typebot, gemini/groq, whatsapp, chatwoot, evolution api, railway ou alternativas gratuitas.
---

# Somo Chatbot Builder

## Objetivo

Auxiliar na criação do chatbot comercial da SOMO com foco em teste gratuito, sem n8n, usando três modelos combinados: menu/botões, IA conversacional e atendimento híbrido bot + humano.

Use esta Skill para transformar pedidos vagos sobre o chatbot em entregáveis práticos: arquitetura, fluxo, prompts, mensagens, checklist, backlog técnico, instruções para Typebot, instruções para Gemini/Groq, plano de integração com WhatsApp e passagem para atendimento humano.

## Decisão principal

Priorize sempre a implementação em fases:

1. **Protótipo grátis por link**: Typebot + bloco de IA com Gemini ou Groq, sem WhatsApp no início.
2. **Validação de conversa**: testar fluxo, perguntas, tom e qualificação de leads.
3. **Integração com WhatsApp**: apenas depois que o fluxo estiver aprovado.
4. **Handoff humano**: enviar dados coletados para equipe comercial ou ferramenta de inbox.

Não sugerir n8n como caminho principal. Se o usuário perguntar sobre n8n, explicar que o projeto foi pensado para rodar sem n8n e oferecer alternativas simples.

## Contexto da empresa

A SOMO é uma empresa de tecnologia, design e soluções digitais. O chatbot deve representar uma marca moderna, objetiva, consultiva e comercial. Os serviços principais são:

- Criação de sites
- Sistemas personalizados
- Automação de processos
- CRM
- Tráfego pago
- Social media
- Produção de vídeos
- Identidade visual
- Produtos digitais como Alkio, Marquei e Manda

Consulte `references/company-context.md` quando precisar de tom, posicionamento, serviços e identidade da marca.

## Modelo de chatbot recomendado

Sempre que estiver criando o chatbot principal da SOMO, use o modelo híbrido:

- **Menu/botões** para organizar o começo da conversa.
- **IA** para responder dúvidas abertas e explicar serviços.
- **Handoff humano** para oportunidades reais, briefing, orçamento e fechamento.

O objetivo não é substituir o time comercial. O objetivo é filtrar, qualificar e preparar o atendimento.

## Fluxo base obrigatório

Começar com uma saudação curta e oferecer opções claras:

1. Criar site
2. Criar sistema ou automação
3. Melhorar vendas e atendimento
4. Tráfego pago
5. Social media ou conteúdo
6. Tirar uma dúvida
7. Falar com especialista

Depois da escolha, fazer de uma a três perguntas de diagnóstico antes de sugerir uma solução.

## Dados de qualificação

Quando o lead demonstrar interesse real, coletar:

- Nome
- Empresa
- WhatsApp ou melhor contato
- Serviço de interesse
- Principal problema ou objetivo
- Prazo ou urgência
- Orçamento aproximado, apenas se a conversa permitir

Após coletar, encerrar com uma mensagem de encaminhamento para especialista.

## Regras de resposta do bot

O bot deve:

- Ser claro, direto e consultivo.
- Falar como assistente da SOMO, não como atendente genérico.
- Fazer perguntas antes de vender.
- Não inventar preços, prazos, cases, garantias ou informações técnicas.
- Evitar respostas longas demais no WhatsApp.
- Encaminhar para humano quando houver pedido de orçamento, proposta, reunião, contrato, suporte específico ou caso sensível.

O bot não deve:

- Prometer resultado garantido em tráfego, vendas ou marketing.
- Fechar escopo técnico complexo sem humano.
- Simular que é uma pessoa real.
- Usar linguagem infantil, robótica ou excessivamente informal.

## Entregáveis que esta Skill deve produzir

Quando o usuário pedir para “montar o projeto”, entregue preferencialmente nesta ordem:

1. Resumo da solução recomendada.
2. Arquitetura sem n8n.
3. Fluxo conversacional em etapas.
4. Prompt base da IA.
5. Mensagens prontas para Typebot.
6. Campos de captura de lead.
7. Regras de handoff humano.
8. Checklist de teste.
9. Próximos passos técnicos.

## Arquitetura recomendada sem n8n

### Fase 1, teste gratuito

- Typebot para fluxo visual.
- Gemini API ou Groq para IA.
- Teste via link público do Typebot.
- Registro manual ou Google Sheets, se disponível.

### Fase 2, WhatsApp

- Evolution API para conexão com WhatsApp, se o usuário aceitar self-hosted.
- Railway para hospedagem leve, respeitando limites gratuitos/créditos.
- Chatwoot para caixa de entrada e transferência humano, se necessário.

### Alternativa simples

Se o usuário quiser evitar infraestrutura no começo, manter o bot apenas no link de teste e usar formulário interno para leads.

## Prompt base da IA

Use ou adapte o prompt em `references/ai-prompt.md` sempre que o usuário pedir o prompt do chatbot.

## Formato para fluxos

Quando gerar fluxo de Typebot, usar este formato:

```text
Bloco: Nome do bloco
Objetivo: O que este bloco resolve
Mensagem: Texto exato que o usuário verá
Tipo: Botões, texto livre, IA, condição, captura ou encaminhamento
Próximo passo: Nome do próximo bloco
```

## Checklist de qualidade

Antes de finalizar qualquer plano ou fluxo, verificar:

- O começo usa menu/botões.
- Existe uma rota para dúvida aberta com IA.
- Existe uma rota para falar com especialista.
- O bot coleta dados antes do handoff.
- A IA tem limites claros para não inventar preço ou promessa.
- O fluxo pode ser testado sem WhatsApp.
- A solução não depende de n8n.

## Uso com Antigravity

Quando o usuário mencionar Antigravity, Cursor, VS Code, Windsurf ou outro agente de código, escrever instruções como tarefas executáveis para um agente de desenvolvimento:

- Criar arquivos e pastas sugeridos.
- Criar documentação do fluxo.
- Criar exemplos de prompts.
- Criar schemas JSON para blocos do chatbot quando útil.
- Criar README com setup gratuito.
- Separar fases MVP e produção.

Sempre entregar comandos, estrutura de pastas ou arquivos markdown quando isso ajudar o agente a implementar.
