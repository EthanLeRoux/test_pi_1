import time
from gpiozero import MotionSensor, Buzzer

buzzer = Buzzer(27)           # Buzzer connected to GPIO 27
pir = MotionSensor(17)        # PIR sensor on GPIO 17

print("PIR sensor active. Waiting for motion...")

while True:
    pir.wait_for_motion()
    motion_start = time.time()
    print("Motion detected!")

    buzzer.on()
    time.sleep(1)   # Buzzer on for 1 second
    buzzer.off()

    pir.wait_for_no_motion()
    motion_end = time.time()
    duration = motion_end - motion_start
    print(f"Motion stopped. Motion lasted {duration:.2f} seconds.")
