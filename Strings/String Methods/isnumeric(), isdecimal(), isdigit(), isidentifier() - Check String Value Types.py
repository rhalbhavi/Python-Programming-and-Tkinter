### isnumeric(), isdecimal(), isdigit(), isidentifier() - Check String Value Type ###


## isnumeric() - Check if string contains numeric characters or not

# Initialize String
str = "12134"

# String.isnumeric()
str.isnumeric()

# Print output
print (str.isnumeric()) # Output: True


# -- Example 2
str2 = "Awesome"
str2.isnumeric()
print (str2.isnumeric()) # Output: False

## ------------------------------------------------------------------------------------

## isdecimal() - Check if string is a decimal or not

# Initialize String
str3 = "123.45"

# String.isdecimal()
str3.isdecimal()

# Print output
print (str3.isdecimal()) # Output: False

## ------------------------------------------------------------------------------------

## isdigit() - Check if string is a digit/contains only digits or not

# Initialize String
str4 = "45"

# String.idigit()
str4.isdigit()

# Print output
print (str4.isdigit()) # Output: True


# -- Example 2
print("45.5".isdigit()) # Output: False

## ------------------------------------------------------------------------------------

## isidentifier() - Check if string is an identifier or not

# Initialize String
str5 = "str"

# String.isidentifier()
str5.isidentifier()

# Print output
print (str5.isidentifier()) # Output: True


# -- Example 2
print ("1str%".isidentifier()) # Output: False
