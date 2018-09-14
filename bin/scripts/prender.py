import sys
import json
#import RPi.GPIO as GPIO

#GPIO.setmode(GPIO.BCM)
#GPIO.setup(17, GPIO.OUT)
#GPIO.setup(22, GPIO.OUT)
#GPIO.setup(21, GPIO.OUT)
#GPIO.setup(4, GPIO.OUT)
#GPIO.setup(5, GPIO.OUT)
#GPIO.setup(6, GPIO.OUT)
#GPIO.setup(13, GPIO.OUT)
#GPIO.setup(19, GPIO.OUT)

x =sys.argv
x.remove(x[0])

ledParams = json.loads(x[0])
#GPIO.output(ledParams["pin"], ledParams["isOn"])
#GPIO.cleanup()


print(str(ledParams["pin"]) + str(ledParams["isOn"]))