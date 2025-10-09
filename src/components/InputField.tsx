/* --------------------------------------------
   🔹 Reusable Input Component (auto-uppercase)
--------------------------------------------- */
export default function InputField({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
}: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-yellow-200 font-semibold">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                placeholder={placeholder}
                className="w-full px-4 py-2 rounded-lg bg-transparent border border-yellow-400 text-white placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
            />
        </div>
    );
}
