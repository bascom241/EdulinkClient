import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/ui/Loader";
import { useVerifyPayment } from "../../features/payment/hooks/usePayment";
import { getApiErrorMessage } from "../../utils/apiError";
import { classroomKeys } from "../../features/classroom/classroomKeys";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const verifyPayment = useVerifyPayment();
  const hasVerified = useRef(false);

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transaction_reference");

    if (!reference) {
      toast.error("Payment reference was not found");
      navigate("/dashboard/student/marketplace", { replace: true });
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyPayment.mutate(reference, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [...classroomKeys.all, "student-classrooms"],
        });
        queryClient.invalidateQueries({
          queryKey: [...classroomKeys.all, "marketplace"],
        });
        toast.success("Payment confirmed. Class joined successfully.");
        navigate(`/dashboard/student/my-classes/${data?.classroom}`, {
          replace: true,
        });
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, "Payment could not be verified"));
        navigate("/dashboard/student/marketplace", { replace: true });
      },
    });
  }, [navigate, queryClient, searchParams, verifyPayment]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <Loader size="lg" message="Confirming your payment..." />
        <p className="mt-4 text-sm text-gray-500">
          Please wait while EduLink adds the class to your dashboard.
        </p>
      </section>
    </main>
  );
};

export default PaymentCallback;
