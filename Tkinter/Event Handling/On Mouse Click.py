### On Mouse Click ###

import tkinter as tk
root = tk.Tk()
root.geometry("600x350")

# Function to display x and y positions of mouse click
def on_mouse_click(event):
    print(f"Mouse clicked at ({event.x}, {event.y})")

label = tk.Label(root, text="Click anywhere on me", height=20)

label.pack()

label.bind("<Button-1>", on_mouse_click)
'''Output: Mouse clicked at (x, y)'''

root.mainloop
