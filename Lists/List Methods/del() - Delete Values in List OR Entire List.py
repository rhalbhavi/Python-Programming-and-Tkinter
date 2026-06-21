### del() - Delete Values in List OR Entire List ###


# Initialize List
list = [1,2,3,4,5,6,7,8]

# del (List[index]) -- Delete 1 value in the list
del (list[5])

print (list) # Output: [1, 2, 3, 4, 5, 7, 8]

## -----------------------------------------------------------------------------------------

# del (list[start:end]) -- Delete a range of values in the list
del (list[2:5])

print (list) # Output: [1, 2, 7, 8]

## -----------------------------------------------------------------------------------------

# del list -- Delete the entire list
del list

# Print the deleted list - Verify list has been deleted and thus does not get printed
print (list) # Output: <class 'list'>
