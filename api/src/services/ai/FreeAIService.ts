import { AIService } from './AIService'
import { Ai } from '@cloudflare/ai'
import { Env, ExtReq } from '../../index'
import { RouterRequest } from '@tsndr/cloudflare-worker-router'

export class FreeAIService implements AIService {
	private ai
	private db

	constructor(private env: Env) {
		this.ai = new Ai(this.env.AI)
		this.db = env.DB
	}

	public async getChat(req: RouterRequest<ExtReq>, query: string): Promise<string> {
		const chatId = req.headers.get('x-chat-id') || ''

		// const { results } = await this.db.prepare('SELECT input, output FROM chat WHERE chatId = ?1 LIMIT 5').bind(chatId).all()
		//
		// let string = ``
		//
		// for (const item of results) {
		// 	string += ` I Said: ${item['input']} and you answered: ${item['output']},`
		// }
		const chat = {
			messages: [
				{ role: 'system', content: 'You are a helpful assistant.' },
				// { role: 'system', content: `context of conversation: ${string}.` },
				{ role: 'user', content: query },
			],
		}

		const { response } = (await this.ai.run('@hf/thebloke/openchat_3.5-awq', chat)) as { response: string }

		await this.db
			.prepare('INSERT INTO chat (chatId, input, output, createdAt) VALUES (?1, ?2, ?3, ?4)')
			.bind(chatId, query, response, new Date().toISOString())
			.run()

		return response
	}

	public async getImage(input: string): Promise<Response> {
		const prompt = {
			prompt: input || 'welcome image',
		}
		const response = await this.ai.run('@cf/bytedance/stable-diffusion-xl-lightning', prompt)
		return new Response(response, {
			headers: {
				'content-type': 'image/png',
			},
		})
	}
}
