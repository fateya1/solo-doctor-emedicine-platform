lines = open('api/src/revenue/revenue.service.ts', 'r', encoding='utf-8').readlines()

# Find createPayout start/end
start = None
end = None
brace_depth = 0
for i, line in enumerate(lines):
    if "async createPayout(" in line:
        start = i
    if start is not None and i >= start:
        brace_depth += line.count("{") - line.count("}")
        if brace_depth == 0 and i > start:
            end = i
            break

print(f"createPayout: lines {start+1} to {end+1}")
for i in range(start, end+1):
    print(f"{i+1}: {repr(lines[i])}")
