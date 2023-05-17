import { Outlet, Link } from "react-router-dom";
export default function Root() {

    async function test(){
        let data = {
            user1ID:123,
            user2ID:321,
            messageHistory:[
                {
                    messageContent:"hallo",
                    timeStamp: Date(),
                    messageSentByUserID: 123
                },
                {
                    messageContent:"hallo zurück",
                    timeStamp:Date(),
                    messageSentByUserID: 321
                }
            ]
        }
        const result = await fetch("/tester123",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        /*const resData= await result.json()
        if(resData.noError){
            setSucces(true)
        }*/
    }
    test()
    return (
        <>
            <ul>
                <li>
                    <Link to={'chat'}>Chat</Link>
                </li>
                <li>
                    <Link to={'homepage'}>Homepage</Link>
                </li>
                <li>
                    <Link to={'login'}>Login</Link>
                </li>
                <li>
                    <Link to={'registrieren'}>Registrieren</Link>
                </li>
                <li>
                    <Link to={'start'}>StartingPage (Später nur "/")</Link>
                </li>
                <li>
                    <Link to={'edit'}>Profil bearbeiten</Link>
                </li>
            </ul>
        </>
    )};