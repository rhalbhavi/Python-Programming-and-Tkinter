### Create a Basic Tkinter Application ###

# Import tkinter module
from tkinter import *

# root = Tk() -- Create the main/root window
root = Tk()

# root.title -- Give title to the window
root.title("tkinter program")

# root.geometry(width x height) -- Specify dimensions of the window
root.geometry("600x400")

# root.resizable(True/False, True/False) -- Specify whether window should be resizable or not - height, width
root.resizable(True, True)

# root.config(bg = "color") -- Specify background color
root.config(bg = "lightblue")

# root.mainloop() -- Execute the loop
root.mainloop()
