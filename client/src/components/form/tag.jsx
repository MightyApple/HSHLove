import './tag.css'
export default function Root(props) {
    return (
        <>
            <button className={'tag '+props.size}>{props.name}</button>
        </>
    )};