### Set Operations - Union, Intersection, Difference, Symmetric Difference ###


# Initialize Set
Set1 = {1, 2, 4, 6, 7, 9, 11}
Set2 = {1, 4, 7, 9}


# Union (All elements in all sets)
Set1|Set2

print (Set1|Set2) # Output: {1, 2, 4, 6, 7, 9, 11}


# Intersection (Common elements in sets)
Set1&Set2

print (Set1&Set2) # Output: {1, 4, 9, 7}


# Difference (Elements in Set1 that are not in Set2)
Set1-Set2

print(Set1-Set2) # Output: {2, 11, 6}


# Symmetric Difference (Elements in all sets, excluding intersection)
Set1^Set2

print (Set1^Set2) # Output: {2, 6, 11}
