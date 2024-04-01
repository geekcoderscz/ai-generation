import { AIService } from './AIService'
import { Env, ExtReq } from '../../index'

import OpenAI from 'openai'
import { RouterRequest } from '@tsndr/cloudflare-worker-router'

export class OpenAIService implements AIService {
	private ai
	private db

	constructor(private env: Env) {
		this.ai = new OpenAI({ apiKey: this.env.OPEN_AI_KEY })
		this.db = this.env.DB
	}

	public async getChat(req: RouterRequest<ExtReq>, query: string): Promise<string> {
		const chatId = req.headers.get('x-chat-id') || ''

		// const { results } = await this.db.prepare('SELECT input, output FROM chat WHERE chatId = ?1 LIMIT 5').bind(chatId).all()
		//
		// let string = ``
		//
		// for (const item of results) {
		// 	string += ` I said: ${item['input']} and you answered: ${item['output']},`
		// }

		const completion = await this.ai.chat.completions.create({
			messages: [
				{ role: 'system', content: 'You are a helpful assistant.' },
				// { role: 'system', content: `context of conversation: ${string}.` },
				{ role: 'user', content: query },
			],
			model: 'gpt-3.5-turbo',
		})
		const response = completion.choices[0].message.content
		await this.db
			.prepare('INSERT INTO chat (chatId, input, output, createdAt) VALUES (?1, ?2, ?3, ?4)')
			.bind(chatId, query, response, new Date().toISOString())
			.run()

		return response || 'Unable to process, try again later.'
	}

	public async getImage(input: string): Promise<Response> {
		const image = await this.ai.images.generate({
			model: 'dall-e-3',
			prompt: input,
			n: 1,
			size: '1024x1024',
			response_format: 'b64_json',
		})

		const data = image.data[0].b64_json || ''

		return new Response(b64toBlob(data || ''), {
			headers: {
				'content-type': 'image/png',
			},
		})
		// const response = await this.ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', prompt)
	}
}

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
	const byteCharacters = atob(b64Data)
	const byteArrays = []

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize)

		const byteNumbers = new Array(slice.length)
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i)
		}

		const byteArray = new Uint8Array(byteNumbers)
		byteArrays.push(byteArray)
	}

	return new Blob(byteArrays, { type: contentType })
}
