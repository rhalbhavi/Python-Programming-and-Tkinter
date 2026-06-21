### sort(), sorted() - Sort Values in List ####


## sort() - Sort values from least to greatest

# Initialize List (unsorted)
nums = [12, 43, 21, 1]

# List.sort() - Sorts values from least to greatest
nums.sort()

# Print sorted list
print("Sorted list using sort():", nums)

# Print largest value in sorted list
print("Largest value in the list:", nums[-1])  # Output: 43
# Print smallest value in sorted list
print("Smallest value in the list:", nums[0])  # Output: 1

## -----------------------------------------------------------------------------------------

## sorted() - Return a new sorted list

# Initialize List (unsorted)
nums2 = [12, 43, 21, 1]

# List2 = sorted(List1) -- Create new sorted list without modifying the original list
sorted_nums = sorted(nums2)

# Print original unsorted list
print("Original list remains unchanged:", nums2)
# Print updated sorted list
print("Sorted list using sorted():", sorted_nums)

# Print largest value in sorted list
print("Largest value in the sorted list:", sorted_nums[-1])  # Output: 43
# Print smallest value in sorted list
print("Smallest value in the sorted list:", sorted_nums[0])  # Output: 1
