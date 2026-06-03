import { useState } from "react";
import Edulink from "../../assets/Edulink.jpg";
import Input from "../../components/ui/Input";
import { useCreateTeacherProfile } from "../../features/profile/hooks/useTeacherProfile";
import { showCustomToast } from "../../utils/toast";
import { FaSpinner } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { getAccessToken, saveAuthSession } from "../../features/auth/utils/authToken";
export type TeachingExperience = "Beginner" | "Intermediate" | "Advanced";

export interface TeacherFormData {
    professionalTitle: string;
    shortBio: string;
    country: string;
    teachingExperience: TeachingExperience;
    coursesToTeach: string[];
}

const RegisterTeacherProfileForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<TeacherFormData>({
        professionalTitle: "",
        shortBio: "",
        country: "",
        teachingExperience: "Beginner",
        coursesToTeach: [],
    });

    const [courseInput, setCourseInput] = useState("");
    const navigate = useNavigate();

    const countries = [
        "United States", "United Kingdom", "Canada", "Australia", "Germany",
        "France", "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark",
        "Finland", "Japan", "South Korea", "China", "India", "Brazil", "Mexico",
        "South Africa", "Nigeria", "Kenya", "Egypt", "UAE", "Saudi Arabia",
        "Singapore", "Malaysia", "Indonesia", "Philippines", "Vietnam", "Thailand",
        "Poland", "Turkey", "Greece", "Portugal", "Ireland", "New Zealand",
        "Argentina", "Chile", "Colombia",
    ];

    const teachingExperienceOptions = [
        { value: "Beginner" as TeachingExperience, label: "Beginner (Less than 2 years)" },
        { value: "Intermediate" as TeachingExperience, label: "Intermediate (2-5 years)" },
        { value: "Advanced" as TeachingExperience, label: "Advanced (5+ years)" },
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCourse = () => {
        if (courseInput.trim() && !formData.coursesToTeach.includes(courseInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                coursesToTeach: [...prev.coursesToTeach, courseInput.trim()],
            }));
            setCourseInput("");
        }
    };

    const handleRemoveCourse = (course: string) => {
        setFormData((prev) => ({
            ...prev,
            coursesToTeach: prev.coursesToTeach.filter((c) => c !== course),
        }));
    };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleAddCourse();
    }
};

    const nextStep = (e?: React.MouseEvent) => {
        e?.preventDefault();

        if (step === 1 && !formData.professionalTitle) return;
        if (step === 2 && !formData.country) return;

        setStep((prev) => prev + 1);
    };
    const prevStep = () => setStep(step - 1);

    const { mutate, isPending } = useCreateTeacherProfile();

    const handleSubmit = (e: React.FormEvent) => {
        console.log("STEP AT SUBMIT:", step);
        e.preventDefault();

        if (step !== 3) return;

        if (
            !formData.professionalTitle ||
            !formData.shortBio ||
            !formData.country ||
            formData.coursesToTeach.length === 0
        ) {
            showCustomToast("error", "Please complete all fields");
            return;
        }

        mutate(formData, {
            onSuccess: (data) => {
                showCustomToast(
                    "success",
                    data?.message || "Profile created successfully"
                );
                const token = getAccessToken();
                if (token) {
                    saveAuthSession({ accessToken: token, role: "ROLE_TEACHER" });
                }
                navigate("/dashboard/teacher");
            },
            onError: (error: any) => {
                console.log(error.response)
                let errorMessage = "Something went wrong ❌";

                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                }

                showCustomToast("error", errorMessage);
            },
        });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Professional Information</h3>
                        <p className="text-gray-500 mb-4">Tell us about your professional background</p>

                        <Input
                            label="Professional Title"
                            name="professionalTitle"
                            placeholder="e.g., Senior Frontend Developer, Math Teacher"
                            value={formData.professionalTitle}
                            onChange={handleInputChange}

                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Short Bio</label>
                            <textarea
                                name="shortBio"
                                rows={4}
                                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="Tell us about your teaching experience, expertise, and approach to teaching..."
                                value={formData.shortBio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Location & Experience</h3>
                        <p className="text-gray-500 mb-4">Where are you based and what's your experience level?</p>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Country</label>
                            <select
                                name="country"
                                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select your country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Teaching Experience</label>
                            <select
                                name="teachingExperience"
                                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                                value={formData.teachingExperience}
                                onChange={handleInputChange}
                                required
                            >
                                {teachingExperienceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Courses to Teach</h3>
                        <p className="text-gray-500 mb-4">What courses are you planning to teach?</p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                placeholder="e.g., Web Development, React, Python"
                                value={courseInput}
                                onChange={(e) => setCourseInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                onClick={handleAddCourse}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {formData.coursesToTeach.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.coursesToTeach.map((course) => (
                                    <span
                                        key={course}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                    >
                                        {course}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCourse(course)}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <main className="flex min-h-screen bg-gray-100">
            <section className="hidden md:block md:w-1/2 relative">
                <img className="w-full h-screen object-cover" src={Edulink} alt="EduLink" />
                <div className="absolute inset-0 flex flex-col justify-between pl-16 pr-12 py-12 items-start text-white">
                    <h1 className="text-6xl font-bold leading-tight">
                        Where <span className="text-yellow-400">Learning</span> <br />
                        meets Structure.
                    </h1>
                    <p className="mt-4 text-xl max-w-md">
                        A managed classroom platform that empowers teachers to run great sessions
                        and students to find trusted, distraction free learning
                    </p>
                    <div className="flex gap-10 mt-10 text-sm">
                        <div><h2 className="text-xl font-bold">12k+</h2><p>Active Classrooms</p></div>
                        <div><h2 className="text-xl font-bold">94%</h2><p>Attendance Rate</p></div>
                        <div><h2 className="text-xl font-bold">4.8</h2><p>Avg. Teacher Score</p></div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-8 px-6 md:px-10 lg:px-20 w-full md:w-1/2 overflow-y-auto flex flex-col">
                <div>
                    <h1 className="text-center text-green-600 font-bold text-xl mb-2">EduLink</h1>
                    <h2 className="text-center text-2xl font-semibold">Create your Teacher Profile</h2>
                    <p className="text-center text-gray-500 mb-6">
                        Step {step} of 3 • Fill in your information
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${step === i
                                    ? 'w-8 bg-green-400'
                                    : step > i
                                        ? 'w-2 bg-green-400'
                                        : 'w-2 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <form className="flex-1 flex flex-col" onSubmit={handleSubmit} onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                }}>
                    <div className="flex-1">{renderStep()}</div>

                    <div className="flex gap-3 mt-8 pt-4 border-t">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isPending}

                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                {isPending ? <FaSpinner className=" animate-spin" /> : "Create Profile"}
                            </button>
                        )}
                    </div>
                </form>
            </section>
        </main>
    );
};

export default RegisterTeacherProfileForm;
