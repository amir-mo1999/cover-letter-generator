Demure little web UI for generating cover letters. Simply provide a resume as a pdf and a link to a job listing and boom you got yourself a cover letter.

### Requirements

- Install Docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

### Setup

1. Download or clone the repository
2. In the `api` folder create a `.env` file. On MacOS you can run `touch .env` in your console.
3. Add the following to the `.env` file and replace the API key with your own OpenAI API key:

```
OPENAI_API_KEY=replace-with-your-api-key
```

### How to Run

1. Open a console in the project folder
2. Run the following commands:

```
docker compose build
docker compose up -d
```

### How to Change the Generation Prompt

The prompt for generating the cover letter is stored in `api/App/prompts/generate_cover_letter.txt`. Simply change the prompt as you see fit. Changes will automatically be reflected in the running application.
