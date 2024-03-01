import { RouterRequest } from '@tsndr/cloudflare-worker-router'
import { ExtReq } from '../../index'

export interface AIServiceI {
	getImage(input: string): Promise<Response>
	getChat(req: RouterRequest<ExtReq>, input: string): Promise<string>
}

export abstract class AIService implements AIServiceI {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async getChat(_req: RouterRequest<ExtReq>, _input: string): Promise<string> {
		throw new Error('Implement getChat function')
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async getImage(_input: string): Promise<Response> {
		throw new Error('Implement getImage function')
	}
}
