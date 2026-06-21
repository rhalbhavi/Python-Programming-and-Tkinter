### Nested if-else ###

year = int(input("Enter a year: "))

# if (condition)
if (year%100)==0:
    # Nested if (condition)
    if (year%400)==0:
        print(year, " is a leap year.")
    # Nested else
    else:
        print(year, " is not a leap year.")
# else
else:
    # Nested if (condition)
    if (year%4)==0:
        print (year, " is a leap year.")
    # Nested else
    else:
        print (year, " is not a leap year.")        
