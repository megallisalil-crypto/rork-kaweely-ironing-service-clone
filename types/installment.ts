export type InstallmentProvider = "valU" | "souhoola" | "sympl" | "tabby" | "contact" | "forsa" | "premium_card";

export type InstallmentPlan = {
  id: string;
  provider: InstallmentProvider;
  providerName: string;
  months: number;
  monthlyAmount: number;
  totalAmount: number;
  downPayment: number;
  adminFee: number;
  interestRate: number;
  description: string;
  logo: string;
  color: string;
  features: string[];
  approvalTime: string;
  minPurchase: number;
  maxPurchase: number;
};

export type InstallmentApplication = {
  id: string;
  provider: InstallmentProvider;
  planId: string;
  subscriptionPlanId: string;
  subscriptionPlanTitle: string;
  subscriptionPrice: number;
  installmentMonths: number;
  monthlyPayment: number;
  downPayment: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  appliedDate: Date;
  approvedDate?: Date;
  nextPaymentDate?: Date;
  paidInstallments: number;
  remainingInstallments: number;
};
