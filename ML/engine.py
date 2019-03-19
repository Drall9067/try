import cv2
import sys
from keras.models import load_model
sys.path.append('./Expression')
import Expression.expression as expression
sys.path.append('./Vehicle')
import Vehicle.vehicle as vehicle

def detectVehicle(img):
    return vehicle.getVehicles(img)

def detectExpression(img):
    return expression.getExpression(img)

def detectDrowsiness(img):
    pass