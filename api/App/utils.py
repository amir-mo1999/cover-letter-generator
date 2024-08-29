import base64
from PyPDF2 import PdfReader
from io import BytesIO


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
