### Dictionaries ###
# key-value pair (key:value)
# Values in a dictionary can be of different types - number, string, tuple)


# Initialize dictionary
  # Dictionary = {key: value, key: value, ...}
Dict = {1: 'Python', 2: 'Java', 3: 'C++'}

## Print dictionary
print(Dict) # Output: {1: 'Python', 2: 'Java', 3: 'C++'}


## dict([(key, value), (key, value)]) -- Create a dictionary
dict = dict([(1, 'apple'), (2, 'ball')])

print (dict) # Output: {1: 'apple', 2: 'ball'}


# Dict.keys() -- Print keys in dictionary
print(Dict.keys()) # Output: dict_keys(['Key1', 'Key2', 'Key3'])


# Dict.values() -- Print values in dictionary
print(Dict.values()) # Output: dict_values(['Hello', 'Goodbye', 'See you later'])
