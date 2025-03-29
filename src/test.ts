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
    if (this.parameters[parameterName] && this.parameters[parameterName][itemIndex] !== undefined) {
      return this.parameters[parameterName][itemIndex];
    }
    throw new Error(`Parameter "${parameterName}" for item index ${itemIndex} not found!`);
  }

  getInputData(): INodeExecutionData[] {
    return this.inputData;
  }

  prepareOutputData(outputItems: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
    return Promise.resolve([outputItems]);
  }
}

/**
 * Test function for the ChatCompletions node
 */
async function testChatCompletionsNode(): Promise<void> {
  try {
    console.log('Testing ChatCompletions node...');
    
    // Create instance of the node
    const node = new ChatCompletions();
    console.log('Node type:', node.description.name);
    
    // Create test parameters - replace with your actual API key
    const apiKey = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';
    const testPrompt = 'Explain the concept of TypeScript in one paragraph.';
    
    // Create mock execute functions
    const mockExecuteFunctions = new MockExecuteFunctions(
      {
        prompt: testPrompt,
        apiKey: apiKey
      },
      [{ json: { example: 'data' } } as INodeExecutionData]
    );
    
    console.log('Executing node with parameters:');
    console.log('- Prompt:', testPrompt);
    console.log('- API Key:', apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3));
    
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
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE') {
    console.log('Running node test...');
    testChatCompletionsNode()
      .then(() => console.log('Test execution finished'))
      .catch(error => console.error('Unhandled error during test:', error));
  } else {
    console.log('Please set your OPENAI_API_KEY environment variable to run this test');
    console.log('For example: OPENAI_API_KEY=your_key_here ts-node src/test.ts');
  }
}

export { testChatCompletionsNode };
