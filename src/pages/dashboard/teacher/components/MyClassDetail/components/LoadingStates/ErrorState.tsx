import { HiOutlineExclamationCircle } from "react-icons/hi";

type Props = {
  type: "not-found" | "error";
  onBack: () => void;
};

const ErrorState = ({ type, onBack }: Props) => {
  const isNotFound = type === "not-found";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiOutlineExclamationCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isNotFound ? "Class Not Found" : "Error Loading Class"}
        </h2>
        <p className="text-gray-500 mb-6">
          {isNotFound
            ? "The class you are looking for does not exist."
            : "There was an error loading the class details."}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          Back to Classes
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
