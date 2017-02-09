import time
import signal
import sys
import threading
import serial
import pigpio
from motor import Motor
from parser import Parser

Rx=17
pi= pigpio.pi()
serialXbee = serial.Serial("/dev/ttyAMA0",9600) #serial para el xbee
lockRuta = threading.Lock()
lockPosition = threading.Lock()
lockSend = threading.Lock()
ruta=[]
position=""
banSend=False

def signal_handler(signal,frame):
	print "salir..."
	pi.bb_serial_read_close(Rx)
        serialXbee.close()
	print "puertos cerrados"
	sys.exit(0)



def threadRecibirRuta():
	modo=False
	global ruta
	while True:
		x = serialXbee.readline()
		if(x):
                        if(x=="FIN\n"):
                                print "Fin Ruta"
				modo=False
				with lockRuta:
					print ruta
			if(modo):
				with lockRuta:
                                        #print x
                                        aux=x[:-1]
                                        aux=aux.split(";")
                                        tupla=(float(aux[0]),float(aux[1]))
					ruta.append(tupla)
			if(x=="RUTA\n"):
				print "Inicio Ruta"
				with lockRuta:
                                        ruta=[]
                                        modo=True
			

def threadSendPosition():
        global position
        global banSend
        p = Parser()
	while True:
                with lockPosition:
                        if(position!=""):
                                with lockSend:
                                        if(banSend):
                                                print position
                                                coordinates=p.parsear(str(position))
                                                if(coordinates):
                                                        print "sending position"
                                                        print coordinates
                                                        serialXbee.write(coordinates+"\n")
                                        if(not banSend):
                                                continue
                if(position!=""):
                        time.sleep(5)

def threadGPS():
        
        #Serial para leer el GPS
        global position
        pi.set_mode(Rx,pigpio.INPUT)
        pi.bb_serial_read_open(Rx,9600)
	linea=""
        while (pi.connected):
            x=pi.bb_serial_read(Rx)
            pedazo=x[1]
            if (pedazo):
                index=pedazo.find("\n")
                if (index==-1): # lo leido no contiene enter
                    linea=linea+pedazo
                else: #contiene enter
                    linea=linea+pedazo[:index]
                    if(linea[:6]=="$GPGGA"):
                        #print linea
                        with lockPosition:
                                position=linea
                    linea=""+pedazo[index+1:]

def threadGianessaCar():
        x=None
        m= Motor()
        global ruta
        global banSend
        while True:
                with lockRuta:
                        if(len(ruta)>0):
                                x=ruta.pop(0)
                if(x):
                        with lockSend:
                                banSend=True
                                #print "Se puede trasmitir la ruta"
                        m.turn(x[1])
                        m.move(x[0])
                        x=None
                        with lockSend:
                                banSend=False
                                #print "No Se puede trasmitir la ruta"
        

if __name__ == "__main__":
	signal.signal(signal.SIGINT, signal_handler)

	tGPS = threading.Thread(target=threadGPS)
	tGPS.daemon=True
	
	tRuta = threading.Thread(target=threadRecibirRuta)
	tRuta.daemon=True

	tSendPosition = threading.Thread(target=threadSendPosition)
	tSendPosition.daemon=True

	tGianessaCar = threading.Thread(target=threadGianessaCar)
	tGianessaCar.daemon=True
	
	tGPS.start()
	tRuta.start()
	tSendPosition.start()
	tGianessaCar.start()
	while 1:
		time.sleep(1)
