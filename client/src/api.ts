import axios from "axios";

interface GenerateCoverLetterRequest {
  url: string;
  resume: string;
}

const api_url = "http://localhost:4000";

async function generateCoverLetter(
  data: GenerateCoverLetterRequest
): Promise<void> {
  try {
    const response = await axios.post(api_url + "/generate-cover-letter", data);

    console.log("Cover letter generated successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error generating cover letter:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

export { generateCoverLetter };
