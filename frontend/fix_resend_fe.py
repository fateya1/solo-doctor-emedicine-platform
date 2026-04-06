f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add resendStkMutation after updatePayoutMutation
old = '''  const { data: subscriptions } = useQuery({'''
new = '''  const resendStkMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/revenue/payouts/${id}/resend-stk`),
    onSuccess: (res: any) => alert(res.data?.message ?? "STK Push sent!"),
    onError: (err: any) => alert(err.response?.data?.message || "Failed to resend STK Push."),
  });

  const { data: subscriptions } = useQuery({'''

c = c.replace(old, new, 1)

# Add Resend STK button alongside Mark paid / Failed buttons
old2 = '''                        {p.status === "PENDING" && (
                          <div className="flex gap-1">
                            <button onClick={() => { const r = prompt("M-Pesa receipt:"); if (r) updatePayoutMutation.mutate({ id: p.id, status: "COMPLETED", mpesaReceiptNo: r }); }}
                              className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1 rounded-lg touch-manipulation">Mark paid</button>
                            <button onClick={() => updatePayoutMutation.mutate({ id: p.id, status: "FAILED" })}
                              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg touch-manipulation">Failed</button>
                          </div>
                        )}'''

new2 = '''                        {p.status === "PENDING" && (
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => resendStkMutation.mutate(p.id)}
                              disabled={resendStkMutation.isPending}
                              className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-2.5 py-1 rounded-lg touch-manipulation font-medium">
                              📲 Resend STK
                            </button>
                            <button onClick={() => { const r = prompt("M-Pesa receipt:"); if (r) updatePayoutMutation.mutate({ id: p.id, status: "COMPLETED", mpesaReceiptNo: r }); }}
                              className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1 rounded-lg touch-manipulation">Mark paid</button>
                            <button onClick={() => updatePayoutMutation.mutate({ id: p.id, status: "FAILED" })}
                              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg touch-manipulation">Failed</button>
                          </div>
                        )}'''

if old2 in c:
    c = c.replace(old2, new2, 1)
    open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
    print('Frontend done')
else:
    print('ERROR: payout buttons string not found')
