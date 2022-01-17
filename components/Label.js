
export default function Label({children, className}) {
    return (
        <label className={`text-base tracking-wide font-semibold ${className}`}>{children}</label>
    )
}
