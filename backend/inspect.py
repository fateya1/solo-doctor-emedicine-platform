lines = open('api/src/revenue/revenue.service.ts', 'r', encoding='utf-8').readlines()

# Find the start and end of getDoctorEarnings function
start = None
end = None
for i, line in enumerate(lines):
    if 'async getDoctorEarnings()' in line:
        start = i
    if start and i > start and line.strip() == '}' and end is None:
        end = i
        break

print(f"Function spans lines {start+1} to {end+1}")
print("--- START ---")
for i in range(start, end+1):
    print(f"{i+1}: {repr(lines[i])}")
print("--- END ---")
