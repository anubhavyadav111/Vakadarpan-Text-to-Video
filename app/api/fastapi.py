from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from spire.pdf.common import *
from spire.pdf import *
from fastapi.responses import JSONResponse
import openai
from pydantic import BaseModel
from PyPDF2 import PdfReader
import os, re
import requests, uuid, json, concurrent
import nltk
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cv2
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image


from PyPDF2 import PdfReader
from io import BytesIO
import tempfile

######################

from concurrent.futures import ThreadPoolExecutor
from concurrent import futures
from serpapi import GoogleSearch






app = FastAPI()

origins = [ "http://localhost","http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_project_folder_structure(project_id: str):
    base_folder = f"./projects/{project_id}"

    # Create parent folder
    os.makedirs(base_folder, exist_ok=True)

    # Create subfolders
    subfolders = ["audio_clips", "images", "frames", "background", "clips", "anchor", "final"]

    for subfolder in subfolders:
        os.makedirs(os.path.join(base_folder, subfolder), exist_ok=True)

    return {"message": f"Folder structure created for project {project_id}"}

        

async def extract_text_from_pdf(pdf_path):
    pdf_stream = BytesIO(pdf_path)
    pdf_reader = PdfReader(pdf_stream)
    extracted_text = ''
    for page in pdf_reader.pages:
        extracted_text += page.extract_text()
    return extracted_text

def extract_images(pdf_content, project_id):
    try:
        temp_pdf = tempfile.NamedTemporaryFile(delete=False)
        temp_pdf.write(pdf_content)
        temp_pdf.close()
        
        doc = PdfDocument()
        doc.LoadFromFile(temp_pdf.name)

        images = []
        for i in range(doc.Pages.Count):
            page = doc.Pages.get_Item(i)
            for image in page.ExtractImages():
                images.append(image)

        index = 0
        for image in images:
            image_filename = f"projects/{project_id}/images/A-{index:d}.png"
            index += 1
            image.Save(image_filename, ImageFormat.get_Png())

        return len(images)
    
    except ValueError:
        return f"No images found in PDF for project: {project_id}"
    
    finally:
        doc.Close()
        # Delete the temporary file
        os.unlink(temp_pdf.name)



def scrapeapi(search_term):
    params = {
        "api_key": "a343218c95b0fb09214f5c48baeb0129856aad7680d77387e237984955f33638",
        "engine": "google_images",
        "google_domain": "google.co.in",
        "q": search_term,
        "hl": "hi",
        "gl": "in",
        "location": "Delhi, India"
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    image_url = []
    for i in results['images_results']:
        image_url.append(i['original'])
    return image_url


def save_images_concurrently(urls, project_id, max_workers=5):
    save_path = f"projects/{project_id}/images/"
    os.makedirs(save_path, exist_ok=True)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(save_image_from_url, url, save_path, i): url for i, url in enumerate(urls)}

        for future in futures:
            url = futures[future]
            try:
                future.result()
            except Exception as e:
                print(f"Error processing URL {url}: {e}")


def save_image_from_url(url, save_path, index):
    try:
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img_name = f"B-{index}.jpg"
        img.save(os.path.join(save_path, img_name))
        print(f"Image saved successfully at {os.path.join(save_path, img_name)}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching image from URL {url}: {e}")
    except Exception as e:
        print(f"Error: {e}")

async def scrape_relevant_images_from_google(project_id: str, search_term: str):
    image_urls = scrapeapi(search_term)
    save_images_concurrently(image_urls, project_id)
    return {"status": "Success"}

def is_folder_empty(folder_path):
    return not any(os.listdir(folder_path))

def remove_duplicate_images_from_folder(project_id, threshold=0.95):
    hash_list = []
    deduplicated_images = []
    hash_size = 8

    def dhash(image, hash_size=8):
        resized = cv2.resize(image, (hash_size + 1, hash_size))
        diff = resized[:, 1:] > resized[:, :-1]
        return sum([2 ** i for (i, v) in enumerate(diff.flatten()) if v])

    def hamming_distance(hash1, hash2):
        return bin(hash1 ^ hash2).count('1')

    for filename in os.listdir(f"projects/{project_id}/images"):
        file_path = os.path.join(f"projects/{project_id}/images", filename)
        if os.path.isfile(file_path) and filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image = cv2.imread(file_path)
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image_hash = dhash(gray_image)

            duplicate_indices = [i for i, h in enumerate(hash_list) if hamming_distance(image_hash, h) <= hash_size * 0.15]

            if not duplicate_indices:
                deduplicated_images.append(image)
                hash_list.append(image_hash)
            else:
                print(f"Removing duplicate: {file_path}")
                # Optionally, you can remove the print statement above if you don't want to display which images are being removed.
                os.remove(file_path)
                print(f"Deleted: {file_path}")

    return {"status":"Duplicated removed"}

async def remove_duplicates_from_project_image_pool(project_id: str):
    folder_path = f"projects/{project_id}/images"
    if is_folder_empty(folder_path):
        return {"status":"The Image folder for the project is empty"}
    else:
        result = remove_duplicate_images_from_folder(project_id)
        return result   

def paragraph_to_sentences(paragraph):
    cleaned_paragraph = re.sub(r'\n', ' ', paragraph)
    sentences = nltk.sent_tokenize(cleaned_paragraph)
    print(cleaned_paragraph)
    return sentences


def synthesize_and_save(text, gender,voice_name, language_code, output_filename):
  SPEECH_REGION = "eastus"
  SPEECH_KEY = "21cc17a1914042f8b8287972ec739bdc"
  url = f"https://{SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
  headers = {
      "Ocp-Apim-Subscription-Key": SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      "User-Agent": "curl"
  }
  ssml_payload = f'''
  <speak version='1.0' xml:lang='en-US'>
      <voice xml:lang='{language_code}' xml:gender='{gender}' name='{voice_name}'>
        {text}
      </voice>
  </speak>
  '''
  response = requests.post(url, headers=headers, data=ssml_payload.encode('utf-8'))
  if response.status_code == 200:
      with open(output_filename, "wb") as f:
          f.write(response.content)
      print("Text-to-speech conversion successful. Output saved to output.mp3")
  else:
      print(f"Error: {response.status_code}, {response.text}")


@app.get("/")
async def root():
    return {"message": "Vakya Darpan 4.0"}


video_url = "https://virdb-files.s3.ap-south-1.amazonaws.com/output_1/en_f.mp4"

@app.post("/api/mockapi")
async def receive_data(
    projectName: str = Form(...),
    postMode: str = Form(...),
    pdfFile: UploadFile = Form(...),
    reels: bool=Form(...)
):
    pdf_filename = pdfFile.filename
    pdf_content = await pdfFile.read()
    pdf_text=await extract_text_from_pdf(pdf_content)

    create_project_folder_structure(projectName)
    print("Folder structure created")
    keyapi = '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'

    max_tokens = 4096  
    truncated_text = pdf_text[:max_tokens]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": truncated_text}
        ],
        max_tokens=300,
        api_key=keyapi
    )
    summary = response['choices'][0]['message']['content']
    search_term=summary
    print("Summary structure created")



    images_extraction_result = extract_images(pdf_content, projectName)
    print("images exctracted")

    await scrape_relevant_images_from_google(projectName, search_term)
    print("Relevant images scraped")

    await remove_duplicates_from_project_image_pool(projectName)
    print("duplicates removed")

    
    

    return_data = {
        'projectName': projectName,
        'pdf_filename': pdf_filename,   
        'pdf_content':pdf_text,
        'postMode': postMode,
        'video_url': video_url,
        'message': 'Received data successfully',
        'summary': summary,
        'reels': reels
    }
    
    return return_data

