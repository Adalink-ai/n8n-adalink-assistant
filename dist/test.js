"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testChatCompletionsNode = testChatCompletionsNode;
const index_1 = require("./index");
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente do arquivo .env
dotenv_1.default.config();
/**
 * Mock implementation of IExecuteFunctions for testing
 */
class MockExecuteFunctions {
    constructor(parameters = {}, inputData = []) {
        this.parameters = {};
        this.inputData = [];
        // Initialize with test parameters
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = {};
            this.parameters[key][0] = parameters[key];
        });
        this.inputData = inputData;
    }
    getNodeParameter(parameterName, itemIndex) {
        if (this.parameters[parameterName] && this.parameters[parameterName][itemIndex] !== undefined) {
            return this.parameters[parameterName][itemIndex];
        }
        throw new Error(`Parameter "${parameterName}" for item index ${itemIndex} not found!`);
    }
    getInputData() {
        return this.inputData;
    }
    prepareOutputData(outputItems) {
        return Promise.resolve([outputItems]);
    }
}
/**
 * Test function for the ChatCompletions node
 */
async function testChatCompletionsNode() {
    try {
        console.log('Testing ChatCompletions node...');
        // Create instance of the node
        const node = new index_1.ChatCompletions();
        console.log('Node type:', node.description.name);
        // Create test parameters - replace with your actual API key
        const apiKey = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';
        const testPrompt = 'Explain the concept of TypeScript in one paragraph.';
        // Create mock execute functions
        const mockExecuteFunctions = new MockExecuteFunctions({
            prompt: testPrompt,
            apiKey: apiKey
        }, [{ json: { example: 'data' } }]);
        console.log('Executing node with parameters:');
        console.log('- Prompt:', testPrompt);
        console.log('- API Key:', apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3));
        // Cast the mock to the expected type and execute
        // Note: this is not a perfect mock but sufficient for basic testing
        const result = await node.execute.call(mockExecuteFunctions);
        console.log('Execution result:');
        console.log(JSON.stringify(result, null, 2));
        console.log('Test completed successfully');
    }
    catch (error) {
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
    }
    else {
        console.log('Please set your OPENAI_API_KEY environment variable to run this test');
        console.log('For example: OPENAI_API_KEY=your_key_here ts-node src/test.ts');
    }
}
