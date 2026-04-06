f = open('api/src/revenue/revenue.controller.ts', 'r', encoding='utf-8')
c = f.read()
f.close()

c = c.replace(
    '''  @Post("commissions/:appointmentId/record")
  recordCommission(@Param("appointmentId") appointmentId: string) {
    return this.service.recordCommission(appointmentId);
  }
}''',
    '''  @Post("payouts/:id/resend-stk")
  resendStkPush(@Param("id") id: string) {
    return this.service.resendStkPush(id);
  }
  @Post("commissions/:appointmentId/record")
  recordCommission(@Param("appointmentId") appointmentId: string) {
    return this.service.recordCommission(appointmentId);
  }
}'''
)

open('api/src/revenue/revenue.controller.ts', 'w', encoding='utf-8').write(c)
print('Controller done' if 'resend-stk' in c else 'ERROR')