# @app.post("/create_project/{project_id}" ,description="Creates folder structure for project")
# def create_project_folder_structure(project_id: str):
#     base_folder = f"./projects/{project_id}"

#     # Create parent folder
#     os.makedirs(base_folder, exist_ok=True)

#     # Create subfolders
#     subfolders = ["audio_clips", "images", "frames", "background", "clips", "anchor", "final"]

#     for subfolder in subfolders:
#         os.makedirs(os.path.join(base_folder, subfolder), exist_ok=True)

#     return {"message": f"Folder structure created for project {project_id}"}





# @app.post("/extract_text", description='Text Extractor + Summarizer')
# async def extract_text_from_pdf_endpoint(pdf_file: UploadFile = File(...)):
#     try:
#         with open("/tmp/uploaded.pdf", "wb") as pdf:    
#             pdf.write(pdf_file.file.read())
#             extracted_text = extract_text_from_pdf("/tmp/uploaded.pdf")


                        
#         # return {"extracted_text": summary}

#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})





# @app.post("/extract_images")
# async def extract_images_from_pdf(project_id:str ,pdf_file: UploadFile = File(...)):
#     try:
#         with open("/tmp/uploaded.pdf", "wb") as pdf:    
#             pdf.write(pdf_file.file.read())
#             images_num = extract_images("/tmp/uploaded.pdf" , project_id)


