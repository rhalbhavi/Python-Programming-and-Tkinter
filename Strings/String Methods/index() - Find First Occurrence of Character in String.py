### Index() - Find First Occurrence of Character in String ###
  # This includes the black spaces in the string

# Initialize String
str = "Hello to the world"

# str.index(element)
str.index("the")

# Print index at which the element is
print (str.index("the")) # Output: 9

print (str.index("to")) # Output: 6

print (str.index("world")) # Output: 1

## ------------------------------------------------------------------------

# Try an element that is not present in string
print (str.index("as")) # Output: ValueError: substring not found
