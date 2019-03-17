from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
import os
import base64
from io import BytesIO
import numpy as np
import cv2
import json
import matplotlib.pyplot as plt

app = Flask(__name__, static_url_path='', static_folder='dist/myapp')
api = Api(app)
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

class oneImageAPI(Resource):
     def get(self):
          pass

     def post(self):
          print("Starting...")
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['front']
          offset = data_url.index(',')+1
          img_bytes = base64.b64decode(data_url[offset:])
          img_stream = BytesIO(img_bytes)
          frontImg = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)

          print(frontImg.shape)
          msg = 'Success. Image Sizes => '
          msg += 'FrontImg = ('+str(frontImg.shape[0])+','+str(frontImg.shape[1])+','+str(frontImg.shape[2])+') '
          return { 'message' : msg }

class twoImageAPI(Resource):
     def get(self):
          pass

     def post(self):
          print("Starting...")
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['front']
          offset = data_url.index(',')+1
          img_bytes = base64.b64decode(data_url[offset:])
          img_stream = BytesIO(img_bytes)
          frontImg = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)

          data_url = data['rear']
          offset = data_url.index(',')+1
          img_bytes = base64.b64decode(data_url[offset:])
          img_stream = BytesIO(img_bytes)
          rearImg = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)
          
          
          print(frontImg.shape)
          print(rearImg.shape)
          msg = 'Success. Image Size => '
          msg += 'FrontImg = ('+str(frontImg.shape[0])+','+str(frontImg.shape[1])+','+str(frontImg.shape[2])+') '
          msg += 'RearImg = ('+str(rearImg.shape[0])+','+str(rearImg.shape[1])+','+str(rearImg.shape[2])+') '
          return { 'message' : msg }

api.add_resource(oneImageAPI, '/api/oneImage')
api.add_resource(twoImageAPI, '/api/twoImage')

app.run(host=os.getenv('IP', '0.0.0.0'), port = int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
     app.run(debug=False)
	# app.run(port=5000,debug=False)