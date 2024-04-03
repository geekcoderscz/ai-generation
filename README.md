# Cloudflare Ai Generation

## Overview
This project is a simple web application that utilizes Cloudflare Workers for the backend and Preact for the frontend. Cloudflare Workers provide serverless compute environments that enable developers to deploy code at the edge of Cloudflare's network, closer to users, which can significantly improve performance and reduce latency. Preact, a lightweight alternative to React, is used for building fast and efficient user interfaces.

## Features
- Serverless backend powered by Cloudflare Workers
- Lightweight and efficient frontend built with Preact
- Responsive design for various screen sizes
- Minimalistic user interface

## Technologies Used
- [Cloudflare Workers](https://workers.cloudflare.com/): Serverless compute platform
- [Preact](https://preactjs.com/): Fast 3kB alternative to React with the same modern API
- HTML/CSS: For structuring and styling the frontend
- JavaScript: Programming language used for both backend and frontend logic

## Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/geekcoderscz/ai-generation.git
    ```
2. Install dependencies for frontend:
    ```bash
    cd ui
    npm install
    ```
3. Install dependencies for backend:
    ```bash
    cd api
    npm install
    ```
4. Fill in the environment variables for frontend and backend:
    ```bash
    cd api
    cp wrangler.example.toml wrangler.prod.toml
    cp wrangler.example.toml wrangler.toml
    cd ../ui
    cp .env.production
    ```
5. Deploy UI Workers:
    ```bash
    cd ui
    npm run deploy:cf
    ```
6. Deploy Cloudflare Workers:
    ```bash
    cd api
    npm run deploy:cf
    ```
7. Migrate D1 Cloudflare Database:
    ```bash
    cd api
    npx wrangler d1 execute prod-img-engine --file=./migrations/01.sql
    npx wrangler d1 execute prod-img-engine --file=./migrations/02.sql
    ```
   
## Frontend variables
File `ui/.env`

```VITE_API_HOST="https://YOUR_DOMAIN/api"```

## Backend variables
File `api/wrangler.toml`

```OPEN_AI_KEY = "***"```

```OPENAI_AI_ENABLED = false```

```CLOUDFLARE_AI_ENABLED = true```

## Usage
Once deployed, users can access the application through the provided Cloudflare Workers URL. The frontend interface allows users to interact with the backend through various actions such as fetching data or submitting forms.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Pull the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License
This project is licensed under the [MIT License](LICENSE.md).

## Acknowledgements
- Thanks to Cloudflare for providing the powerful serverless platform
- Preact for offering a lightweight alternative to React
- Contributors and open-source community for valuable feedback and support.
