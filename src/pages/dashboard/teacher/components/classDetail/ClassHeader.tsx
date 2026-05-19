import Button from "../../../../../components/ui/Button"



const ClassHeader = () => {
    return (
        <header className="w-full">
            <div className="flex items-center justify-between w-full gap-4">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-4 flex-1 min-w-0">

                    <button className="bg-red-700 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
                        Live Now
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold truncate">
                            Advanced React Pattern For Enterprise Applications
                        </h1>
                        <p className="text-sm text-gray-500 truncate">
                            classroom.computer science.CN-818
                        </p>
                    </div>
                </div>

                
                <div className="">
                    <Button className="px-3">
                        start session
                    </Button>
                </div>

            </div>
        </header>
    )
}

export default ClassHeader
