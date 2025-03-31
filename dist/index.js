"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCompletions = void 0;
const axios_1 = __importDefault(require("axios"));
class ChatCompletions {
    constructor() {
        this.description = {
            displayName: 'Adalink Assistant',
            name: 'adalinkAssistant',
            group: ['transform'],
            version: 1,
            description: 'Envia mensagens para um assistente na plataforma Adalink',
            defaults: {
                name: 'Adalink Assistant',
            },
            inputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            outputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            properties: [
                {
                    displayName: 'Mensagem',
                    name: 'message',
                    type: 'string',
                    default: '',
                    placeholder: 'Digite sua mensagem aqui...',
                    description: 'Mensagem que será enviada para o assistente Adalink.',
                    required: true,
                },
                {
                    displayName: 'Token Adalink',
                    name: 'adaToken',
                    type: 'string',
                    default: '',
                    placeholder: 'ada-XXXXX...',
                    description: 'Token de autenticação para acessar a API da Adalink.',
                    required: true,
                },
                {
                    displayName: 'ID do Assistente',
                    name: 'assistantId',
                    type: 'string',
                    default: 'cm8itx12f01d9f9pii9qt781t',
                    description: 'ID do assistente na plataforma Adalink.',
                    required: true,
                },
                {
                    displayName: 'ID da Conversa',
                    name: 'chatId',
                    type: 'string',
                    default: '',
                    description: 'ID da conversa/thread para continuar uma conversa existente.',
                    required: true,
                },
                {
                    displayName: 'Papel da Mensagem',
                    name: 'messageRole',
                    type: 'options',
                    options: [
                        {
                            name: 'Usuário',
                            value: 'user',
                        },
                        {
                            name: 'Sistema',
                            value: 'system',
                        },
                    ],
                    default: 'user',
                    description: 'Papel da mensagem a ser enviada.',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        // Itera sobre os itens de entrada (caso haja múltiplos)
        for (let i = 0; i < items.length; i++) {
            // Obtém os parâmetros do node
            const message = this.getNodeParameter('message', i);
            const adaToken = this.getNodeParameter('adaToken', i);
            const assistantId = this.getNodeParameter('assistantId', i);
            const chatId = this.getNodeParameter('chatId', i);
            const messageRole = this.getNodeParameter('messageRole', i);
            try {
                // Chamada para a API Adalink
                const response = await axios_1.default.post('https://api.adalink.ai/api/v1/chat', {
                    assistantId,
                    message: {
                        role: messageRole,
                        content: message
                    },
                    chatId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                        'x-ada-token': adaToken,
                    },
                });
                // Armazena a resposta para este item
                returnData.push({ json: response.data });
            }
            catch (error) {
                // Tratamento de erros com typing correto
                if (error instanceof Error) {
                    throw new Error(`Erro ao chamar a API Adalink: ${error.message}`);
                }
                else {
                    throw new Error(`Erro ao chamar a API Adalink: ${String(error)}`);
                }
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.ChatCompletions = ChatCompletions;
