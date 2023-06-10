import React, { useState } from 'react';
import AdminHead from '../components/adminHead';
import { useNavigate } from 'react-router-dom';

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
    { id: 1, name: 'Beispiel-Nutzer 1', blocked: false },
    { id: 2, name: 'Beispiel-Nutzer 2', blocked: false },
    { id: 3, name: 'Beispiel-Nutzer 3', blocked: false },
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

  
  return (
    <>
        
        <AdminHead heading="Gemeldete Nutzer">  </AdminHead>
      <div className="reported-users-page">
        <h1>Gemeldete Nutzer</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => handleBlockUser(user.id)}>
              {user.name}
              {user.blocked && <span>(Blockiert)</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
