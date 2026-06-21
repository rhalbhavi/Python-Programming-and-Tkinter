### for loop with break and continue statements ###

# break statement - Print all characters in a string until it reaches a specific character
for i in "String":
    # if character i reached is "n", terminate the process - don't print "n"
    if i=="n":
        break
    print (i)

# continue statement - print all characters in a string excluding a specific character
for i in "String":
    # if character i reached is "r", don't print "r" but print all other characters 
    if i=="r":
        continue
    print (i)
