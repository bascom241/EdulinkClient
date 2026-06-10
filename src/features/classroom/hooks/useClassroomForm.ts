// hooks/useClassroomForm.ts
import { useState } from "react";
import { ClassLocation } from "../../../types/classroomTypes";

type ClassLocationValue = (typeof ClassLocation)[keyof typeof ClassLocation];

export const initialFormData = {
  name: "",
  description: "",

  startDate: "",
  endDate: "",

  price: 0,
  maximumStudent: 30,

  classLevel: "",

  location: ClassLocation.ONLINE as ClassLocationValue,

  category: "",
  level: "BEGINNER",

  // ONLINE LINKS
  defaultLink: "",
  otherLinks: [] as string[],

  // PHYSICAL LOCATION
  physicalAddress: "",
  latitude: "",
  longitude: "",
};

export const useClassroomForm = () => {
  const [formData, setFormData] =
    useState(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "maximumStudent"
          ? Number(value)
          : value,
    }));
  };

  const handleOtherLinkChange = (
    index: number,
    value: string
  ) => {
    const updatedLinks = [...formData.otherLinks];

    updatedLinks[index] = value;

    setFormData((prev) => ({
      ...prev,
      otherLinks: updatedLinks,
    }));
  };

  const addNewLink = () => {
    setFormData((prev) => ({
      ...prev,
      otherLinks: [...prev.otherLinks, ""],
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleOtherLinkChange,
    addNewLink,
    resetForm,
  };
};
