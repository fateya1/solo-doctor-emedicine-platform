f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add revenue tab to tabs array
c = c.replace(
    '    { key: "audit-logs", label: "Audit Logs", icon: FileText },\n  ];',
    '    { key: "audit-logs", label: "Audit Logs", icon: FileText },\n    { key: "revenue", label: "Revenue", icon: DollarSign },\n  ];'
)

open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
print('Admin dashboard done')
