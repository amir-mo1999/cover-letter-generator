import axios from "axios";

interface Request {
  url: string;
  resume: string;
}

interface Response {
  cover_letter: string;
  company: string;
  job_title: string;
}

const api_url = "http://localhost:4000";

async function generateCoverLetter(req: Request): Promise<Response | null> {
  try {
    const response = await axios.post(api_url + "/generate-cover-letter", req);
    const data: Response = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) console.log(error.response);
    return null;
  }
}

export { generateCoverLetter };
