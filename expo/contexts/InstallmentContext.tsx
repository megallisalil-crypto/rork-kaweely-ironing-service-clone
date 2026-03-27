import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { InstallmentApplication } from "@/types/installment";

const INSTALLMENTS_STORAGE_KEY = "kaweely_installments";

export const [InstallmentProvider, useInstallment] = createContextHook(() => {
  const [installments, setInstallments] = useState<InstallmentApplication[]>([]);

  const installmentsQuery = useQuery({
    queryKey: ["installments"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(INSTALLMENTS_STORAGE_KEY);
        console.log("[InstallmentContext] Loading installments from storage");
        
        if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '') {
          console.log("[InstallmentContext] No installments data found");
          return [];
        }
        
        const trimmedStored = stored.trim();
        
        if (!trimmedStored.startsWith('[')) {
          console.warn("[InstallmentContext] Stored value is not valid JSON array, clearing");
          await AsyncStorage.removeItem(INSTALLMENTS_STORAGE_KEY);
          return [];
        }
        
        try {
          const parsed = JSON.parse(trimmedStored);
          if (!Array.isArray(parsed)) {
            console.warn("[InstallmentContext] Parsed data is not an array, clearing");
            await AsyncStorage.removeItem(INSTALLMENTS_STORAGE_KEY);
            return [];
          }
          
          const installmentsWithDates = parsed.map((inst: InstallmentApplication) => ({
            ...inst,
            appliedDate: new Date(inst.appliedDate),
            approvedDate: inst.approvedDate ? new Date(inst.approvedDate) : undefined,
            nextPaymentDate: inst.nextPaymentDate ? new Date(inst.nextPaymentDate) : undefined,
          }));
          
          console.log("[InstallmentContext] Successfully loaded installments");
          return installmentsWithDates as InstallmentApplication[];
        } catch (parseError) {
          console.error("[InstallmentContext] JSON Parse error:", parseError);
          await AsyncStorage.removeItem(INSTALLMENTS_STORAGE_KEY);
          return [];
        }
      } catch (error) {
        console.error("[InstallmentContext] Error loading installments:", error);
        await AsyncStorage.removeItem(INSTALLMENTS_STORAGE_KEY);
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedInstallments: InstallmentApplication[]) => {
      try {
        const jsonString = JSON.stringify(updatedInstallments);
        console.log('[InstallmentContext] Syncing installments');
        await AsyncStorage.setItem(INSTALLMENTS_STORAGE_KEY, jsonString);
        return updatedInstallments;
      } catch (error) {
        console.error('[InstallmentContext] Error syncing installments:', error);
        return updatedInstallments;
      }
    },
  });

  const { mutate: syncInstallments } = syncMutation;

  useEffect(() => {
    if (installmentsQuery.data !== undefined) {
      setInstallments(installmentsQuery.data);
    }
  }, [installmentsQuery.data]);

  const applyForInstallment = useCallback((application: Omit<InstallmentApplication, 'id' | 'appliedDate' | 'status' | 'paidInstallments' | 'remainingInstallments'>) => {
    const now = new Date();
    
    const newInstallment: InstallmentApplication = {
      ...application,
      id: Date.now().toString(),
      appliedDate: now,
      status: "pending",
      paidInstallments: 0,
      remainingInstallments: application.installmentMonths,
    };

    console.log("[InstallmentContext] Applying for installment:", newInstallment);
    const updatedInstallments = [...installments, newInstallment];
    setInstallments(updatedInstallments);
    syncInstallments(updatedInstallments);
    return newInstallment;
  }, [installments, syncInstallments]);

  const approveInstallment = useCallback((installmentId: string) => {
    const now = new Date();
    const nextPaymentDate = new Date(now);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    const updatedInstallments = installments.map(inst => 
      inst.id === installmentId 
        ? { 
            ...inst, 
            status: "approved" as const, 
            approvedDate: now,
            nextPaymentDate: nextPaymentDate,
          } 
        : inst
    );
    
    console.log("[InstallmentContext] Approving installment:", installmentId);
    setInstallments(updatedInstallments);
    syncInstallments(updatedInstallments);
  }, [installments, syncInstallments]);

  const payInstallment = useCallback((installmentId: string) => {
    const updatedInstallments = installments.map(inst => {
      if (inst.id === installmentId && inst.status === "approved") {
        const paidInstallments = inst.paidInstallments + 1;
        const remainingInstallments = inst.remainingInstallments - 1;
        const nextPaymentDate = remainingInstallments > 0 
          ? new Date(inst.nextPaymentDate || new Date())
          : undefined;
        
        if (nextPaymentDate && remainingInstallments > 0) {
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        }
        
        return {
          ...inst,
          paidInstallments,
          remainingInstallments,
          nextPaymentDate,
          status: remainingInstallments === 0 ? "completed" as const : inst.status,
        };
      }
      return inst;
    });
    
    console.log("[InstallmentContext] Paying installment:", installmentId);
    setInstallments(updatedInstallments);
    syncInstallments(updatedInstallments);
  }, [installments, syncInstallments]);

  const activeInstallments = useMemo(
    () => installments.filter(inst => inst.status === "approved" || inst.status === "pending"),
    [installments]
  );

  return useMemo(
    () => ({
      installments,
      activeInstallments,
      isLoading: installmentsQuery.isLoading,
      applyForInstallment,
      approveInstallment,
      payInstallment,
    }),
    [installments, activeInstallments, installmentsQuery.isLoading, applyForInstallment, approveInstallment, payInstallment]
  );
});
