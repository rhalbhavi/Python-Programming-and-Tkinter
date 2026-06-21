### isprintable() - Check whether string is printable or not


## String.isprintable()
"Hello World".isprintable()

# Print output (True/False)
print("Hello World".isprintable()) # Output: True

## -----------------------------------------------------------------------------

# -- Example 2
"Hello \\n World".isprintable()
print("Hello \\n World".isprintable()) # Output: True

# -- Example 3
"Hello \n World".isprintable()
print("Hello \n World".isprintable()) # Output: False

# -- Example 4
" ".isprintable()
print(" ".isprintable()) # Output: True
