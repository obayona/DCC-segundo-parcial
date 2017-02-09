import time
import serial

ser = serial.Serial("/dev/ttyAMA0",9600)
counter = 0
while 1:
	x = ser.readline()
	if(x):
		print x
