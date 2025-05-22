import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

/**
 * Standard cleaner that removes invisible characters while preserving most text formatting
 */
function cleanSpecialCharacters(text: string, options: {
	keepPunctuation?: boolean;
	keepNumbers?: boolean;
	keepAccents?: boolean;
	customPreserve?: string;
} = {}): string {
	if (!text) return text;

	const {
		keepPunctuation = true,
		keepNumbers = true,
		keepAccents = true,
		customPreserve = '',
	} = options;

	// Regex to match various invisible characters and watermarks
	const invisibleCharsRegex = /[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u2066-\u2069\u2800-\u28FF]/g;

	// Basic cleaning - remove invisible characters
	let cleanedText = text.replace(invisibleCharsRegex, '');

	// Apply additional filters based on options
	if (!keepPunctuation) {
		cleanedText = cleanedText.replace(/[^\p{L}\p{N}\s]/gu, '');
	}

	if (!keepNumbers) {
		cleanedText = cleanedText.replace(/\d/g, '');
	}

	if (!keepAccents) {
		cleanedText = cleanedText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	// Preserve custom characters if specified
	if (customPreserve) {
		const customRegex = new RegExp(`[^\\p{L}\\p{N}\\s${customPreserve}]`, 'gu');
		cleanedText = text.replace(invisibleCharsRegex, '').replace(customRegex, '');
	}

	return cleanedText;
}

/**
 * Aggressive cleaner that removes all non-alphanumeric characters
 */
function aggressiveClean(text: string): string {
	if (!text) return text;
	
	// Only keep letters, numbers, and spaces
	return text.replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * Smart cleaner that targets common watermark patterns while preserving legitimate formatting
 */
function smartClean(text: string): string {
	if (!text) return text;

	// First pass: remove known invisible characters
	let cleanedText = text.replace(/[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u2066-\u2069]/g, '');
	
	// Second pass: remove suspicious pattern sequences often used in watermarks
	// Remove sequences of characters from Braille Pattern range
	cleanedText = cleanedText.replace(/[\u2800-\u28FF]{2,}/g, '');
	
	// Remove sequences of unusual space/formatting characters
	cleanedText = cleanedText.replace(/[\u2000-\u206F]{2,}/g, '');
	
	// Remove zero-width joiner/non-joiner when not between legitimate combining characters
	cleanedText = cleanedText.replace(/(?<![^\p{L}\p{N}])[\u200C\u200D](?![^\p{L}\p{N}])/gu, '');
	
	return cleanedText;
}

/**
 * Process text based on the selected mode
 */
function processText(text: string, mode: string, itemIndex: number, executeFunctions: IExecuteFunctions): string {
	if (mode === 'standard') {
		const options = executeFunctions.getNodeParameter('advancedOptions', itemIndex, {}) as {
			keepPunctuation?: boolean;
			keepNumbers?: boolean;
			keepAccents?: boolean;
			customPreserve?: string;
		};
		
		return cleanSpecialCharacters(text, options);
	} 
	
	if (mode === 'aggressive') {
		return aggressiveClean(text);
	} 
	
	if (mode === 'smart') {
		return smartClean(text);
	}

	// This shouldn't happen due to the dropdown options
	return text;
}

/**
 * Recursively process an object's string values
 */
function processObject(obj: object, mode: string, itemIndex: number, executeFunctions: IExecuteFunctions): object {
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'string') {
			result[key] = processText(value, mode, itemIndex, executeFunctions);
		} else if (typeof value === 'object' && value !== null) {
			result[key] = processObject(value, mode, itemIndex, executeFunctions);
		} else {
			result[key] = value;
		}
	}

	return result;
}

// Export for testing purposes
export const __test = {
	cleanSpecialCharacters,
	aggressiveClean,
	smartClean,
};

export class RemoveSpecialCharsNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Remove Special Characters',
		name: 'removeSpecialChars',
		group: ['transform'],
		version: 1,
		description: 'Remove watermarks and special characters from text or JSON data',
		defaults: {
			name: 'Remove Special Characters',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{
						name: 'Standard Clean',
						value: 'standard',
						description: 'Removes invisible characters while preserving most text formatting'
					},
					{
						name: 'Aggressive Clean',
						value: 'aggressive',
						description: 'Removes all non-alphanumeric characters (letters, numbers, spaces only)'
					},
					{
						name: 'Smart Clean',
						value: 'smart',
						description: 'Targets common watermark patterns while preserving legitimate formatting'
					},
				],
				default: 'standard',
				description: 'The cleaning strategy to use',
			},
			{
				displayName: 'Input Field',
				name: 'inputField',
				type: 'string',
				default: 'data',
				description: 'The field containing the text to clean',
				placeholder: 'e.g. data, content, text',
				required: true,
			},
			{
				displayName: 'Output Field',
				name: 'outputField',
				type: 'string',
				default: 'cleanedData',
				description: 'The field to store the cleaned text',
				placeholder: 'e.g. cleanedData, cleanContent',
				required: true,
			},
			{
				displayName: 'Advanced Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						mode: ['standard'],
					},
				},
				options: [
					{
						displayName: 'Keep Punctuation',
						name: 'keepPunctuation',
						type: 'boolean',
						default: true,
						description: 'Whether to preserve punctuation marks',
					},
					{
						displayName: 'Keep Numbers',
						name: 'keepNumbers',
						type: 'boolean',
						default: true,
						description: 'Whether to preserve numeric characters',
					},
					{
						displayName: 'Keep Accented Characters',
						name: 'keepAccents',
						type: 'boolean',
						default: true,
						description: 'Whether to preserve accented/diacritic characters',
					},
					{
						displayName: 'Custom Characters to Preserve',
						name: 'customPreserve',
						type: 'string',
						default: '',
						description: 'Specific characters to preserve (e.g. .,;:!?-)',
						placeholder: 'e.g. .,;:!?-',
					},
				],
			},
			{
				displayName: 'Process JSON Objects',
				name: 'processJsonObjects',
				type: 'boolean',
				default: false,
				description: 'Whether to recursively process all string fields in JSON objects',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const mode = this.getNodeParameter('mode', itemIndex) as string;
				const inputField = this.getNodeParameter('inputField', itemIndex) as string;
				const outputField = this.getNodeParameter('outputField', itemIndex) as string;
				const processJsonObjects = this.getNodeParameter('processJsonObjects', itemIndex, false) as boolean;

				const item = items[itemIndex];
				const newItem: INodeExecutionData = {
					json: { ...item.json },
					pairedItem: { item: itemIndex },
				};

				// Get input data
				const inputData = item.json[inputField];

				if (inputData === undefined) {
					throw new NodeOperationError(
						this.getNode(),
						`Input field '${inputField}' doesn't exist on item!`,
						{ itemIndex },
					);
				}

				// Process according to data type
				if (typeof inputData === 'string') {
					newItem.json[outputField] = processText(inputData, mode, itemIndex, this);
				} else if (typeof inputData === 'object' && inputData !== null && processJsonObjects) {
					newItem.json[outputField] = processObject(inputData, mode, itemIndex, this);
				} else {
					// Can't process this data type
					throw new NodeOperationError(
						this.getNode(),
						`Input field '${inputField}' must be a string or JSON object (with processJsonObjects enabled)!`,
						{ itemIndex },
					);
				}

				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

}