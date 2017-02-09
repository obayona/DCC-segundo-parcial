import pynmea2


class Parser:
        def parsear(self,s):
                msg = pynmea2.parse(s)
                longitud = msg.longitude;
                latitud = msg.latitude;
                if(longitud and latitud):
                        return str(longitud) + ";" + str(latitud)
                else:
                        return None

if __name__ == "__main__":
        parser = Parser()
        print len("$GPGGA,181834.00,,,,,0,00,99.99,,,,,,*61")
        print parser.parsear("$GPGGA,181627.00,,,,,0,00,99.99,,,,,,*6D")
        print parser.parsear("$GPGGA,171705.00,,,,,0,00,99.99,,,,,,*63")
