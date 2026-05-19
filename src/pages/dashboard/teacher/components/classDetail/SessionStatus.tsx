
import AvatarStack from "./AvatarStack"

const users = [
  { name: "Abdullahi", image: "" },
  { name: "Yussuf", image: "" },
  { name: "Aisha", image: "" },
];

const SessionStatus = () => {
    return (
        <section className="bg-white border border-gray-300 rounded-md  p-5  ">

            <div className="flex justify-between ">
                <div className="flex-col gap-2 ">
                    <p className="text-green-500 text-sm">curent session</p>
                    <h1>Module4: Advanced Session </h1>
                    <p className="text-sm">started 12mins ago</p>
                </div>

                <AvatarStack 
                    users={users}
                />
            </div>


            <div>

            </div>

        </section>
    )
}

export default SessionStatus
