/* eslint-disable @typescript-eslint/no-explicit-any */
class LangflowClient {
    constructor(private baseURL: string, private applicationToken: string) {}
  
    async post(endpoint: string, body: any, headers: Record<string, string> = {"Content-Type": "application/json"}) {
      headers["Authorization"] = `Bearer ${this.applicationToken}`;
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
      }
      return responseMessage;
    }
  
    async runFlow(flowIdOrName: string, langflowId: string, inputValue: string) {
      const endpoint = `/lf/${langflowId}/api/v1/run/${flowIdOrName}`;
      return this.post(endpoint, { input_value: inputValue });
    }
  }
  
  export default LangflowClient;
  