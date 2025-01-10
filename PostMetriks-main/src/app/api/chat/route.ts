/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import LangflowClient from '../../lib/langflowClient'; // Assuming it's in 'lib/langflowClient.ts'

const langflowClient = new LangflowClient(
  'https://api.langflow.astra.datastax.com',
  'api'
);

// Handle POST requests for chat
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { inputValue, inputType = 'chat', outputType = 'chat', stream = false } = await req.json();

    if (!inputValue) {
      return NextResponse.json({ message: 'Input value is required' }, { status: 400 });
    }

    // Set the tweaks object if needed
    const tweaks = {
      "ChatInput-S6UmW": {},
      "ParseData-QCCe0": {},
      "Prompt-BxFom": {},
      "SplitText-IILu0": {},
      "OpenAIModel-kCZ95": {},
      "ChatOutput-4vxKG": {},
      "AstraDB-92ief": {},
      "OpenAIEmbeddings-zfenl": {},
      "AstraDB-KSWR4": {},
      "OpenAIEmbeddings-2G9fV": {},
      "File-m8xTD": {}
    };

    // Call the LangflowClient's `runFlow` method to initiate the flow
    const response = await langflowClient.runFlow(
      'd4ed471b-59c3-4c28-8a98-50d839de302a', // flowIdOrName
      '171b7c20-8dee-4729-922d-81546c6617cb', // langflowId
      inputValue,
     
    );
    console.log('API Response:', response);  // Log the raw response for debugging

    // If not streaming, return the final output
    if (!stream && response && response.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      return NextResponse.json({ message: output.message.text }, { status: 200 });
    }

    return NextResponse.json(response); // For streaming, return the initial response
  } catch (error: any) {
    console.error('Error running flow:', error.message);
    return NextResponse.json({ message: 'Error running flow', error: error.message }, { status: 500 });
  }
}

// Optionally, handle other HTTP methods (GET, PUT, DELETE) if needed
export async function GET() {
  return NextResponse.json({ message: 'GET method not supported on this endpoint' }, { status: 405 });
}
