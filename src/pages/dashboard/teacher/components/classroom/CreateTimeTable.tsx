import { Fragment } from "react/jsx-runtime"
import { Dialog, Transition } from "@headlessui/react"



type Props = {
    isOpen: boolean;
    onClose: () => void
    formData?: any
    handleInputChange?: any
    handleSubmit?: any
}
const CreateTimeTable = (
    {
        isOpen,
        onClose,
      
    }: Props
) => {
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
            </Dialog>
        </Transition>
    )
}

export default CreateTimeTable
