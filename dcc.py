import time
import signal
import sys
import threading
import serial
#import pigpio

BandGPS = True;
linea=""

#Serial para leer y escribir en XBee
Rx = 27
Tx = 17
pi= pigpio.pi()
pi = pigpio.pi()
pi.set_mode(Rx,pigpio.INPUT)
pi.bb_serial_read_open(Rx,9600)


serialGPS = serial.Serial("/dev/ttyAMA0",9600) #serial para leer GPS


def threadGPS():
	while BandGPS:
		x = serialGPS.readline()
		if(x):
			print x
		

def threadXBee():
	while (pi.connected):
		
		x=pi.bb_serial_read(Rx)
		caracter=x[1]
		if (caracter):
			if(caracter=="\n"):
				print linea
				linea=""
		else:
			linea=linea+caracter
		
		

def exit_gracefully():
	signal.signal(signal.SIGINT, original_sigint)
	pi.bb_serial_read_close(Rx)
	serialGPS.close()
	print "salir"
	sys.exit(0)


if __name__ == "__main__":
	#original_sigint = signal.getsignal(signal.SIGINT)
	#signal.signal(signal.SIGINT, exit_gracefully)

	tGPS = threading.Thread(target=threadGPS)
	tXBee = threading.Thread(target=threadXBee)

	tGPS.start();
	tXBee.start();