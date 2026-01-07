import { InstallmentPlan } from "@/types/installment";

export const installmentProviders: InstallmentPlan[] = [
  {
    id: "valu-6",
    provider: "valU",
    providerName: "valU",
    months: 6,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 50,
    interestRate: 1.75,
    description: "Egypt's #1 Buy Now Pay Later",
    logo: "💳",
    color: "#E53E3E",
    features: [
      "No down payment required",
      "Instant approval in minutes",
      "Flexible payment terms",
      "0% interest on selected plans"
    ],
    approvalTime: "2-5 minutes",
    minPurchase: 500,
    maxPurchase: 50000,
  },
  {
    id: "valu-12",
    provider: "valU",
    providerName: "valU",
    months: 12,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 50,
    interestRate: 2.25,
    description: "Egypt's #1 Buy Now Pay Later",
    logo: "💳",
    color: "#E53E3E",
    features: [
      "Lower monthly payments",
      "Instant approval in minutes",
      "Flexible payment terms",
      "Trusted by millions"
    ],
    approvalTime: "2-5 minutes",
    minPurchase: 1000,
    maxPurchase: 50000,
  },
  {
    id: "souhoola-6",
    provider: "souhoola",
    providerName: "Souhoola",
    months: 6,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 45,
    interestRate: 1.65,
    description: "Smart payment solutions",
    logo: "🏦",
    color: "#38A169",
    features: [
      "Quick digital approval",
      "No hidden fees",
      "Easy monthly payments",
      "Secure transactions"
    ],
    approvalTime: "3-10 minutes",
    minPurchase: 500,
    maxPurchase: 40000,
  },
  {
    id: "souhoola-12",
    provider: "souhoola",
    providerName: "Souhoola",
    months: 12,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 45,
    interestRate: 2.15,
    description: "Smart payment solutions",
    logo: "🏦",
    color: "#38A169",
    features: [
      "Extended payment period",
      "No hidden fees",
      "Easy monthly payments",
      "Flexible terms"
    ],
    approvalTime: "3-10 minutes",
    minPurchase: 1000,
    maxPurchase: 40000,
  },
  {
    id: "sympl-4",
    provider: "sympl",
    providerName: "Sympl",
    months: 4,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 30,
    interestRate: 0,
    description: "Pay in 4 interest-free",
    logo: "✨",
    color: "#805AD5",
    features: [
      "0% interest",
      "Pay in 4 installments",
      "Instant approval",
      "No credit check needed"
    ],
    approvalTime: "Instant",
    minPurchase: 300,
    maxPurchase: 20000,
  },
  {
    id: "tabby-4",
    provider: "tabby",
    providerName: "Tabby",
    months: 4,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 0,
    interestRate: 0,
    description: "Split in 4, interest-free",
    logo: "🌟",
    color: "#3182CE",
    features: [
      "0% interest, 0% fees",
      "Split in 4 payments",
      "Instant decision",
      "Shop now, pay later"
    ],
    approvalTime: "Instant",
    minPurchase: 200,
    maxPurchase: 15000,
  },
  {
    id: "contact-12",
    provider: "contact",
    providerName: "Contact",
    months: 12,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 60,
    interestRate: 2.5,
    description: "Premium installment plans",
    logo: "🎯",
    color: "#DD6B20",
    features: [
      "Premium service",
      "Dedicated support",
      "Flexible terms",
      "Fast approval"
    ],
    approvalTime: "5-15 minutes",
    minPurchase: 1000,
    maxPurchase: 60000,
  },
  {
    id: "forsa-6",
    provider: "forsa",
    providerName: "Forsa",
    months: 6,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 40,
    interestRate: 1.55,
    description: "Easy installment solutions",
    logo: "💫",
    color: "#D69E2E",
    features: [
      "Low interest rates",
      "Quick approval",
      "Transparent pricing",
      "Trusted platform"
    ],
    approvalTime: "2-7 minutes",
    minPurchase: 500,
    maxPurchase: 35000,
  },
  {
    id: "premium_card-12",
    provider: "premium_card",
    providerName: "Premium Card",
    months: 12,
    monthlyAmount: 0,
    totalAmount: 0,
    downPayment: 0,
    adminFee: 75,
    interestRate: 2.75,
    description: "Premium credit solutions",
    logo: "💎",
    color: "#9F7AEA",
    features: [
      "High credit limits",
      "VIP support",
      "Exclusive benefits",
      "Premium service"
    ],
    approvalTime: "10-30 minutes",
    minPurchase: 2000,
    maxPurchase: 100000,
  },
];

export function calculateInstallment(
  basePrice: number,
  months: number,
  interestRate: number,
  adminFee: number,
  downPayment: number = 0
): {
  monthlyAmount: number;
  totalAmount: number;
  totalInterest: number;
} {
  const principalAmount = basePrice - downPayment;
  const monthlyInterest = (interestRate / 100);
  const totalInterest = principalAmount * monthlyInterest * months;
  const totalAmount = principalAmount + totalInterest + adminFee;
  const monthlyAmount = totalAmount / months;

  return {
    monthlyAmount: Math.round(monthlyAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

export function getInstallmentPlansForPrice(price: number): InstallmentPlan[] {
  return installmentProviders
    .filter(plan => price >= plan.minPurchase && price <= plan.maxPurchase)
    .map(plan => {
      const calculated = calculateInstallment(
        price,
        plan.months,
        plan.interestRate,
        plan.adminFee,
        plan.downPayment
      );
      return {
        ...plan,
        monthlyAmount: calculated.monthlyAmount,
        totalAmount: calculated.totalAmount,
      };
    })
    .sort((a, b) => a.monthlyAmount - b.monthlyAmount);
}
