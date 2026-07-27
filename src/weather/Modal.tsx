interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-lg p-6 w-[400px] max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <p className="font-semibold text-[18px]">{title}</p>
                    <button 
                        onClick={onClose}
                        className="text-[#919191] hover:text-black cursor-pointer text-[20px]"
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}

export default Modal