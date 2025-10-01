import time
import requests
from gpiozero import MotionSensor, Buzzer
from datetime import datetime, timezone

# Setup
buzzer = Buzzer(27)           # Buzzer connected to GPIO 27
pir = MotionSensor(17)        # PIR sensor on GPIO 17

API_URL = "https://iot-api-nytn.onrender.com/api/motion/saveDoc"
# API_URL = "http://localhost:5000/api/motion/saveDoc"

# Function to get approximate location from IP
def get_location():
    try:
        res = requests.get("https://ipinfo.io/json")
        data = res.json()
        lat, lon = data["loc"].split(",")
        return {"lat": float(lat), "long": float(lon)}
    except Exception as e:
        print(f"Could not fetch location: {e}")
        return {"lat": 0.0, "long": 0.0}  # fallback if location lookup fails

print("PIR sensor active. Waiting for motion...")

while True:
    pir.wait_for_motion()
    motion_start = time.time()
    print("Motion detected!")

    # Buzzer on for 1 sec
    buzzer.on()
    time.sleep(1)
    buzzer.off()

    pir.wait_for_no_motion()
    motion_end = time.time()
    duration = int(motion_end - motion_start)

    # Get live location via IP lookup
    location = get_location()

    # Build JSON payload
    payload = {
        "motionDuration": duration,
        "motionDatetime": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "motionLocation": location
    }

    # Send to API
    try:
        response = requests.post(API_URL, json=payload)
        print(f"Sent to API: {payload}")
        print(f"API Response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to send request: {e}")

    print(f"Motion stopped. Motion lasted {duration} seconds.")
