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
            displayName: 'Chat Completions',
            name: 'chatCompletions',
            group: ['transform'],
            version: 1,
            description: 'Interage com uma API de chat completions',
            defaults: {
                name: 'Chat Completions',
            },
            inputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            outputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            properties: [
                {
                    displayName: 'Prompt',
                    name: 'prompt',
                    type: 'string',
                    default: '',
                    placeholder: 'Digite seu prompt aqui...',
                    description: 'O prompt que será enviado para a API.',
                },
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    placeholder: 'Sua chave de API',
                    description: 'Chave de autenticação para acessar a API.',
                },
                // Adicione outros parâmetros conforme necessário
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        // Itera sobre os itens de entrada (caso haja múltiplos)
        for (let i = 0; i < items.length; i++) {
            // Obtém os parâmetros do node
            const prompt = this.getNodeParameter('prompt', i);
            const apiKey = this.getNodeParameter('apiKey', i);
            try {
                // Chamada para a API usando axios
                const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                    prompt, // ou outro formato exigido pela API
                    // inclua outros parâmetros exigidos pela API
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                });
                // Armazena a resposta para este item
                returnData.push({ json: response.data });
            }
            catch (error) {
                // Tratamento de erros com typing correto
                if (error instanceof Error) {
                    throw new Error(`Erro ao chamar a API: ${error.message}`);
                }
                else {
                    throw new Error(`Erro ao chamar a API: ${String(error)}`);
                }
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.ChatCompletions = ChatCompletions;