#         return JSONResponse(content={"message": f"{images_num} images extracted","num": images_num })
#     finally:
#         pdf_file.file.close()

# @app.post('/scrape_images')
# async def scrape_relevant_images_from_google(project_id: str, search_term: str):
#     image_urls = scrapeapi(search_term)
#     save_images_concurrently(image_urls, project_id)
#     return {"status": "Success"}

# @app.get('/remove_duplicates')
# async def remove_duplicates_from_project_image_pool(project_id: str):
#     folder_path = f"projects/{project_id}/images"
#     if is_folder_empty(folder_path):
#         return {"status":"The Image folder for the project is empty"}
#     else:
#         result = remove_duplicate_images_from_folder(project_id)
#         return result   


@app.post("/sentence_tokenization")
async def splitting_paragraph_in_sentences(paragraph_text:str):
    sentences_list = paragraph_to_sentences(paragraph_text)
    
    return JSONResponse(content={"sentence_list": sentences_list})


class EmailRequest(BaseModel):
    reciever_mail : str
    title: str
    body: str

@app.post("/send_mail")
async def endpoint_to_send_email(request_data : EmailRequest):
    sender_email = "teamanukriti145@gmail.com"
    receiver_email = request_data.reciever_mail
    subject = request_data.title
    body = request_data.body
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "teamanukriti145@gmail.com"
    smtp_password = "etguatggmtanning"

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_email, message.as_string())

    return JSONResponse(content={"status":"Email Sent"})



class TranslationRequest(BaseModel):
    language_code: str
    original_text: List[str]


@app.post('/translate_list')
async def translate_list(request_data: TranslationRequest):
    key = "e53da45bded141568b4413f4a0751037"
    endpoint = "https://api.cognitive.microsofttranslator.com"
    location = "centralindia"
    path = '/translate'
    constructed_url = endpoint + path

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': request_data.language_code
    }

    body = [{'text': sentence} for sentence in request_data.original_text]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    translated_sentences = [item['translations'][0]['text'] for item in response]
    return {'translated_sentences': translated_sentences}


class AudioGenTemplate(BaseModel):
    project_id: str
    sentences: List[str]
    gender: str
    voice_name: str
    language_code: str


@app.post('/generate_audio')
async def generate_audio_from_list_of_sentences(Audiogen: AudioGenTemplate):
    output_dir = f"projects/{Audiogen.project_id}/audio_clips"
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for i, sentence in enumerate(Audiogen.sentences, 1):
            output_filename_mp3 = os.path.join(output_dir, f"output_{i}.mp3")
            futures.append(executor.submit(synthesize_and_save, sentence, Audiogen.gender, Audiogen.voice_name, Audiogen.language_code, output_filename_mp3))

        concurrent.futures.wait(futures)
        return {"status":"Audio gen complete"}