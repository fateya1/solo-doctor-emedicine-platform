lines = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8').readlines()

new_subs = '''        {/* Subscriptions */}
        {tab === "subscriptions" && (
          <div className="space-y-5">
            {subscriptions?.length > 0 && (() => {
              const totalCollected = subscriptions.reduce((sum: number, s: any) =>
                sum + (s.payments ?? []).filter((p: any) => p.status === "COMPLETED").reduce((ps: number, p: any) => ps + Number(p.amount), 0), 0);
              const totalPending = subscriptions.reduce((sum: number, s: any) =>
                sum + (s.payments ?? []).filter((p: any) => p.status === "PENDING").reduce((ps: number, p: any) => ps + Number(p.amount), 0), 0);
              const activeCount = subscriptions.filter((s: any) => s.status === "ACTIVE").length;
              const trialCount = subscriptions.filter((s: any) => s.status === "TRIAL").length;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Total Collected", value: `KES ${totalCollected.toLocaleString()}`, color: "bg-green-50 text-green-600", icon: TrendingUp },
                    { label: "Pending Payments", value: `KES ${totalPending.toLocaleString()}`, color: "bg-amber-50 text-amber-600", icon: Clock },
                    { label: "Active Subscriptions", value: activeCount, color: "bg-blue-50 text-blue-600", icon: CheckCircle },
                    { label: "On Trial", value: trialCount, color: "bg-purple-50 text-purple-600", icon: Activity },
                  ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="card">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-5">All Subscriptions ({subscriptions?.length ?? 0})</h2>
              <div className="space-y-3">
                {subscriptions?.map((s: any) => {
                  const completedPayments = (s.payments ?? []).filter((p: any) => p.status === "COMPLETED");
                  const totalPaid = completedPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
                  const lastPayment = s.payments?.[0];
                  return (
                    <div key={s.id} className="bg-slate-50 rounded-xl overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{s.tenant?.name}</p>
                          <p className="text-xs text-slate-500">
                            Period: {format(new Date(s.currentPeriodStart), "MMM d")} {"-"} {format(new Date(s.currentPeriodEnd), "MMM d, yyyy")}
                          </p>
                          <div className="flex gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-green-700 font-medium">KES {totalPaid.toLocaleString()} collected</span>
                            {lastPayment && (
                              <span className="text-xs text-slate-400">
                                Last: KES {Number(lastPayment.amount).toLocaleString()} {"\u00b7"} {lastPayment.paidAt ? format(new Date(lastPayment.paidAt), "MMM d, yyyy") : lastPayment.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${planColor[s.plan] ?? "bg-slate-100 text-slate-500"}`}>{s.plan}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[s.status] ?? "bg-slate-100 text-slate-500"}`}>{s.status}</span>
                        </div>
                      </div>
                      {s.payments?.length > 0 && (
                        <div className="border-t border-slate-100 px-4 pb-3 pt-2 space-y-1.5">
                          {s.payments.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">KES {Number(p.amount).toLocaleString()} {"\u00b7"} {p.plan} {"\u00b7"} {p.mpesaReceiptNo ?? "No receipt"}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{p.paidAt ? format(new Date(p.paidAt), "MMM d, yyyy") : p.createdAt ? format(new Date(p.createdAt), "MMM d, yyyy") : "-"}</span>
                                <span className={`px-2 py-0.5 rounded-full font-medium ${p.status === "COMPLETED" ? "bg-green-50 text-green-700" : p.status === "FAILED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {!subscriptions?.length && <p className="text-slate-400 text-sm">No subscriptions yet.</p>}
              </div>
            </div>
          </div>
        )}
'''

# Replace lines 471-501 (0-indexed 470-500), keep 501 onward (audit-logs line)
result = lines[:470] + [new_subs] + lines[501:]
open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').writelines(result)
print('Done')
