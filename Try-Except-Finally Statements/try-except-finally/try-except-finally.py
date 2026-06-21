### try-except-finally Statements ###

# Function
def divide_numbers(a, b):
    # try:
    try:
        # This code runs until it hits an error
        print(f"--- Attempting to divide {a} by {b} ---")
        result = a / b
        print(f"Success! The result is {result}")

    # except Error:
    except ZeroDivisionError:
        # Rruns ONLY IF error happens
        print("Error: You cannot divide a number by zero!")
      
    # finally:
    finally:
        # ALWAYS runs, no matter what else happens above
        print("Finally block: Cleaning up and wrapping up the function.\n")

## --------------------------------------------------------------------------------------------

# Example - Success
divide_numbers(10, 2)
"""
Output:
--- Attempting to divide 10 by 2 ---
Success! The result is 5.0
Finally block: Cleaning up and wrapping up the function.
"""

# Example - Triggers the except block
divide_numbers(10, 0)
"""
Output:
--- Attempting to divide 10 by 0 ---
Error: You cannot divide a number by zero!
Finally block: Cleaning up and wrapping up the function.
"""
