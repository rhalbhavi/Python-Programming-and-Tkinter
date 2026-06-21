### Dictionaries ###
# key-value pair (key:value)
# Values in a dictionary can be of different types - number, string, tuple)

# Define dictionary
Dict = {1: 'Python', 2: 'Java', 3: 'C++'}

## print dictionary
print(Dict) # Output: {1: 'Python', 2: 'Java', 3: 'C++'}

## create a dictionary using dict() function
dict = dict([(1, 'apple'), (2, 'ball')])
print (dict) # Output: {1: 'apple', 2: 'ball'}

## print keys and values in dictionary
Dict2 = {"Key1": "Hello", "Key2": "Goodbye", "Key3": "See you later"}

# keys() - print keys in dictionary
print(Dict2.keys()) # Output: dict_keys(['Key1', 'Key2', 'Key3'])

# values() - print values in dictionary
print(Dict2.values()) # Output: dict_values(['Hello', 'Goodbye', 'See you later'])
