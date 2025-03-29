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
    displayName: 'Chat Completions',
    name: 'chatCompletions',
    group: ['transform'],
    version: 1,
    description: 'Interage com uma API de chat completions',
    defaults: {
      name: 'Chat Completions',
    },
    inputs: [{ type: NodeConnectionType.Main }],
    outputs: [{ type: NodeConnectionType.Main }],
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Itera sobre os itens de entrada (caso haja múltiplos)
    for (let i = 0; i < items.length; i++) {
      // Obtém os parâmetros do node
      const prompt = this.getNodeParameter('prompt', i) as string;
      const apiKey = this.getNodeParameter('apiKey', i) as string;

      try {
        // Chamada para a API usando axios com o formato correto para ChatGPT
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
          }
        );

        // Armazena a resposta para este item
        returnData.push({ json: response.data });
      } catch (error: unknown) {
        // Tratamento de erros com typing correto
        if (error instanceof Error) {
          throw new Error(`Erro ao chamar a API: ${error.message}`);
        } else {
          throw new Error(`Erro ao chamar a API: ${String(error)}`);
        }
      }
    }

    return this.prepareOutputData(returnData);
  }
}
