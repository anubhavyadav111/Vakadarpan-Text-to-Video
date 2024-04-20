from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import os



app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['UPLOAD_FOLDER'] = './pdfS'


@app.route('/')
def index():
    return 'Welcome to the Mock API!'

@app.route('/hi', methods=['GET'])
def send_hi():
    return jsonify({'message': 'Hi from the Mock API!'})

video_url = "https://virdb-files.s3.ap-south-1.amazonaws.com/output_1/en_f.mp4"

@app.route('/api/mockapi', methods=['POST'])
def receive_data():
    if request.method == 'POST':
        print("hello from flask")
        print(request.form.get('projectName'))
        print(request.form.get('postMode'))
        project_name = request.form.get('projectName')
        postMode=request.form.get('postMode')
        pdfFile = request.files.get('pdfFile')

        pdf_reader = PdfReader(pdfFile)
        extracted_text = ''
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()
        print(extracted_text)
        
        return_data={'projectName': project_name,             
                    'video_url': video_url,
                    'pdfFile': pdfFile.filename,
                    'postMode': postMode,
                    'message': 'Received data successfully'
                    }
        
        return jsonify(return_data)
        

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app