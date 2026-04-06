f = open('backend/api/src/revenue/revenue.service.ts', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''  async getDoctorEarnings() {
    const doctors = await this.prisma.doctorProfile.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        commissions: {
          select: { doctorEarning: true, commissionAmount: true, createdAt: true },
        },
        payouts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    return doctors.map((d) => {
      const totalEarnings = d.commissions.reduce((sum, c) => sum + Number(c.doctorEarning), 0);
      const totalCommissionsPaid = d.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0);
      const lastPayout = d.payouts[0] ?? null;
      const pendingPayout = d.payouts.find((p) => p.status === PayoutStatus.PENDING);
      return {
        doctorProfileId: d.id,
        fullName: d.user.fullName,
        email: d.user.email,
        specialty: d.specialty,
        consultationFee: Number(d.consultationFee ?? 0),
        totalAppointments: d.commissions.length,
        totalEarnings,
        totalCommissionsPaid,
        pendingPayoutAmount: pendingPayout ? Number(pendingPayout.amount) : 0,
        lastPayoutDate: lastPayout?.processedAt ?? null,
        lastPayoutAmount: lastPayout ? Number(lastPayout.amount) : 0,
        lastPayoutStatus: lastPayout?.status ?? null,
      };
    });
  }'''

new = '''  async getDoctorEarnings() {
    const doctors = await this.prisma.doctorProfile.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        appointments: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
        commissions: {
          select: { doctorEarning: true, commissionAmount: true },
        },
        payouts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return doctors.map((d) => {
      const fee = Number(d.consultationFee ?? 0);
      const completedCount = d.appointments.length;
      const grossRevenue = completedCount * fee;
      const commissionRate = 0.15;
      const totalCommissionsPaid = d.commissions.length > 0
        ? d.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0)
        : Math.round(grossRevenue * commissionRate);
      const totalEarnings = d.commissions.length > 0
        ? d.commissions.reduce((sum, c) => sum + Number(c.doctorEarning), 0)
        : grossRevenue - totalCommissionsPaid;
      const lastPayout = d.payouts[0] ?? null;
      const pendingPayout = d.payouts.find((p) => p.status === PayoutStatus.PENDING);
      const totalPaidOut = d.payouts
        .filter((p) => p.status === PayoutStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      return {
        doctorProfileId: d.id,
        fullName: d.user.fullName,
        email: d.user.email,
        specialty: d.specialty,
        consultationFee: fee,
        totalAppointments: completedCount,
        totalEarnings,
        totalCommissionsPaid,
        pendingPayoutAmount: pendingPayout ? Number(pendingPayout.amount) : 0,
        lastPayoutDate: lastPayout?.processedAt ?? null,
        lastPayoutAmount: lastPayout ? Number(lastPayout.amount) : 0,
        lastPayoutStatus: lastPayout?.status ?? null,
        totalPaidOut,
      };
    });
  }'''

if old in c:
    c = c.replace(old, new, 1)
    open('backend/api/src/revenue/revenue.service.ts', 'w', encoding='utf-8').write(c)
    print('Backend done')
else:
    print('ERROR: string not found')
