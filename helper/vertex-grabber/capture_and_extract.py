'''
This py script is used along with MS paint 
to get the x and y coordinates of the building vertices
that are needed to added to color the from and to building

Directions:
-Move mouse to vertices of the building and press f8
'''
import re
from pynput import keyboard
from PIL import ImageGrab
import pytesseract

# OPTIONAL: set this if Tesseract isn't in PATH
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Screenshot region (adjust as needed)
X1, Y1, X2, Y2 = 49, 1458, 221, 1508

OUTPUT_FILE = "coordinates.txt"

def extract_numbers(text):
    numbers = re.findall(r"-?\d+\.?\d*", text)
    if len(numbers) >= 2:
        return numbers[0], numbers[1]
    return None, None


def take_screenshot_and_process():
    image = ImageGrab.grab(bbox=(X1, Y1, X2, Y2))
    text = pytesseract.image_to_string(image)

    x, y = extract_numbers(text)

    if x is None or y is None:
        print("❌ Could not find two numbers in OCR text")
        return

    line = f"{{x: {x}, y: {y}}},\n"

    with open(OUTPUT_FILE, "a") as f:
        f.write(line)

    print(f"{line.strip()}")


def on_press(key):
    try:
        if key == keyboard.Key.f8:
            take_screenshot_and_process()
    except AttributeError:
        pass


print("🎯 Listening for F8...")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
