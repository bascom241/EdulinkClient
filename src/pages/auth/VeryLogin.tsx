import Edulink from "../../assets/Edulink.jpg"
import TokenInput from '../../components/ui/TokenInput'
import Button from "../../components/ui/Button"
import ExpiryCounter from "../../utils/ExpiryCounter"
import { useTokenLoginStore } from "../../features/auth/store/tokenLoginStore"
import { useVerifyToken } from "../../features/auth/hooks/useVerifyToken"
import { useState } from "react"
import { showCustomToast } from "../../utils/toast"
import { useLoginStore } from "../../features/auth/store/loginStore"
import { FaSpinner } from "react-icons/fa"
import { useNavigate, useSearchParams } from "react-router-dom"
import { saveAuthSession } from "../../features/auth/utils/authToken"
const VeryLogin = () => {


    const [tokenInput, setTokenInput] = useState<string[]>(["", "", "", "", "", ""]);
    const { requestTokenFormData, expiresAt: expiresToken } = useTokenLoginStore();
    const expiresAt: Date = expiresToken ? new Date(expiresToken) : new Date();
    const { mutate, isPending } = useVerifyToken();
    const {setToken} = useLoginStore()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const parsedToken = tokenInput.join("");
    console.log(parsedToken);
    console.log(requestTokenFormData)

    const dataToSend = {
        email: requestTokenFormData?.email,
        token: parsedToken
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(dataToSend, {
            onSuccess: (data) => {
                const token = data?.data?.token
                const refreshToken = data?.data?.refreshToken;
                const role = data?.data.role;
                console.log(token, refreshToken);
                if (token) {
                    setToken(token)
                    saveAuthSession({ accessToken: token, refreshToken, role })
                }
                showCustomToast("success", data?.message || "Login successful!")
                navigate(searchParams.get("redirect") || "/dashboard")
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
        })

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

            <section className="bg-white py-8 px-6 md:px-16 lg:px-32 w-full md:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md text-center space-y-6">

                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            Verify Your Email
                        </p>
                        <p className="text-lg font-semibold text-gray-600 mt-2">
                            Enter the 6-digit code we sent to {requestTokenFormData?.email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div>
                            <TokenInput
                                token={tokenInput}
                                setToken={setTokenInput}
                            />
                        </div>

                        <div>
                            <Button type="submit" className="mt-3 flex items-center justify-center w-full">
                            {isPending ? <FaSpinner className=" animate-spin" /> : "Submit"}
                            </Button>
                        </div>
                        <ExpiryCounter expiresAt={expiresAt ?? new Date()} />

                    </form>
                </div>
            </section>

        </main >
    )
}

export default VeryLogin
