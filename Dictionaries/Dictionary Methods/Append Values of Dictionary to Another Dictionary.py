### Add/Append Dictionary to Another Dictionary ###

# Create a dictionary
d = {}

for i in range(3):
    name = input("Enter name of student: ")
    phoneno = int(input("Enter phone number: "))
    d[name] = phoneno

print (d)

# Create another dictionary
d2 = {}
name = input("Enter name of student: ")
phoneno = int(input("Enter phone number: "))
d[name] = phoneno

# append values in dictionary d2 to d1
d.update(d2)

# print updated dictionary after appending values
print (d)
