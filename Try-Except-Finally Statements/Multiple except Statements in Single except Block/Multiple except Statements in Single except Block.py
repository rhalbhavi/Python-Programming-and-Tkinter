### Try-Except-Finally - Multiple Except Statements in 1/Single Except Block ###

num = [5, 6, 'a', 7, 8, 9]
b = 15
for x in num:
    # try:
    try:
        c = b/x
        print (c)
    # except:
    except ZeroDivisionError:
        print("Cannot be divided by 0")
    # except:
    except TypeError:
        print ("Enter only integer value")
