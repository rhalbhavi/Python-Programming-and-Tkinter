### Try-Except-Finally Statements - Arithmetic Error ###


try:
    b = int(input("Enter the value of the denominator: "))
    a = 10/b
    print (a)
except (ArithmeticError, IOError, TypeError):
    print ("Arithmetic error occured")
else:
    print ("Successfully executed")
    
