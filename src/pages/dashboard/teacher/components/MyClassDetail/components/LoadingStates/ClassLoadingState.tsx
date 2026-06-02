import Loader from "../../../../../../../components/ui/Loader";

const ClassLoadingState = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" message="Loading class details..." />
    </div>
  );
};

export default ClassLoadingState;
