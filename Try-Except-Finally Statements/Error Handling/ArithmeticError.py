### Try-Except-Finally - ArithmeticError ###

try:
    b = int(input("Enter the value of the denominator: "))
    a = 10/b
    print (a)
# except ArithmeticError
except (ArithmeticError, IOError, TypeError): # More errors are added here - this can be done
    print ("Arithmetic error occured")
else:
    print ("Successfully executed")
