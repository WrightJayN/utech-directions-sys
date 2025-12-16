from pynput import keyboard
import pyautogui

def on_press(key):
    try:
        if key == keyboard.Key.f8:
            x, y = pyautogui.position()
            print("\nMouse Position:")
            print(f"x = {x}, y = {y}")
    except AttributeError:
        pass

print("🖱️ Listening for F8...")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
