f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()
c = c.replace(
    '{Number(d.lastPayoutAmount ?? 0).toLocaleString()}',
    '{Number(d.totalPaidOut ?? 0).toLocaleString()}'
)
open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
print('Done')
