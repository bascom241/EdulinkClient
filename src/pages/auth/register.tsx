import { useState } from "react"

import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Divider from "../../components/ui/Divider"
import ToggleSwitch from "../../components/ui/ToggleSwitch"
import Edulink from "../../assets/Edulink.jpg"

import { showCustomToast } from "../../utils/toast"
import { getApiErrorMessage } from "../../utils/apiError"
import { saveAuthSession } from "../../features/auth/utils/authToken"

import { useRegister } from "../../features/auth/hooks/useRegister"
import { useRegisterStore } from "../../features/auth/store/registerStore"
import { useNavigate } from "react-router-dom"
const Register = () => {

    const { formData, setFormData, resetForm, setToken } = useRegisterStore()
    const [agree, setAgree] = useState(false)
    const navigate = useNavigate()
    const { mutate, isPending } = useRegister()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ [name]: value })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formData, {
            onSuccess: (data) => {
                console.log(data);

                const token = data?.data?.token
                const refreshToken = data?.data?.refreshToken;
                if (token) {
                    setToken(token)
                    saveAuthSession({ accessToken: token, refreshToken })
                }
                const successMessage = data?.message || "Registration successful!";
                showCustomToast("success", successMessage);
                navigate("/select")
                resetForm()

            },
            onError: (error: any) => {
                console.error("Registration error:", error);

                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                showCustomToast("error", errorMessage);
            }
        });
    };

    return (
        <main className="flex  min-h-screen bg-gray-100">

            <section className="hidden md:block md:w-1/2 relative">
                <img
                    className="w-full h-screen object-cover"
                    src={Edulink}
                    alt="EduLink"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between pl-16 pr-12  py-12 items-start text-white">
                    <h1 className="text-6xl font-bold leading-tight">
                        Where <span className="text-yellow-400">Learning</span> <br />
                        meets Structure.
                    </h1>

                    <p className="mt-4 text-xl max-w-md">
                        A managed classroom platform that empowers teachers to run great sessions
                        and students to find trusted, distraction free learning
                    </p>

                    <div className="flex gap-10 mt-10 text-sm">
                        <div>
                            <h2 className="text-xl font-bold">12k+</h2>
                            <p>Active Classrooms</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">94%</h2>
                            <p>Attendance Rate</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">4.8</h2>
                            <p>Avg. Teacher Score</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-white py-8 px-6 md:px-16 lg:px-32 w-full md:w-1/2">
                <h1 className="text-center text-green-600 font-bold text-xl mb-2">
                    EduLink
                </h1>

                <h2 className="text-center text-2xl font-semibold">
                    Create your account
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    Fill Information below to get started
                </p>

                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>

                    <Input
                        label="Full Name"
                        placeholder="Dada Peace"
                        onChange={handleChange}
                        value={formData.fullName}
                        name="fullName"
                    />

                    <Input
                        label="Email"
                        type="email"
                        onChange={handleChange}
                        placeholder="thedadapeace@gmail.com"
                        value={formData.email}
                        name="email"
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="************"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                    />

                    <ToggleSwitch
                        className="mt-2"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                    />

                    <Button type="submit" className="mt-3">
                        {isPending ? "Loading..." : " Sign Up"}
                    </Button>
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-[#15803D] hover:text-[#22C55E] font-medium transition-colors duration-200 hover:underline underline-offset-2"
                    >
                        Already Have an accout? Login
                    </button>
                    <Divider />

                </form>

            </section>

        </main>
    )
}

export default Register
