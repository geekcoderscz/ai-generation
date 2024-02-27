import { Ai } from './vendor/@cloudflare/ai.js';
import { v4 as uuidv4 } from 'uuid';

let responses = [];

export default {
	async fetch(request, env) {
		return await getImage(request, env);
	}
};

async function getImage(req, env) {
	const db = env.DB;
	const ai = new Ai(env.AI);
	const s3 = env.S3;

	const { searchParams } = new URL(req.url);
	let query = searchParams.get('query');

	const inputs = {
		prompt: query || 'welcome image'
	};

	const response = (await ai.run(
		'@cf/stabilityai/stable-diffusion-xl-base-1.0',
		inputs
	));

	const res = new Response(response, {
		headers: {
			'content-type': 'image/png'
		}
	});

	const s3Id = uuidv4()
	// Save to S3
	await s3.put(s3Id, await res.clone().blob());
	// Save to DB
	await db.prepare('INSERT INTO images (s3Id, query, createdAt) VALUES (?1, ?2, ?3)').bind(s3Id, inputs.prompt, new Date().toISOString()).run()

	return res;
}

async function getRPGChat(req, env) {
	const ai = new Ai(env.AI);

	// messages - chat style input
	let chat = {
		messages: [
			{ role: 'system', content: 'You are a Dungeons and dragons master assistant.' },
			{
				role: 'system',
				content: 'The description of the world: n the vast expanse of Aetheria, a world fragmented by cataclysmic events of ancient wars, lie the shattered remnants of what was once a unified realm. The landmasses, suspended amidst a swirling miasma of magical energies, float like broken puzzle pieces in the void. Each shard holds its own secrets, from lush forests to treacherous deserts, teeming with diverse creatures and civilizations.\n' +
					'\n' +
					'The inhabitants of Aetheria are as varied as the landscape itself. Elves, dwarves, humans, and countless other races carve out their existence amidst the ruins of the old world, while ancient beings, forgotten by time, lurk in the shadows. Magic permeates every aspect of life, both a source of wonder and a catalyst for conflict.\n' +
					'\n' +
					'At the heart of the shattered realms lies the Nexus, a nexus of power and mystery where the shards converge. It is a place of great danger and opportunity, coveted by those who seek to harness its untold energies for their own ambitions.\n' +
					'\n' +
					'Adventurers from all corners of Aetheria are drawn to the Nexus, seeking fame, fortune, or perhaps the chance to uncover the truth behind the cataclysm that tore their world asunder. Amidst the swirling chaos of the shattered realms, they forge their own destinies, shaping the fate of Aetheria with each step they take.' +
					'\n' +
					`You remember things based on these responses given by you: ${responses}`
			},
			{ role: 'user', content: '' }
		]
	};
	console.log(responses);
	let response = await ai.run('@hf/thebloke/llama-2-13b-chat-awq', chat);
	return Response.json({ response });
}
