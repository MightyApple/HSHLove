
import React, {useEffect,useState} from "react"
 
function Root() {
    
    function dataSenden(){
        fetch("/t1",{
            method: 'POST'
        }).then(function(response) {
            console.log(response)
            return response.json();
        });
    }
    
    return (
        <>
            <div >
                <form >
                    <input name="lol"></input>
                    
                </form>
                <button onClick={console.log("click")}>ssadsa</button>
            </div>
            
        </>
    )};

export default Root