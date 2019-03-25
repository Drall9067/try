import dlib
import imutils
import numpy as np 
from pathlib import Path
from imutils import face_utils
from scipy.spatial import distance 

earthreshold = 0.25

def ear(eye):
	hor = distance.euclidean(eye[0], eye[3])
	ver1 = distance.euclidean(eye[1], eye[5])
	ver2 = distance.euclidean(eye[2], eye[4])

	return (ver1 + ver2)/(2*hor)

(leftcoord1, leftcoord2) = face_utils.FACIAL_LANDMARKS_68_IDXS["left_eye"]
(rightcoord1, rightcoord2) = face_utils.FACIAL_LANDMARKS_68_IDXS["right_eye"]
predictor = dlib.shape_predictor('./ML/Drowsiness/file.dat')

def getDrowsiness(imgarray):
	ct = 0
	for i in range(20):
		
		img = imgarray[i]
		img = imutils.resize(img, width = 800)

		detector = dlib.get_frontal_face_detector()
		rects = detector(img, 1)

		for rect in rects:
			shape = predictor(img, rect)
			shape = face_utils.shape_to_np(shape)
			lefteye = shape[leftcoord1 : leftcoord2]
			righteye = shape[rightcoord1 : rightcoord2]
			leftear = ear(lefteye)
			rightear = ear(righteye)
			finalear = (leftear + rightear)/2

			if(finalear < earthreshold):
				ct += 1

	if(ct > 10):
		return '1'
	return '0'
		
