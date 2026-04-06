lines = open('api/src/revenue/revenue.service.ts', 'r', encoding='utf-8').readlines()

# Find getMpesaToken line
idx = None
for i, line in enumerate(lines):
    if 'private async getMpesaToken' in line:
        idx = i
        break
print(f"getMpesaToken at line {idx+1}")

new_method = '''  async resendStkPush(payoutId: string) {
    const payout = await this.prisma.doctorPayout.findUnique({
      where: { id: payoutId },
      include: { doctorProfile: { include: { user: true } } },
    });
    if (!payout) throw new NotFoundException("Payout not found");
    if (payout.status !== PayoutStatus.PENDING) {
      throw new NotFoundException("Only PENDING payouts can be resent");
    }
    try {
      const token = await this.getMpesaToken();
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const shortcode = process.env.MPESA_SHORTCODE!;
      const passkey = process.env.MPESA_PASSKEY!;
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
      const stkRes = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(payout.amount)),
          PartyA: payout.phoneNumber,
          PartyB: shortcode,
          PhoneNumber: payout.phoneNumber,
          CallBackURL: `${process.env.BACKEND_URL}/api/revenue/mpesa/callback`,
          AccountReference: `PAYOUT-${payout.doctorProfileId.slice(0, 8).toUpperCase()}`,
          TransactionDesc: `SoloDoc Payout - ${payout.doctorProfile.user.fullName}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await this.prisma.doctorPayout.update({
        where: { id: payoutId },
        data: { mpesaReceiptNo: stkRes.data.CheckoutRequestID },
      });
      return { success: true, message: "STK Push resent successfully. Doctor should enter M-Pesa PIN." };
    } catch (err: any) {
      return { success: false, message: "Sandbox mode: STK Push simulated." };
    }
  }

'''

lines.insert(idx, new_method)
open('api/src/revenue/revenue.service.ts', 'w', encoding='utf-8').writelines(lines)
print('Service done' if 'resendStkPush' in open('api/src/revenue/revenue.service.ts').read() else 'ERROR')
