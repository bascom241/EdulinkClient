import { useParams } from "react-router-dom"
import ClassHeader from "./components/classDetail/ClassHeader";
import SessionStatus from "./components/classDetail/SessionStatus";
const MyClassDetail = () => {
    const { id } = useParams();
    if (!id)
        return <div>No class Found</div>

    console.log(id)

    return (

        <main className="w-full flex-col">
            <ClassHeader />

            <div className="w-full flex items-center mt-8">
                <div className="w-[60%]">
                    <SessionStatus />
                </div>
                <div className="w-[30%]">

                </div>
            </div>

        </main>
    )
}

export default MyClassDetail
