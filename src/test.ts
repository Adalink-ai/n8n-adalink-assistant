import { ChatCompletions } from './index';
import { 
  IExecuteFunctions, 
  INodeExecutionData, 
  IDataObject,
  INodeType
} from 'n8n-workflow';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Mock implementation of IExecuteFunctions for testing
 */
class MockExecuteFunctions implements Partial<IExecuteFunctions> {
  private parameters: { [key: string]: { [key: string]: any } } = {};
  private inputData: INodeExecutionData[] = [];

  constructor(parameters: { [key: string]: any } = {}, inputData: INodeExecutionData[] = []) {
    // Initialize with test parameters
    Object.keys(parameters).forEach(key => {
      this.parameters[key] = {};
      this.parameters[key][0] = parameters[key];
    });
    this.inputData = inputData;
  }

  getNodeParameter(parameterName: string, itemIndex: number): any {
    return this.parameters[parameterName]?.[itemIndex];
  }

  getInputData(): INodeExecutionData[] {
    return this.inputData;
  }

  prepareOutputData(outputItems: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
    return Promise.resolve([outputItems]);
  }
}

/**
 * Test function for the Adalink Assistant node
 */
async function testChatCompletionsNode(): Promise<void> {
  try {
    console.log('Testing Adalink Assistant node...');
    
    // Create instance of the node
    const node = new ChatCompletions();
    console.log('Node type:', node.description.name);
    
    // Create test parameters
    const adaToken = process.env.ADA_TOKEN || 'ada-0x';
    const testMessage = 'Explique o conceito de TypeScript em um parágrafo.';
    const assistantId = process.env.ASSISTANT_ID || 'cm';
    const chatId = process.env.CHAT_ID || 'test-chat-id-123';
    const messageRole = 'user';
    
    // Create mock execute functions
    const mockExecuteFunctions = new MockExecuteFunctions(
      {
        message: testMessage,
        adaToken: adaToken,
        assistantId: assistantId,
        chatId: chatId,
        messageRole: messageRole
      },
      [{ json: { example: 'data' } } as INodeExecutionData]
    );
    
    console.log('Executing node with parameters:');
    console.log('- Message:', testMessage);
    console.log('- Ada Token:', adaToken.substring(0, 7) + '...' + adaToken.substring(adaToken.length - 7));
    console.log('- Assistant ID:', assistantId);
    console.log('- Chat ID:', chatId);
    console.log('- Message Role:', messageRole);
    
    // Cast the mock to the expected type and execute
    // Note: this is not a perfect mock but sufficient for basic testing
    const result = await node.execute.call(mockExecuteFunctions as unknown as IExecuteFunctions);
    
    console.log('Execution result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed with error:', error);
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
  }
}

// Run the test if executed directly
if (require.main === module) {
  if (process.env.ADA_TOKEN) {
    console.log('Running node test...');
    testChatCompletionsNode()
      .then(() => console.log('Test execution finished'))
      .catch(error => console.error('Unhandled error during test:', error));
  } else {
    console.log('Please set your ADA_TOKEN environment variable to run this test');
    console.log('For example: ADA_TOKEN=ada-xxx... ts-node src/test.ts');
  }
}

export { testChatCompletionsNode };
