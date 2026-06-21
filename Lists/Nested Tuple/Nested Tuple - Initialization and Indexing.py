### Nested Tuple - Initialization and Indexing ###

# Initialize Nested Tuple = [x, y, "str", (a, b), ...]
list = [10,23,"34A",(2,3),[5,8],2]

# Index of Value INSIDE Tuple Inside the List
  # List[Index of Tuple][Index of Value Inside Tuple]
list[4][0]
print(list[4][0])

# Index of Value INSIDE List Inside the List
  # List[Index of List][Index of Value Inside List]
list[3][1]
print(list[3][1])
