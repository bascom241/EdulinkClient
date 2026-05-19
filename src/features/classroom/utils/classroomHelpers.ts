export const generateDisplayId = (mongoId: string) => {
  const shortId =
    mongoId.substring(0, 4) +
    mongoId.substring(mongoId.length - 4);

  const num = parseInt(shortId, 16) % 10000;

  return `CL-${num.toString().padStart(4, "0")}`;
};

export const getInitials = (name: string) => {
  const words = name.split(" ");

  if (words.length > 1) {
    return (
      words[0][0] + words[1][0]
    ).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
};

export const getStatusText = (
  isFull: boolean,
  endDate: string
) => {
  const now = new Date();
  const end = new Date(endDate);

  if (end < now) return "Archived";

  if (isFull) return "Suspended";

  return "Active";
};

export const getStatusStyles = (
  isFull: boolean,
  endDate: string
) => {
  const now = new Date();
  const end = new Date(endDate);

  if (end < now) {
    return "bg-gray-50 text-gray-500 border-gray-100";
  }

  if (isFull) {
    return "bg-amber-50 text-amber-600 border-amber-100";
  }

  return "bg-green-50 text-[#10b981] border-green-100";
};