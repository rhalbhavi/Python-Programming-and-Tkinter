### all() - Returns True if all elements are True, else False ###

# Initialize String
a = {'a', 'b', False}

# all(element)
all(a)

print(all(a)) # Output: False

## ---------------------------------------------------------------
b = [1, 2, 3, 4, 7]
print(all(b)) # Output: True

c = [True, 0, False]
print(all(c)) # Output: False

d = []
print(all(d)) # Output: True
