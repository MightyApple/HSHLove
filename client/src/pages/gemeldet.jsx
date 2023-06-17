import React, {useEffect, useRef, useState} from 'react';
import AdminHead from '../components/adminHead';
import { useNavigate } from 'react-router-dom';
import UserBanner from '../components/userBanner'
import AdminProfilePage from "../components/adminProfilePage";
import Footer from "../components/footer";
import Loading from "../components/loadingScreen"

/*async function authorized() {
  return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
      return data; //returned von der fetch Funktion den ganzen User
  });
}
 */
export default function ReportedUsersPage() {
  const navigate = useNavigate()
    /*let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
     */

  const usersRef = useRef([]);
  const[loading,setLoading] = React.useState(true);
  async function getCurrentUser() {
      return fetch('/getUser')
          .then(response => response.json())
          .then(data => {
              if(data.roll!=="Admin"){
                  navigate("/")
              }else{setLoading(false)}
          });
  }
  const setUsers = (data) => {
    usersRef.current = data;
  };

  const fetchReportedUsers = async () => {
    try {
      const response = await fetch('/getReportedUsers');
      const data = await response.json();
      console.log(data);
      setUsers([...usersRef.current, ...data]);
      // Führe weitere Operationen mit den erhaltenen Daten durch
    } catch (error) {
      console.error(error);
      // Handle den Fehler entsprechend
    }
  };

  useEffect(() => {
    console.log("Testschen")
    getCurrentUser();
    fetchReportedUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const [selectedUser, setSelectedUser] = useState(null);

  if(loading){
    return (
        <>
          <Loading/>
        </>
    );
  }else if (selectedUser) {
    return (
        <>
          <AdminProfilePage user={selectedUser}></AdminProfilePage>
        </>
    );
  } else {
    return (
        <>
          <AdminHead heading="Gemeldete Nutzer"></AdminHead>
          <div className="reported-users-page">
            {usersRef.current.map((user, index) => {
              console.log(user)
              const currentUser = {username: user.name, profileImage: user.images[0]}
              return (
                  <div key={index} onClick={() => setSelectedUser(user)}>
                    <UserBanner user={currentUser} />
                  </div>
              )
            })}
          </div>
          <Footer abmelden={true}></Footer>
        </>
    );
  }
}
