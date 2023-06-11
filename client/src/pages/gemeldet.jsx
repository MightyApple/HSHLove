import React, { useState } from 'react';
import AdminHead from '../components/adminHead';
import { useNavigate } from 'react-router-dom';
import UserBanner from '../components/userBanner'

async function authorized() {
  return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
      return data; //returned von der fetch Funktion den ganzen User
  });
}
export default function ReportedUsersPage() {
  const navigate = useNavigate()
    let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
  const [users, setUsers] = useState([
    { id: 1, username: 'Beispiel-Nutzer 1', blocked: false },
    { id: 2, username: 'Beispiel-Nutzer 2', blocked: false },
    { id: 3, username: 'Beispiel-Nutzer 3', blocked: false },
  ]);

  const handleBlockUser = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, blocked: true } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
        
      <AdminHead heading="Gemeldete Nutzer">  </AdminHead>
      <div className="reported-users-page">
        {users.map((user, index) => {
          //var isOnline = onlineUsers.has(user.userId);
          return (
              <div key={index} onClick={() => setSelectedUser(user)}>
                <UserBanner user={user} />
              </div>
          )
        })}
      </div>
    </>
  );
}
