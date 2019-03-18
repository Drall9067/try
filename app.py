from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
import os
import base64
from io import BytesIO
import numpy as np
import cv2
import json

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

class frontAPI(Resource):
     def get(self):
          pass

     def post(self):
          print("Starting...")
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['image']
          img_bytes = base64.b64decode(data_url)
          img_stream = BytesIO(img_bytes)
          img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)

          print(img.shape)
          print(img)
          msg = 'Success. Front Image => '
          msg += '('+str(img.shape[0])+','+str(img.shape[1])+','+str(img.shape[2])+') '
          return { 'message' : msg }

class rearAPI(Resource):
     def get(self):
          pass

     def post(self):
          print("Starting...")
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['image']
          img_bytes = base64.b64decode(data_url)
          img_stream = BytesIO(img_bytes)
          img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)

          print(img.shape)
          print(img)
          msg = 'Success. Rear Image => '
          msg += '('+str(img.shape[0])+','+str(img.shape[1])+','+str(img.shape[2])+') '
          return { 'message' : msg }

api.add_resource(frontAPI, '/api/frontImage')
api.add_resource(rearAPI, '/api/rearImage')

# app.run(host=os.getenv('IP', '0.0.0.0'), port = int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
     # app.run(debug=False)
	app.run(port=5000,debug=False)