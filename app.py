from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api

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

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

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

# if __name__ == '__main__':
#     app.run(port=5000)