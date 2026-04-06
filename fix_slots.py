f = open('backend/api/src/revenue/revenue.service.ts', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''        appointments: {
          where: { status: AppointmentStatus.COMPLETED },
          select: { id: true },
        },
        commissions: {'''

new = '''        availabilitySlots: {
          include: {
            appointment: {
              select: { id: true, status: true },
            },
          },
        },
        commissions: {'''

c = c.replace(old, new, 1)

old2 = '''      const fee = Number(d.consultationFee ?? 0);
      const completedCount = d.appointments.length;'''

new2 = '''      const fee = Number(d.consultationFee ?? 0);
      const completedCount = d.availabilitySlots.filter(
        (s) => s.appointment?.status === "COMPLETED"
      ).length;'''

c = c.replace(old2, new2, 1)

open('backend/api/src/revenue/revenue.service.ts', 'w', encoding='utf-8').write(c)
print('Done' if 'availabilitySlots' in c else 'ERROR')
