import os
import sys
import cv2
import json
import base64
import pymongo
import numpy as np
from io import BytesIO
from bson import json_util, ObjectId
from bson.json_util import dumps
from keras.models import load_model
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
sys.path.append('./ML')
import ML.engine as engine

app = Flask(__name__, static_url_path='', static_folder='dist/myapp')
api = Api(app)
CORS(app)
client = pymongo.MongoClient("mongodb+srv://meanMachines:hacknsut@myappcluster-zyfjx.mongodb.net/userDatabase",connect=True)

db = client['userDatabase']
col = db['userCollection']

data = ""
temp = ""

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

class checkUser(Resource):
     def get(self):
          pass
     
     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data = data['user']
          print(data)
          data = json.loads(dumps(col.find(data).sort("time", -1)))
          if(len(data)>0):
               return jsonify({ "user" : data[0] })
          return { "user" : '' }

class addUser(Resource):
     def get(self):
          pass
     
     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data = data['user']
          temp = json.loads(dumps(col.find({ 'email' : str(data['email']) }).sort("time", -1)))
          if(len(temp)>0):
               return { "user" : "" }
          col.insert_one(data)
          data = json.loads(json_util.dumps(data))
          return jsonify({ "user" : data })

class emotionAPI(Resource):
     def get(self):
          pass

     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data = data['image']
          data = base64.b64decode(data)
          data = BytesIO(data)
          data = cv2.imdecode(np.fromstring(data.read(), np.uint8), 1)
          data = cv2.cvtColor(data,cv2.COLOR_BGR2RGB)
          
          data = engine.detectExpression(data)
          print()
          print("Data",data,sep=" : ")
          print()
          return { 'message' : data }

class frontAPI(Resource):
     def get(self):
          pass

     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data = data['images']
          for i in range(len(data)):
               img = base64.b64decode(data[i])
               img = BytesIO(img)
               img = cv2.imdecode(np.fromstring(img.read(), np.uint8), 1)
               img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
               data[i] = img
          
          data = np.array(data)
          print(data.shape)
          return { 'message' : '0' }

class rearAPI(Resource):
     def get(self):
          pass

     def post(self):
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)

          data = data['image']
          data = base64.b64decode(data)
          data = BytesIO(data)
          data = cv2.imdecode(np.fromstring(data.read(), np.uint8), 1)
          data = cv2.cvtColor(data,cv2.COLOR_BGR2RGB)

          data = engine.detectVehicles(data)
          print()
          print("Data",data,sep=" : ")
          print()
          return { 'message' : data }

api.add_resource(checkUser, '/api/checkUser')
api.add_resource(addUser, '/api/addUser')
api.add_resource(emotionAPI, '/api/emotionImage')
api.add_resource(frontAPI, '/api/frontImage')
api.add_resource(rearAPI, '/api/rearImage')

app.run(host=os.getenv('IP', '0.0.0.0'), port = int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
     app.run(debug=False)
	# app.run(port=5000,debug=False)