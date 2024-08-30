Demure little web UI for generating cover letters. Simply provide a resume as a pdf and a link to a job listing and boom you got yourself a cover letter.

### Requirements

- Install Docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

### How to Run

1. Download or clone the repository
2. Open a terminal in the project folder
3. Run the following commands:

```
docker compose build
docker compose up -d
```

### How to Change the Generation Prompt

The prompt for generating the cover letter is stored in `api/App/prompts/generate_cover_letter.txt`. Simply change the prompt as you see fit. Changes will automatically be reflected in the running application.
