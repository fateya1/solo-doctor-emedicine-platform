f = open('src/app/dashboard/admin/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''                          <td className="py-3 text-right">
                            <button onClick={() => setPayoutModal({ doctorProfileId: d.doctorProfileId, doctorName: d.fullName })}
                              className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-lg font-medium touch-manipulation">
                              Pay out
                            </button>
                          </td>'''

new = '''                          <td className="py-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => setPayoutModal({ doctorProfileId: d.doctorProfileId, doctorName: d.fullName })}
                                className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-lg font-medium touch-manipulation">
                                Pay out
                              </button>
                              <button onClick={() => toggleUserMutation.mutate(d.userId)}
                                disabled={toggleUserMutation.isPending}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium touch-manipulation ${d.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                                {d.isActive ? "Suspend" : "Activate"}
                              </button>
                            </div>
                          </td>'''

if old in c:
    c = c.replace(old, new, 1)
    open('src/app/dashboard/admin/page.tsx', 'w', encoding='utf-8').write(c)
    print('Frontend done')
else:
    print('ERROR: string not found')
