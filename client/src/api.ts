import axios from "axios";

interface GenerateCoverLetterRequest {
  url: string;
  resume: string;
}

const api_url = "http://localhost:4000";

async function generateCoverLetter(
  data: GenerateCoverLetterRequest
): Promise<string> {
  try {
    const response = await axios.post(api_url + "/generate-cover-letter", data);
    return response.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) console.log(error.response);
    return "error";
  }
}

export { generateCoverLetter };
