import cv2
import sys
from keras.models import load_model
sys.path.append('./Expression')
import Expression.expression as expression
sys.path.append('./Drowsiness')
import Drowsiness.drowsiness as drowsiness
sys.path.append('./Vehicle')
import Vehicle.vehicle as vehicle

def detectVehicles(img):
    return vehicle.getVehicles(img)

def detectExpression(img):
    return expression.getExpression(img)

def detectDrowsiness(imgs):
    return drowsiness.getDrowsiness(imgs)