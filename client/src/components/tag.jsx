import './tag.css'
export default function Root(props) {
    return (
        <>
            <div>
                <button className={'tag'}>{props.name}</button>
            </div>
        </>
    )};