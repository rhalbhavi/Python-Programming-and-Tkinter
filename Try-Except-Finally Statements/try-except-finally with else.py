### try-except-finally Statements with else Statement ###

# try:
try:
    num = int(input("Enter a number: "))
# except:
except:
    print ("Enter only an integer value")
# else:
else:
    even_or_odd = num%2==0
    # if condition:
    if even_or_odd:
        print ("Number entered is even")
    # else:
    else:
        print ("Number entered is odd")
# finally:
finally:
    print ("Program executed")
