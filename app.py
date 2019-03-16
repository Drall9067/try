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

stores = [
     {
          'name': 'My Wonderful Store',
          'items': [
               {
                    'name': 'My Item',
                    'price': 15.99
               }
          ]
     }
]

@app.route('/')
def index():
    return app.send_static_file('index.html')

# @app.route('/<path:path>')
# def static_proxy(path):
#     # send_static_file will guess the correct MIME type
#     return app.send_static_file(path)

class Store(Resource):
     def get(self):
          data = { 'stores' : stores }
          return jsonify(data)

class StoreName(Resource):
     def get(self, name):
          for store in stores:
               if store['name']==name:
                    return store
          return jsonify({ 'error' : 'Store not found' })

api.add_resource(Store, '/api/stores')
api.add_resource(StoreName, '/api/stores/<string:name>')

class ImageAPI(Resource):
     def get(self):
          pass

     def post(self):
          print("Starting...")
          data = request.data
          data = data.decode("utf-8")
          data = json.loads(data)
          
          data_url = data['imageBase64']
          offset = data_url.index(',')+1
          img_bytes = base64.b64decode(data_url[offset:])

          img_stream = BytesIO(img_bytes)
          img = cv2.imdecode(np.fromstring(img_stream.read(), np.uint8), 1)
          
          print(img.shape)
          print("Done...")
          return { 'message' : 'Success' }

api.add_resource(ImageAPI, '/api/image')

app.run(host=os.getenv('IP', '0.0.0.0'), port = int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
	app.run(debug=False)