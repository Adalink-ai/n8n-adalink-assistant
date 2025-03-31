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
        var _a;
        return (_a = this.parameters[parameterName]) === null || _a === void 0 ? void 0 : _a[itemIndex];
    }
    getInputData() {
        return this.inputData;
    }
    prepareOutputData(outputItems) {
        return Promise.resolve([outputItems]);
    }
}
/**
 * Test function for the Adalink Assistant node
 */
async function testChatCompletionsNode() {
    try {
        console.log('Testing Adalink Assistant node...');
        // Create instance of the node
        const node = new index_1.ChatCompletions();
        console.log('Node type:', node.description.name);
        // Create test parameters
        const adaToken = process.env.ADA_TOKEN || 'ada-BV81L8T87jWvKEyMVQylX2vRVJyz18vdI9Hxx6tmt0krwHGi0Lt2h0BX2yaW';
        const testMessage = 'Explique o conceito de TypeScript em um parágrafo.';
        const assistantId = process.env.ASSISTANT_ID || 'cm8itx12f01d9f9pii9qt781t';
        const chatId = process.env.CHAT_ID || 'test-chat-id-123';
        const messageRole = 'user';
        // Create mock execute functions
        const mockExecuteFunctions = new MockExecuteFunctions({
            message: testMessage,
            adaToken: adaToken,
            assistantId: assistantId,
            chatId: chatId,
            messageRole: messageRole
        }, [{ json: { example: 'data' } }]);
        console.log('Executing node with parameters:');
        console.log('- Message:', testMessage);
        console.log('- Ada Token:', adaToken.substring(0, 7) + '...' + adaToken.substring(adaToken.length - 7));
        console.log('- Assistant ID:', assistantId);
        console.log('- Chat ID:', chatId);
        console.log('- Message Role:', messageRole);
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
    if (process.env.ADA_TOKEN) {
        console.log('Running node test...');
        testChatCompletionsNode()
            .then(() => console.log('Test execution finished'))
            .catch(error => console.error('Unhandled error during test:', error));
    }
    else {
        console.log('Please set your ADA_TOKEN environment variable to run this test');
        console.log('For example: ADA_TOKEN=ada-xxx... ts-node src/test.ts');
    }
}
