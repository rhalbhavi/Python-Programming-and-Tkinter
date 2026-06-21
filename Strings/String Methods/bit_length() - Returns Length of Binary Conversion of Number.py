### bit_length() function - Returns Length of Binary Conversion of Number ###

# Function
def string_bit_length(string):
    return len(string.encode('utf-8')) * 8

# Initialize String
my_string = "Hello, World!"

# bit_length
bit_length = string_bit_length(my_string)

# Print the output
print(bit_length) 
