lines = open('api/src/revenue/revenue.service.ts', 'r', encoding='utf-8').readlines()

new_func = '''  async getDoctorEarnings() {
    const doctors = await this.prisma.doctorProfile.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        availabilitySlots: {
          include: {
            appointment: { select: { id: true, status: true } },
          },
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
      const completedCount = d.availabilitySlots.filter(
        (s) => s.appointment?.status === "COMPLETED"
      ).length;
      const grossRevenue = completedCount * fee;
      const totalCommissionsPaid = d.commissions.length > 0
        ? d.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0)
        : Math.round(grossRevenue * 0.15);
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
        grossRevenue,
        totalEarnings,
        totalCommissionsPaid,
        totalPaidOut,
        pendingPayoutAmount: pendingPayout ? Number(pendingPayout.amount) : 0,
        lastPayoutDate: lastPayout?.processedAt ?? null,
        lastPayoutAmount: lastPayout ? Number(lastPayout.amount) : 0,
        lastPayoutStatus: lastPayout?.status ?? null,
      };
    });
  }
'''

# Replace lines 104-139 (0-indexed: 103-138)
result = lines[:103] + [new_func] + lines[139:]
open('api/src/revenue/revenue.service.ts', 'w', encoding='utf-8').writelines(result)
print('Done')
