export interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: OpenAIMessage;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface OpenAIStreamResponse {
    choices: {
        delta: {
            content: string
        }
    }[],
    created: number,
    id: string,
    model: string,
    object: string,
    service_tier: string,
    system_fingerprint: string,
}