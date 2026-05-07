import Edulink from "../../assets/Edulink.jpg"


/// icons
import { FcGoogle } from "react-icons/fc";
import Divider from "../../components/ui/Divider";
import { FaSpinner } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa";
import SocialButton from "../../components/ui/SocialButton";

// hooks 
import { useTokenLogin } from "../../features/auth/hooks/useTokenLogin"
import { useTokenLoginStore } from "../../features/auth/store/tokenLoginStore"
import { useNavigate } from "react-router-dom";


// components 
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { showCustomToast } from "../../utils/toast"
const TokenLogin = () => {

    const { mutate, isPending } = useTokenLogin();
    const { requestTokenFormData, setRequestTokenFormData, setExpiresToken } = useTokenLoginStore()
    const navigate = useNavigate()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRequestTokenFormData({ [name]: value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(requestTokenFormData, {
            onSuccess: (data) => {
                console.log(data)
                showCustomToast("success", data.data?.message || "Token sent successfully")
                 navigate("/veify-login")
                setExpiresToken(data.data?.expiresAt)
               
            },
            onError: (error: any) => {
                console.error("Registration error:", error);
                let errorMessage = "Something went wrong ❌";
                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                showCustomToast("error", errorMessage);
            }
        });
    }

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
                    Welcome back Peace
                </h1>



                <p className="text-center text-gray-500 mb-6">
                    Fill Information below to continue
                </p>

                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        name="email"
                        value={requestTokenFormData.email}
                        onChange={handleChange}
                        placeholder="thedadapeace@gmail.com"
                    />


                    <Button type="submit" className="mt-3 flex items-center justify-center">
                        {isPending ? <FaSpinner className=" animate-spin" /> : " Login"}
                    </Button>

                    <div className="mt-6 space-y-3">


                        <div className="space-y-2 text-center">
                            <p className="text-sm text-gray-600">
                                Having trouble logging in?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-sm text-[#15803D] hover:text-[#22C55E] font-medium transition-colors duration-200 hover:underline underline-offset-2"
                                >
                                    Forgot password?
                                </button>


                            </div>
                        </div>
                    </div>

                </form>
                <Divider />

                <div className="flex items-center justify-center gap-4">
                    <SocialButton icon={<FcGoogle size={22} />} />
                    <SocialButton icon={<FaFacebook size={22} />} />
                </div>

            </section>

        </main>
    )
}

export default TokenLogin
