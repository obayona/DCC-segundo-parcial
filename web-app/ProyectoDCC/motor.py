import RPi.GPIO as GPIO
from time import sleep

class Motor:
    def __init__(self):
        GPIO.setmode(GPIO.BOARD)
        self.Motor1A=29
        self.Motor1B=31
        self.Motor2A=15
        self.Motor2B=36
        GPIO.setup(self.Motor1A,GPIO.OUT)
        GPIO.setup(self.Motor1B,GPIO.OUT)
        GPIO.setup(self.Motor2A,GPIO.OUT)
        GPIO.setup(self.Motor2B,GPIO.OUT)

    def stop(self):
        GPIO.output(self.Motor1B,GPIO.LOW)
        GPIO.output(self.Motor1A,GPIO.LOW)
        GPIO.output(self.Motor2B,GPIO.LOW)
        GPIO.output(self.Motor2A,GPIO.LOW)
        
    def move(self,d):
        GPIO.output(self.Motor1B,GPIO.HIGH)
        GPIO.output(self.Motor1A,GPIO.LOW)
        GPIO.output(self.Motor2B,GPIO.HIGH)
        GPIO.output(self.Motor2A,GPIO.LOW)
        sleep(d/0.15)
        self.stop()

    def turnRight(self,alpha):
        self.stop()
        GPIO.output(self.Motor1B,GPIO.LOW)
        GPIO.output(self.Motor1A,GPIO.LOW)
        GPIO.output(self.Motor2B,GPIO.HIGH)
        GPIO.output(self.Motor2A,GPIO.LOW)
        sleep(0.014*alpha)

    def turnLeft(self,alpha):
        self.stop()
        GPIO.output(self.Motor1B,GPIO.HIGH)
        GPIO.output(self.Motor1A,GPIO.LOW)
        GPIO.output(self.Motor2B,GPIO.LOW)
        GPIO.output(self.Motor2A,GPIO.LOW)
        sleep(0.014*alpha)
        
    def turn(self,alpha):
        if(alpha>0):
            self.turnRight(alpha)
        if(alpha<0):
            self.turnLeft(-1*alpha)
        
    def end(self):
        self.stop()
        GPIO.cleanup()
'''
if __name__ == "__main__":
    ruta=[(1,0),(0.3,45),(0.4,-30)]
    motor = Motor()
    motor.stop()
    sleep(30)
    for x in ruta:
        d=x[0]
        alpha=x[1]
        if(alpha>0):
            motor.turnRight(alpha)
        if(alpha<0):
            motor.turnLeft(-1*alpha)
        motor.move(d)
'''
        
    
    
