### pop() - Delete Values in list by Index ###

# Initialize List
list = [12, 34, "AA", "SD"]
#     [ 0,  1,    2,   3 ] --------> Index of elements
#     [-4, -3,   -2,  -1 ] --------> Negative indexes

# Print the original list
print (list)

# List.pop(index) -- Delete element in list specifying index
list.pop(-3) # Deletes 34

# Print updated list after popping
print (list) # Output: list = [12,"AA","SD"]
