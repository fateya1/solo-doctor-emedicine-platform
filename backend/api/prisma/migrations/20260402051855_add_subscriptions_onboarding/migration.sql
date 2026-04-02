-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('PROFILE', 'DOCUMENTS', 'PAYMENT', 'COMPLETE');

-- AlterTable
ALTER TABLE "doctor_profiles" ADD COLUMN     "licenseDocument" TEXT,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'PROFILE';

-- CreateTable
CREATE TABLE "tenant_subscriptions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "mpesaRef" TEXT,
    "mpesaReceiptNo" TEXT,
    "phoneNumber" TEXT,
    "plan" "SubscriptionPlan" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_subscriptions_tenantId_key" ON "tenant_subscriptions"("tenantId");

-- AddForeignKey
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "tenant_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
