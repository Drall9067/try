import os
import sys
import cv2
import json
import base64
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt
from keras.models import load_model
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
sys.path.append('./ML')
import ML.engine as engine

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

class emotionAPI(Resource):
     def get(self):
          pass

     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['image']
          img_bytes = base64.b64decode(data_url)
          img_stream = BytesIO(img_bytes)
          img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)
          img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
          
          data = engine.detectExpression(img)
          print("Data",data,sep=" : ")
          return { 'message' : data }

class frontAPI(Resource):
     def get(self):
          pass

     def post(self):
          pass
          # data = request.data
          # data = data.decode("utf-8")
          # data = json.loads(data)

          # data_url = data['image']
          # img_bytes = base64.b64decode(data_url)
          # img_stream = BytesIO(img_bytes)
          # img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)
          # img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
          
          # data = engine.detectVehicle(img)
          # print("Data",data,sep=" : ")
          # return { 'message' : data }

class rearAPI(Resource):
     def get(self):
          pass

     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data_url = data['image']
          img_bytes = base64.b64decode(data_url)
          img_stream = BytesIO(img_bytes)
          img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)
          img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)

          data = engine.detectVehicle(img)
          print("Data",data,sep=" : ")
          return { 'message' : data }

api.add_resource(emotionAPI, '/api/emotionImage')
api.add_resource(frontAPI, '/api/frontImage')
api.add_resource(rearAPI, '/api/rearImage')

# app.run(host=os.getenv('IP', '0.0.0.0'), port = int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
     # app.run(debug=False)
	app.run(port=5000,debug=False)