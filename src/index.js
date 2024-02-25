import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    const ai = new Ai(env.AI);

    const { searchParams } = new URL(request.url)
    let query = searchParams.get('query')

    const inputs = {
      prompt: query
    };

    const response = await ai.run(
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      inputs
    );

    return new Response(response, {
      headers: {
        'content-type': 'image/png'
      }
    });
  }
};
