import React, { useState } from 'react';
import AdminHead from '../components/adminHead';



export default function ReportedUsersPage() {
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
        <h1>Gemeldete Nutzer:innen</h1>
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
