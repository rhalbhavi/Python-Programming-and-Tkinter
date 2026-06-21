### if-else ###

n = int(input("Enter a number: "))
ld = int(repr(n)[-1])

# if (condition)
if (ld%3)==0:
    print (ld, " is divisible by 3")
# else
else:
    print (ld, " is not divisible by 3")
