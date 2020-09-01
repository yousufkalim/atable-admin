import React,{useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import moment from "moment";


export default function UserList() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'First Name' },
      { title: 'Last Name'},
      { title: 'Email'},
      {title: 'Date Of Created'},
      {title:'Actions'},
    ]
  });

  const [userData,setUserData] = useState([]);
  const globalState = useSelector(state => state)

  useEffect(()=>{
    
    fetch('http://localhost:4000/users/',{
      mathod:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${globalState.auth.authToken}`,
      }
    }).then(res => res.json())
    .then(responseJson => {
      const userDatais = [];
      responseJson.users.map(item=> {
        
          item.role !== "admin"?
          userDatais.push([item.firstName,item.lastName,item.email,moment(item.createdDate).format('ddd MM YYYY HH:mm'),item.id]):
          console.log("admin");
        
        }  
      );
      // if(userData >= 0){

        setUserData(userDatais);
      // }
    })
    .catch(error=>console.log("error",error));
  },[]);


  return (
    <>
      {userData.length >0?
      <DataTableComponent columns={state.columns} data={userData} />:""}
    </>
  );
}