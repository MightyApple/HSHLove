import './dropDown.css'
export default function Root(props) {
    return (
        <>
            <div className={"dropdown"}>
                <label>{props.label}</label>
                <select name={props.selectName} id={props.selectId}>
                    {props.data.map((item, index) => (
                        <option key={index} value={item.name} id={item._id}>{item.name}</option>
                    ))}
                </select>
                <div className={"dropdownArrow"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" transform="rotate(180)" fill="var(--fontColor)">
                        <path d="M24 22h-24l12-20z" />
                    </svg>
                </div>
            </div>
        </>
    )};