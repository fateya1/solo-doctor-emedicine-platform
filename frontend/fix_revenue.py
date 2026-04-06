f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

c = c.replace('icon: DollarSign', 'icon: Banknote')

REVENUE_PANEL = """
        {/* Revenue Tab */}
        {tab === "revenue" && (
          <div className="space-y-6">
            {revenueSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Total Revenue", value: `KES ${Number(revenueSummary.totalRevenue ?? 0).toLocaleString()}`, color: "bg-green-50 text-green-600", icon: TrendingUp },
                  { label: "This Month", value: `KES ${Number(revenueSummary.revenueThisMonth ?? 0).toLocaleString()}`, color: "bg-brand-50 text-brand-600", icon: Activity },
                  { label: "Platform Commission", value: `KES ${Number(revenueSummary.platformCommission ?? 0).toLocaleString()}`, color: "bg-purple-50 text-purple-600", icon: Banknote },
                  { label: "Total Payouts", value: `KES ${Number(revenueSummary.totalPayouts ?? 0).toLocaleString()}`, color: "bg-blue-50 text-blue-600", icon: CreditCard },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="card">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 break-words">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-brand-600" /> Doctor Earnings
              </h2>
              {!doctorEarnings?.length ? (
                <p className="text-slate-400 text-sm">No earnings data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-100">
                        <th className="text-left pb-3 font-medium">Doctor</th>
                        <th className="text-right pb-3 font-medium">Completed</th>
                        <th className="text-right pb-3 font-medium">Gross (KES)</th>
                        <th className="text-right pb-3 font-medium">Commission (KES)</th>
                        <th className="text-right pb-3 font-medium">Net (KES)</th>
                        <th className="text-right pb-3 font-medium">Paid Out (KES)</th>
                        <th className="text-right pb-3 font-medium">Pending (KES)</th>
                        <th className="pb-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {doctorEarnings.map((d: any) => (
                        <tr key={d.doctorProfileId} className="hover:bg-slate-50">
                          <td className="py-3 font-medium text-slate-800">{d.doctorName}</td>
                          <td className="py-3 text-right text-slate-600">{d.completedAppointments}</td>
                          <td className="py-3 text-right text-slate-600">{Number(d.grossRevenue).toLocaleString()}</td>
                          <td className="py-3 text-right text-purple-600">{Number(d.platformCommission).toLocaleString()}</td>
                          <td className="py-3 text-right text-green-600 font-medium">{Number(d.netEarnings).toLocaleString()}</td>
                          <td className="py-3 text-right text-blue-600">{Number(d.totalPaidOut ?? 0).toLocaleString()}</td>
                          <td className="py-3 text-right text-amber-600 font-medium">{Number(d.pendingPayout ?? 0).toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => setPayoutModal({ doctorProfileId: d.doctorProfileId, doctorName: d.doctorName })}
                              className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-lg font-medium touch-manipulation">
                              Pay out
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-brand-600" /> Payout History
              </h2>
              {!payouts?.length ? (
                <p className="text-slate-400 text-sm">No payouts recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {payouts.map((p: any) => (
                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.doctorName ?? "Doctor"}</p>
                        <p className="text-xs text-slate-500">KES {Number(p.amount).toLocaleString()} · {p.mpesaReceiptNo ?? "Pending receipt"} · {p.createdAt ? format(new Date(p.createdAt), "MMM d, yyyy") : "—"}</p>
                        {p.notes && <p className="text-xs text-slate-400 mt-0.5">{p.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === "COMPLETED" ? "bg-green-50 text-green-700" : p.status === "FAILED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
                        {p.status === "PENDING" && (
                          <div className="flex gap-1">
                            <button onClick={() => { const r = prompt("M-Pesa receipt:"); if (r) updatePayoutMutation.mutate({ id: p.id, status: "COMPLETED", mpesaReceiptNo: r }); }}
                              className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1 rounded-lg touch-manipulation">Mark paid</button>
                            <button onClick={() => updatePayoutMutation.mutate({ id: p.id, status: "FAILED" })}
                              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg touch-manipulation">Failed</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {payoutModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-semibold text-slate-900 mb-1">Create Payout</h3>
              <p className="text-sm text-slate-500 mb-4">Doctor: <strong>{payoutModal.doctorName}</strong></p>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-slate-600 block mb-1">Amount (KES)</label>
                  <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} className="input w-full" placeholder="e.g. 5000" /></div>
                <div><label className="text-xs font-medium text-slate-600 block mb-1">M-Pesa Phone</label>
                  <input type="tel" value={payoutPhone} onChange={(e) => setPayoutPhone(e.target.value)} className="input w-full" placeholder="2547XXXXXXXX" /></div>
                <div><label className="text-xs font-medium text-slate-600 block mb-1">Period Start</label>
                  <input type="date" id="periodStart" className="input w-full" /></div>
                <div><label className="text-xs font-medium text-slate-600 block mb-1">Period End</label>
                  <input type="date" id="periodEnd" className="input w-full" /></div>
                <div><label className="text-xs font-medium text-slate-600 block mb-1">Notes (optional)</label>
                  <input type="text" value={payoutNotes} onChange={(e) => setPayoutNotes(e.target.value)} className="input w-full" placeholder="Any notes..." /></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => {
                    const ps = (document.getElementById("periodStart") as HTMLInputElement)?.value;
                    const pe = (document.getElementById("periodEnd") as HTMLInputElement)?.value;
                    if (!payoutAmount || !payoutPhone || !ps || !pe) return alert("Fill all required fields.");
                    createPayoutMutation.mutate({ doctorProfileId: payoutModal.doctorProfileId, amount: Number(payoutAmount), periodStart: new Date(ps).toISOString(), periodEnd: new Date(pe).toISOString(), phoneNumber: payoutPhone, notes: payoutNotes || undefined });
                  }} disabled={createPayoutMutation.isPending}
                  className="btn-primary flex-1 flex items-center justify-center gap-1.5 touch-manipulation">
                  {createPayoutMutation.isPending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Send Payout
                </button>
                <button onClick={() => setPayoutModal(null)} className="btn-secondary touch-manipulation">Cancel</button>
              </div>
            </div>
          </div>
        )}
"""

old_end = '      </div>\n    </div>\n  );\n}'
new_end = REVENUE_PANEL + '      </div>\n    </div>\n  );\n}'

if old_end in c:
    c = c.replace(old_end, new_end, 1)
    open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
    print('Done')
else:
    print('ERROR: closing tags not found')
