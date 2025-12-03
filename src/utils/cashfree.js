export async function launchCashfree(paymentSessionId, returnUrl) {
  await window.loadCashfreeSDK();

  const cf = window.Cashfree;
  if (!cf) {
    throw new Error("Cashfree SDK not loaded");
  }

  return cf.checkout({
    paymentSessionId,
    redirectTarget: "_self",
    returnUrl,
  });
}
