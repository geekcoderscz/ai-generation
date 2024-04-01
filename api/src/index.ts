import { Ai as AIModel } from '@cloudflare/ai'
import { v4 as uuidv4 } from 'uuid'
import { Router, RouterRequest } from '@tsndr/cloudflare-worker-router'
import { D1Database } from '@cloudflare/workers-types'
import { FreeAIService } from './services/ai/FreeAIService'
import { OpenAIService } from './services/ai/OpenAIService'
import { AIService } from './services/ai/AIService'

export type ProviderI = 'cloudflare' | 'openai'

export interface Env {
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	S3: R2Bucket
	DB: D1Database
	AI: AIModel
	OPEN_AI_KEY: string
}

// Request Extension
export type ExtReq = {
	userId?: number
}

// Context Extension
export type ExtCtx = {
	//sentry?: Toucan
}

const router = new Router<Env, ExtCtx, ExtReq>()

router.cors({ allowOrigin: '*', allowMethods: 'GET,HEAD,POST,OPTIONS', maxAge: 86400 })

// GET Image
router.get('/api/image', ({ req, env }) => {
	return getImage(req, env)
})

// POST Chat
router.post('/api/chat', ({ req, env }) => {
	return getChatResponse(req, env)
})

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router.handle(request, env, ctx)
	},
}

async function getImage(req: RouterRequest<ExtReq>, env: Env): Promise<Response> {
	const db = env.DB
	let aiService: AIService
	if (getProvider(req) === 'openai') {
		aiService = new OpenAIService(env)
	} else {
		aiService = new FreeAIService(env)
	}
	const s3 = env.S3

	const { searchParams } = new URL(req.url)
	const query = searchParams.get('query')

	const inputs = {
		prompt: query || 'welcome image',
	}

	const response = await aiService.getImage(inputs.prompt)

	const s3Id = uuidv4()
	// Save to S3
	await s3.put(s3Id, await response.clone().blob())
	// Save to DB
	await db
		.prepare('INSERT INTO images (s3Id, query, createdAt) VALUES (?1, ?2, ?3)')
		.bind(s3Id, inputs.prompt, new Date().toISOString())
		.run()

	return response
}

async function getChatResponse(req: RouterRequest<ExtReq>, env: Env): Promise<Response> {
	let aiService: AIService
	if (getProvider(req) === 'openai') {
		aiService = new OpenAIService(env)
	} else {
		aiService = new FreeAIService(env)
	}

	const body = JSON.parse(await readRequestBody(req.raw))

	const response = await aiService.getChat(req, body.input)

	return Response.json({ response }, { headers: { 'content-type': 'application/json' } })
}

//
// async function getRPGChat(req: RouterRequest<ExtReq>, env: Env): Promise<Response> {
// 	const responses = []
//
// 	const ai = new Ai(env.AI)
//
// 	// messages - chat style input
// 	const chat = {
// 		messages: [
// 			{ role: 'system', content: 'You are a Dungeons and dragons master assistant.' },
// 			{
// 				role: 'system',
// 				content:
// 					'The description of the world: n the vast expanse of Aetheria, a world fragmented by cataclysmic events of ancient wars, lie the shattered remnants of what was once a unified realm. The landmasses, suspended amidst a swirling miasma of magical energies, float like broken puzzle pieces in the void. Each shard holds its own secrets, from lush forests to treacherous deserts, teeming with diverse creatures and civilizations.\n' +
// 					'\n' +
// 					'The inhabitants of Aetheria are as varied as the landscape itself. Elves, dwarves, humans, and countless other races carve out their existence amidst the ruins of the old world, while ancient beings, forgotten by time, lurk in the shadows. Magic permeates every aspect of life, both a source of wonder and a catalyst for conflict.\n' +
// 					'\n' +
// 					'At the heart of the shattered realms lies the Nexus, a nexus of power and mystery where the shards converge. It is a place of great danger and opportunity, coveted by those who seek to harness its untold energies for their own ambitions.\n' +
// 					'\n' +
// 					'Adventurers from all corners of Aetheria are drawn to the Nexus, seeking fame, fortune, or perhaps the chance to uncover the truth behind the cataclysm that tore their world asunder. Amidst the swirling chaos of the shattered realms, they forge their own destinies, shaping the fate of Aetheria with each step they take.' +
// 					'\n' +
// 					`You remember things based on this conversation between us: ${responses}`,
// 			},
// 		],
// 	}
// 	const response = await ai.run('@hf/thebloke/llama-2-13b-chat-awq', chat)
// 	return Response.json({ response })
// }

async function readRequestBody(request: Request): Promise<string> {
	const contentType = request.headers.get('content-type')!
	if (contentType.includes('application/json')) {
		return JSON.stringify(await request.json())
	} else if (contentType.includes('application/text')) {
		return request.text()
	} else if (contentType.includes('text/html')) {
		return request.text()
	} else if (contentType.includes('form')) {
		const formData = await request.formData()
		const body: { [key: string]: string } = {}
		for (const entry of formData.entries()) {
			body[entry[0]] = entry[1]
		}
		return JSON.stringify(body)
	} else {
		// Perhaps some other type of data was submitted in the form
		// like an image, or some other binary data.
		return 'a file'
	}
}

export function getProvider(req: RouterRequest<ExtReq>): ProviderI {
	return req.headers.get('X-Provider') as ProviderI
}
