## 📌 Identifiers in Python are names used to identify a variable, function, class, module, or other object. 

**An identifier starts with a letter (A-Z or a-z) or an underscore (_) followed by zero or more letters, underscores, and digits (0-9).**

**Python is case-sensitive, meaning `myVariable` and `myvariable` are treated as two entirely different identifiers.**

---

### ⛔ Naming Rules for Identifiers

To ensure your code executes without raising a `SyntaxError`, all identifiers must adhere to the following structural principles:

* **ALLOWED Characters:** Letters (both uppercase and lowercase), digits, and underscores.
* **CANNOT Start With A Digit:** An identifier **cannot** begin with a digit (e.g., `1variable` is invalid).
* **No Special Characters:** Symbols like `@`, `$`, `%`, and `!` are strictly prohibited inside identifier names.
* **Reserved Keywords:** You cannot use standard Python keywords (like `if`, `else`, `while`, `def`) as identifier names.

---

### 🛠️ Valid vs. Invalid Identifiers

| ✅ Valid Identifiers | Reason | ❌ Invalid Identifiers | Reason |
| :--- | :--- | :--- | :--- |
| `user_name` | Uses lowercase letters and underscores | `user-name` | Hyphens (`-`) are not allowed |
| `var1` | Ends with a number, which is allowed | `1var` | Cannot start with a number |
| `_total_score` | Starting with an underscore is valid | `total$` | Special characters (`$`) are forbidden |
| `calculateValue` | CamelCase names are perfectly valid | `import` | `import` is a reserved Python keyword |

---

### 💡 Best Practices and Naming Conventions

While Python allows any structurally sound identifier, following PEP 8 style guidelines makes your code highly readable and maintainable for others:

* **Variables & Functions:** Use **snake_case** (all lowercase letters with words separated by underscores).
    * *Example:* `calculate_total_price()`, `user_age`.
* **Classes:** Use **PascalCase** (capitalize the first letter of every word).
    * *Example:* `UserProfile`, `DatabaseConnection`.
* **Constants:** Use **UPPERCASE_SNAKE_CASE** (all capital letters with underscores).
    * *Example:* `MAX_LOGIN_ATTEMPTS`, `PI_VALUE`.
* **Private Identifiers:** Starting an identifier with a single leading underscore (e.g., `_internal_var`) indicates to other programmers that it is intended for internal use within a class or module.
