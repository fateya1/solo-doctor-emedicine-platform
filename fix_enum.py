f = open('backend/api/src/revenue/revenue.service.ts', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix 1: import AppointmentStatus alongside PayoutStatus
c = c.replace(
    'import { PayoutStatus } from "@prisma/client";',
    'import { AppointmentStatus, PayoutStatus } from "@prisma/client";'
)

# Fix 2: use enum instead of raw string
c = c.replace(
    'where: { status: "COMPLETED" },\n          select: { id: true },',
    'where: { status: AppointmentStatus.COMPLETED },\n          select: { id: true },'
)

open('backend/api/src/revenue/revenue.service.ts', 'w', encoding='utf-8').write(c)
print('Done' if 'AppointmentStatus' in c else 'ERROR')
