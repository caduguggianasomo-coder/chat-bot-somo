# Template de fluxo para Typebot

## Bloco: Boas-vindas
Objetivo: Receber e orientar o usuário.
Mensagem: Olá! Sou o assistente virtual da SOMO. Para te ajudar melhor, escolha uma opção:
Tipo: Botões
Opções:
1. Criar site
2. Criar sistema ou automação
3. Melhorar vendas e atendimento
4. Tráfego pago
5. Social media ou conteúdo
6. Tirar uma dúvida
7. Falar com especialista
Próximo passo: Rota conforme opção escolhida

## Bloco: Diagnóstico
Objetivo: Entender a necessidade inicial.
Mensagem: Me conta em poucas palavras: qual é o principal objetivo ou problema que você quer resolver?
Tipo: Texto livre
Próximo passo: IA consultiva

## Bloco: IA consultiva
Objetivo: Responder dúvidas abertas e orientar o lead.
Tipo: IA
Prompt: Usar references/ai-prompt.md
Próximo passo: Qualificação ou nova pergunta

## Bloco: Qualificação
Objetivo: Capturar dados do lead.
Campos:
- Nome
- Empresa
- WhatsApp
- Serviço de interesse
- Principal necessidade
- Urgência
Tipo: Captura
Próximo passo: Encaminhamento humano

## Bloco: Encaminhamento humano
Objetivo: Finalizar o atendimento automático e preparar o contato comercial.
Mensagem: Perfeito. Já tenho as principais informações para encaminhar seu atendimento. Um especialista da SOMO vai falar com você para entender melhor o projeto e indicar o melhor caminho.
Tipo: Encerramento ou handoff
