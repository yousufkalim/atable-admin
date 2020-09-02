import React,{useState,useEffect, useMemo} from 'react';
import {useSelector} from "react-redux";
// react bootstarp components
import { Button, Row, Col,Modal } from "react-bootstrap";
// material ui components
import {TextField, InputAdornment, IconButton} from "@material-ui/core";
// icons form material ui
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../../../Utilities/Utilities";

export default function RestaurantList() {
  const [state, setState] = React.useState({
    infoId:"",
    // first Name
    firstName:"",
    firstNameError:"",
    // last Name
    lastName:"",
    lastNameError:"",
    // email
    email:"",
    emailError:"",
    // password
    password:"",
    passwordError:"",
    // confirm password
    // cPassword:"",
    // cPasswordError:"",
  });

  const columns = [
    {title:'Image'},
    { title: 'Resturant Name' },
    { title: 'Description'},
    {title: 'Date Of Created'},
    {title:'Actions'},
  
  ];

  // show password for update or not
  const [showPasswordField,setShowPasswordField] = useState(false);
  const [restaurantData,setRestaurantData] = useState([]);
  const [updateData,setUpdateData] = useState(false);
  // model toogler
  const [show,setShow] = useState(false);
  const [showEdit,setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled,setBtnDisabled]  = useState(true);
  // global state from redux
  const globalState = useSelector(state => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(()=>{
    setRestaurantData([]);
    fetch('http://localhost:4000/resturants/',{
      mathod:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${globalState.auth.authToken}`,
      }
    }).then(res => res.json())
    .then(responseJson => {
      console.log("restu",responseJson);
      var userDatais = [];
      responseJson.map(item=> {
          console.log("item",item);
          userDatais.push(
            [
              `<img src=${item.resturant_image} alt="resturant Image" />`,
              item.resturant_name,
              item.resturant_desc,
              moment(item.createdDate).format('ddd MM YYYY HH:mm'),
              item.id
            ]
          );        
        }  
      );
      setRestaurantData(userDatais);
      console.log("sa",restaurantData);
    })
    .catch(error=>console.log("error",error));
  },[updateData]);


  // handle button disable function
  const handleBtnDisables = () => {
    // debugger;
    // const {firstName,lastName,email,password,emailError,passwordError,firstNameError,lastNameError} = state;
    // var stateUpdate = state;
    // if(firstName !== "" && lastName !=="" && email !== "" && password !==""){
    //   if(firstNameError === "" && lastNameError === "" && emailError === "" && passwordError === ""){
    //     setBtnDisabled(false);
    //   }
    //   else{
    //     setBtnDisabled(true);
    //   }
    // }else{
    //   setBtnDisabled(true);
    // }
  }

  //  reset state data
  const handleResetState = () => {
    // setState({
      
    // })
  }

  
  const handleChange = e => {
    var stateUpdate = {...state};
    stateUpdate[e.target.name] = e.target.value;
    setState(stateUpdate);
    handleBtnDisables()
  }


  // handleCloseModels
  const handleClose = () => {
    setShow(false);
  }
  const handleCloseEdit = () => {
    setShowEdit(false);
    handleResetState();
  }


  // handle add new record
  const handleAdd = () =>{
    // const {firstName,lastName,email,password} = state;
    // const info = {
    //   firstName,
    //   lastName,
    //   email,
    //   password
    // }
    // WebServiceManager.postApiCall(
    //   {
    //     endPoint:'users/register',
    //     dataToInsert:JSON.stringify(info),
    //     token:globalState.auth.authToken,
    //   },
    //   (statusCode,responseAdd)=>{
    //     if(statusCode === 200){
    //       handleClose();
    //       handleResetState();
    //       setUpdateData(!updateData);
    //     }else{
    //       alert(responseAdd.message);
    //     }
    //   }
    // )

  }

  // handle Edit Click
  const handleEdit = (id) => {
    // var stateUpdate = state;
    // WebServiceManager.getApiWithParamCall(
    //   {
    //     endPoint:'users',
    //     dataToFetch:id,
    //     token:globalState.auth.authToken,
    //   },
    //   (statusCode,responseUser)=>{  
    //     stateUpdate.firstName = responseUser.firstName;
    //     stateUpdate.lastName = responseUser.lastName;
    //     stateUpdate.email  = responseUser.email;
    //     stateUpdate.password = responseUser.password;
    //     stateUpdate.infoId = id;
    //     setState(stateUpdate);
    //     setShowEdit(true);
    //     console.log("State before",state);
    //     // handleBtnDisables();
    //   }
    // )
  }

  // handle Edit submit (update call.)
  const handleUpdate = (id) => {
    // const {firstName,lastName,email,password,infoId} = state;
    // const info = {
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    // } 
    // WebServiceManager.putApi(
    //   {
    //     endPoint:'users',
    //     userID:infoId,
    //     dataToUpdate:JSON.stringify(info),
    //     token:globalState.auth.authToken,
    //   },
    //   (statusCode,responseUpdate)=>{
    //     debugger;
    //     console.log("updates");
    //     setShowEdit(false);
    //     setUpdateData(!updateData);
    //   }
    // )
  }

  // handle delete function
  const handleDelete = (id) => {

    // const confirmis = window.confirm("Are you sure you want to delete?"); 

    // if(confirmis === true){
    //   WebServiceManager.DeleteApiInURL(
    //     {
    //       endPoint:'users',
    //       dataToDelete:id,
    //       token:globalState.auth.authToken
    //     },
    //     (statusCode,response)=>{
    //       setUpdateData(!updateData);
    //     }
    //   )
    // }
  }

  const actionsList = {
    deleteAction:handleDelete,
    updateAction:handleEdit,
    addAction:()=>setShow(true),
  }

  return (
    <>
      {restaurantData.length >0?
        <DataTableComponent actionCol={4} columns={columns} data={restaurantData} tokenis={globalState.auth.authToken} actions={actionsList} />
      :""}
    </>
  );
}