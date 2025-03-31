import { IExecuteFunctions } from 'n8n-workflow';
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class ChatCompletions implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Adalink Assistant',
    name: 'adalinkAssistant',
    group: ['transform'],
    version: 1,
    description: 'Envia mensagens para um assistente na plataforma Adalink',
    defaults: {
      name: 'Adalink Assistant',
    },
    inputs: [{ type: NodeConnectionType.Main }],
    outputs: [{ type: NodeConnectionType.Main }],
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Itera sobre os itens de entrada (caso haja múltiplos)
    for (let i = 0; i < items.length; i++) {
      // Obtém os parâmetros do node
      const message = this.getNodeParameter('message', i) as string;
      const adaToken = this.getNodeParameter('adaToken', i) as string;
      const assistantId = this.getNodeParameter('assistantId', i) as string;
      const chatId = this.getNodeParameter('chatId', i) as string;
      const messageRole = this.getNodeParameter('messageRole', i) as string;

      try {
        // Chamada para a API Adalink
        const response = await axios.post(
          'https://api.adalink.ai/api/v1/chat',
          {
            assistantId,
            message: {
              role: messageRole,
              content: message
            },
            chatId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
              'x-ada-token': adaToken,
            },
          }
        );

        // Armazena a resposta para este item
        returnData.push({ json: response.data });
      } catch (error: unknown) {
        // Tratamento de erros com typing correto
        if (error instanceof Error) {
          throw new Error(`Erro ao chamar a API Adalink: ${error.message}`);
        } else {
          throw new Error(`Erro ao chamar a API Adalink: ${String(error)}`);
        }
      }
    }

    return this.prepareOutputData(returnData);
  }
}
