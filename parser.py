import pynmea2
msg = pynmea2.parse("$GPGGA,182634.00,,,,,0,00,99.99,,,,,,*6C")
longitud = msg.longitude;
latitud = msg.latitude;
if(longitud and latitud):
	stringPosition = str(longitud) + ";" + str(latitud)
	print stringPosition
else:
	print "error"