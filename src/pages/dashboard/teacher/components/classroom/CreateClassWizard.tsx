// components/classroom/CreateClassWizard.tsx
import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    AcademicCapIcon,
    LinkIcon,
    MapPinIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import Input from "../../../../../components/ui/Input";
import { ClassLevel, ClassLocation } from "../../../../../types/classroomTypes";
import MapPicker from "./MapPicker";
import { useGetClassRoomCategory } from "../../../../../features/classroom/hooks/useTeacher";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    formData: any;
    handleInputChange: any;
    handleSubmit: any;
    isPending: boolean;
    handleOtherLinkChange: any;
    addNewLink: any;
};

const CreateClassWizard = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleSubmit,
    isPending,
    handleOtherLinkChange,
    addNewLink,
}: Props) => {
    const [step, setStep] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { data, isPending: fetchingClassCat } = useGetClassRoomCategory();
    console.log(fetchingClassCat)
    console.log(data)
    const totalSteps = 3;

    // Auto-fill coordinates when location is selected on map
    useEffect(() => {
        if (selectedLocation) {
            handleInputChange({
                target: {
                    name: 'latitude',
                    value: selectedLocation.lat.toString()
                }
            });
            handleInputChange({
                target: {
                    name: 'longitude',
                    value: selectedLocation.lng.toString()
                }
            });
        }
    }, [selectedLocation]);

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === totalSteps) {
            handleSubmit(e);
        } else {
            nextStep();
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.name && formData.description && formData.price && formData.maximumStudent;
            case 2:
                if (formData.location === ClassLocation.ONLINE) {
                    return formData.defaultLink;
                } else {
                    return formData.physicalAddress;
                }
            case 3:
                return true;
            default:
                return false;
        }
    };



    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                {/* Progress Bar */}
                                <div className="px-6 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3].map((s) => (
                                                    <div
                                                        key={s}
                                                        className={`h-2 w-12 rounded-full transition-all ${s <= step ? "bg-emerald-500" : "bg-gray-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Step {step} of {totalSteps}
                                            </span>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="border-b border-gray-200 px-6 pb-4">
                                    <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                                        {step === 1 && "Basic Information"}
                                        {step === 2 && "Location Details"}
                                        {step === 3 && "Review & Create"}
                                    </Dialog.Title>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {step === 1 && "Tell us about your classroom basics"}
                                        {step === 2 && "Set up where your class will take place"}
                                        {step === 3 && "Review all information before creating"}
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleFormSubmit} className="p-6">
                                    {/* Step 1: Basic Information */}
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Mathematics 101"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Category <span className="text-red-500">*</span>
                                                    </label>

                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleInputChange}
                                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select Category
                                                        </option>

                                                        {data?.map((category: any) => (
                                                            <option
                                                                key={category._id}
                                                                value={category._id}
                                                            >
                                                                {category.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Price (₦) <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        name="price"
                                                        value={formData.price || ""}
                                                        onChange={handleInputChange}
                                                        placeholder="1000"
                                                        min="1"
                                                        step="1"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Maximum Students <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        name="maximumStudent"
                                                        value={formData.maximumStudent}
                                                        onChange={handleInputChange}
                                                        placeholder="30"
                                                        min="1"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Class Level <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="classLevel"
                                                        value={formData.classLevel}
                                                        onChange={handleInputChange}
                                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select Level
                                                        </option>

                                                        <option value={ClassLevel.JUNIOR}>
                                                            Junior
                                                        </option>

                                                        <option value={ClassLevel.INTERMEDIATE}>
                                                            Intermediate
                                                        </option>

                                                        <option value={ClassLevel.EXPERT}>
                                                            Senior
                                                        </option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Location Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                                                        required
                                                    >
                                                        <option value={ClassLocation.ONLINE}>Online</option>
                                                        <option value={ClassLocation.PHYSICAL}>Physical</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Start Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        name="startDate"
                                                        value={formData.startDate}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        End Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        name="endDate"
                                                        value={formData.endDate}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Description <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
                                                        placeholder="Describe what students will learn..."
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Location Details */}
                                    {step === 2 && (
                                        <div className="space-y-4">
                                            {formData.location === ClassLocation.ONLINE ? (
                                                <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5">
                                                    <div className="flex items-center gap-2">
                                                        <LinkIcon className="h-5 w-5 text-emerald-600" />
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Online Class Link
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm leading-6 text-gray-600">
                                                        Add one Google Meet link for this class. EduLink will reuse it as
                                                        the default link whenever you start a live session, so students
                                                        get a consistent join experience.
                                                    </p>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Google Meet Link <span className="text-red-500">*</span>
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            name="defaultLink"
                                                            value={formData.defaultLink}
                                                            onChange={handleInputChange}
                                                            placeholder="https://meet.google.com/..."
                                                            required
                                                        />
                                                    </div>

                                                    {formData.otherLinks.length > 0 && (
                                                        <div className="space-y-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Additional Links
                                                            </label>
                                                            {formData.otherLinks.map((link: string, index: number) => (
                                                                <Input
                                                                    key={index}
                                                                    type="text"
                                                                    value={link}
                                                                    onChange={(e) => handleOtherLinkChange(index, e.target.value)}
                                                                    placeholder={`Additional Link ${index + 1}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={addNewLink}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
                                                    >
                                                        + Add Another Link
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <MapPinIcon className="h-5 w-5 text-blue-600" />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                Physical Location
                                                            </h3>
                                                        </div>

                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Address <span className="text-red-500">*</span>
                                                            </label>
                                                            <Input
                                                                type="text"
                                                                name="physicalAddress"
                                                                value={formData.physicalAddress}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter classroom address"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Latitude
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    name="latitude"
                                                                    value={formData.latitude}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Auto-filled"
                                                                    readOnly
                                                                    className="bg-gray-50"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Longitude
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    name="longitude"
                                                                    value={formData.longitude}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Auto-filled"
                                                                    readOnly
                                                                    className="bg-gray-50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Map Picker Component */}
                                                    <MapPicker
                                                        address={formData.physicalAddress}
                                                        onLocationSelect={setSelectedLocation}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 3: Review */}
                                    {step === 3 && (
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                    <AcademicCapIcon className="h-5 w-5 text-emerald-600" />
                                                    Class Information
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Class Name</p>
                                                        <p className="font-medium text-gray-900">{formData.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Category</p>
                                                        <p className="font-medium text-gray-900">{formData.category}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Price</p>
                                                        <p className="font-medium text-gray-900">${formData.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Max Students</p>
                                                        <p className="font-medium text-gray-900">{formData.maximumStudent}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Class Level</p>
                                                        <p className="font-medium text-gray-900">{formData.classLevel}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Location Type</p>
                                                        <p className="font-medium text-gray-900">{formData.location}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Start Date</p>
                                                        <p className="font-medium text-gray-900">{formData.startDate}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">End Date</p>
                                                        <p className="font-medium text-gray-900">{formData.endDate}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500">Description</p>
                                                    <p className="text-gray-900 mt-1">{formData.description}</p>
                                                </div>
                                            </div>

                                            {(formData.location === ClassLocation.ONLINE) ? (
                                                <div className="bg-gray-50 rounded-2xl p-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <LinkIcon className="h-5 w-5 text-emerald-600" />
                                                        <h3 className="text-lg font-semibold text-gray-900">Meeting Links</h3>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">Main Link:</p>
                                                    <p className="font-medium text-emerald-600 mb-3">{formData.defaultLink}</p>
                                                    {formData.otherLinks.length > 0 && (
                                                        <>
                                                            <p className="text-sm text-gray-500 mb-2">Additional Links:</p>
                                                            {formData.otherLinks.map((link: string, idx: number) => (
                                                                <p key={idx} className="text-sm text-gray-700 mb-1">{link}</p>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 rounded-2xl p-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                                                        <h3 className="text-lg font-semibold text-gray-900">Physical Location</h3>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">Address:</p>
                                                    <p className="font-medium text-gray-900 mb-3">{formData.physicalAddress}</p>
                                                    <p className="text-sm text-gray-500">Coordinates:</p>
                                                    <p className="text-sm text-gray-700">
                                                        {formData.latitude}, {formData.longitude}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="mt-8 flex justify-between gap-3">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                                Back
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={!isStepValid() || isPending}
                                            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all ${isStepValid() && !isPending
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                                                : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            {isPending ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Creating...
                                                </>
                                            ) : step === totalSteps ? (
                                                <>
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    Create Classroom
                                                </>
                                            ) : (
                                                <>
                                                    Next
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateClassWizard;
