f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''                  { label: "Total Revenue", value: `KES ${Number(revenueSummary.totalRevenue ?? 0).toLocaleString()}`, color: "bg-green-50 text-green-600", icon: TrendingUp },
                  { label: "This Month", value: `KES ${Number(revenueSummary.revenueThisMonth ?? 0).toLocaleString()}`, color: "bg-brand-50 text-brand-600", icon: Activity },
                  { label: "Platform Commission", value: `KES ${Number(revenueSummary.platformCommission ?? 0).toLocaleString()}`, color: "bg-purple-50 text-purple-600", icon: Banknote },
                  { label: "Total Payouts", value: `KES ${Number(revenueSummary.totalPayouts ?? 0).toLocaleString()}`, color: "bg-blue-50 text-blue-600", icon: CreditCard },'''

new = '''                  { label: "Total Revenue", value: `KES ${Number(revenueSummary.totalPlatformRevenue ?? 0).toLocaleString()}`, color: "bg-green-50 text-green-600", icon: TrendingUp },
                  { label: "This Month", value: `KES ${Number(revenueSummary.thisMonthCommissions ?? 0).toLocaleString()}`, color: "bg-brand-50 text-brand-600", icon: Activity },
                  { label: "Platform Commission", value: `KES ${Number(revenueSummary.totalCommissionRevenue ?? 0).toLocaleString()}`, color: "bg-purple-50 text-purple-600", icon: Banknote },
                  { label: "Total Payouts", value: `KES ${Number(revenueSummary.completedPayouts?.amount ?? 0).toLocaleString()}`, color: "bg-blue-50 text-blue-600", icon: CreditCard },'''

if old in c:
    c = c.replace(old, new, 1)
    open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
    print('Frontend done')
else:
    print('ERROR: string not found')
