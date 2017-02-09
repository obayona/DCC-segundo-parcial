import pigpio

Rx =27
Tx = 17
pi = pigpio.pi()
pi.set_mode(Rx,pigpio.INPUT)
pi.set_mode(Tx,pigpio.OUTPUT)
pi.bb_serial_read_open(Rx,9600) 
linea=""
while (pi.connected):
	x=pi.bb_serial_read(Rx)
	caracter=x[1]
	if (caracter):
		if(caracter=="\n"):
			print linea
			linea=""
		else:
			linea=linea+caracter
		
pi.bb_serial_read_close(Rx)
