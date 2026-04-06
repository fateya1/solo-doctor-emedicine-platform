lines = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8').readlines()

# Find subscriptions tab start and end
start = None
end = None
for i, line in enumerate(lines):
    if 'tab === "subscriptions"' in line and 'enabled' not in line:
        start = i
    if start and i > start and 'tab === "audit-logs"' in line:
        end = i
        break

print(f"Subscriptions tab: lines {start+1} to {end+1}")
