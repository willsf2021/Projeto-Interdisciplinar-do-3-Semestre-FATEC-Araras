import "./styles.css"
export const Input = ({ label, type, placeholder }) => {
    return (
        <label>
            <p>{label}</p>
            <input type={type} placeholder={placeholder} />
        </label>
    )
}