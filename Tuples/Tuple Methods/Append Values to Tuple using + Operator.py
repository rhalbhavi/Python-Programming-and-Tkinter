### Tuples - Append/Add Values to Tuple using + Operator ###


# Initialize Tuple
T1 = (23, 32, 4, 5, 6, 71, 24)

# Initialize an empty tuple for the numbers input by the user
num = ()

# Accept x numbers from the user
for i in range(3):
    n1 = int(input("Enter any number: "))
    # add numbers to tuple 'num'
    num = num + (n1,)

# Add tuple 'num' to tuple 'T1' using + Operator
T1 = T1 + num

# Print tuple 'T1' after appending the values
print (T1)
