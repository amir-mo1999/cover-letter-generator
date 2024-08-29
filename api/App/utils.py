import base64
from PyPDF2 import PdfReader
from io import BytesIO
from openai import AsyncOpenAI
import os


def extract_text_from_pdf_base64(base64_string: str) -> str:
    """
    Extract text from a PDF file encoded in a base64 string.

    Parameters:
    base64_string (str): The base64 encoded string representing the PDF file.

    Returns:
    str: The extracted text from the PDF.
    """

    # Decode the base64 string
    pdf_data = base64.b64decode(base64_string)

    # Create a BytesIO object from the decoded data
    pdf_file = BytesIO(pdf_data)

    # Read the PDF file using PyPDF2
    reader = PdfReader(pdf_file)

    # Extract text from each page of the PDF
    extracted_text = ""
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        extracted_text += page.extract_text()

    return extracted_text


async def generate_cover_letter(job_listing: str, resume: str) -> str:
    """Generates a cover letter based on a given job listing and resume.

    Args:
        job_listing (str): job listing
        resume (str): resume

    Returns:
        str: cover letter generated by gpt-4-turbo
    """
    # open ai async client
    client = AsyncOpenAI()

    # retrieve prompts
    with open(os.path.join("prompts", "extract_job_information"), "r") as file:
        extract_job_information_prompt = file.readlines()
    with open(os.path.join("prompts", "generate_cover_letter"), "r") as file:
        generate_cover_letter = file.readlines()

    ## process the job listing
    stream = await client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": extract_job_information_prompt},
            {"role": "user", "content": f"Here is the job listing: {job_listing}"},
        ],
        stream=True,
    )
    job_listing = ""
    async for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")
        job_listing += chunk.choices[0].delta.content or ""

    ## generate the cover letter
    stream = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "assistant", "content": job_listing},
            {
                "role": "user",
                "content": generate_cover_letter,
            },
            {"role": "user", "content": f"Here is the resume: {resume}"},
        ],
        stream=True,
    )
    cover_letter = ""
    async for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")
        cover_letter += chunk.choices[0].delta.content or ""

    return cover_letter
