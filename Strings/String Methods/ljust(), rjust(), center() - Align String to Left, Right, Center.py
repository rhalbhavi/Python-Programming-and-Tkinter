### ljust, rjust, center - Align string to left, right, center ###


## ljust - Aligns string to left

# Initialize String
str = "Awesome"

# ljust (width, fillchar)
str.ljust(12, "#")

# Print updated string
print (str.ljust(12, "#")) # Output: Awesome#####

## -------------------------------------------------------------------------

## rjust - Aligns string to right

# Initialize String
str2 = "Awesome"

# rjust (width, fillchar)
str2.rjust(22," ")

# Print updated string
print(str2.rjust(22, " ")) # Output:        Awesome        

## -------------------------------------------------------------------------

## center - Aligns string to center

# Initialize String
str3 = "Python"

# center (width, fillchar)
str3.center(15, "-")

# Print updated string
print(str3.center(15, "-")) # Output: -----Python----
