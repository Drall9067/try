import cv2
import numpy as np
from keras.models import load_model
from keras import backend as K
import tensorflow as tf

expressionDictionary = {
    0 : 'angry',
    1 : 'disgust',
    2 : 'fear',
    3 : 'happy',
    4 : 'sad',
    5 : 'surprise',
    6 : 'neutral'
}
expressionModel = load_model('./ML/Expression/model.h5')
expressionModel._make_predict_function()
face_cascade = cv2.CascadeClassifier("./ML/Expression/haarcascade_frontalface_alt.xml")

def getExpression(img):
    frame = img
    faces = face_cascade.detectMultiScale(img, 1.3, 5)

    for (x,y,w,h) in faces:
        frame = frame[y:y+w,x:x+h]
        frame = cv2.resize(frame,(48,48))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame = np.array(frame, dtype='float32').reshape(-1,48,48,1)/255.0
        
        y = expressionModel.predict(frame)[0]

        return expressionDictionary[np.argmax(y)]

    return ''
        
