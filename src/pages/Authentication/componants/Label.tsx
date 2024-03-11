
interface LabelProps {
    title: String,
}
export function LabelInput({ title }: LabelProps) {
    return (
        <div>
            <label className="mb-2 block text-sm text-strokedark font-medium dark:text-white">
                {title}
            </label>
        </div>
    )
}


export function ErrorInput({ title }: LabelProps) {
    return (
        <div>
            <label className="mb-2 mt-1 block text-sm font-normal text-meta-1">
                {title}
            </label>
        </div>
    )
}

