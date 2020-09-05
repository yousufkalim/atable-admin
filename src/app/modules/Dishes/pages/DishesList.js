import React,{useState,useEffect, useMemo,useRef} from 'react';
import {useSelector} from "react-redux";
// react bootstarp components
import { Button, Row, Col,Modal } from "react-bootstrap";
// material ui components
import {TextField} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";


export default function DishesList() {

  //  reffeance for input field
  const hiddenFileInput  = useRef(null);
  const [state, setState] = React.useState({
    infoId:"",
    dish_name:"",
    dish_description:"",
    rating:"",
    distance:'',
    dish_type:[],
    price:'',
    tags:[],
    resturant_id:'',
  });

  const columns = [
    {title:'Image'},
    { title: 'Resturant Name' },
    { title: 'Description'},
    {title: 'Date Of Created'},
    {title:'Actions'},
  
  ];

  const [restaurantData,setRestaurantData] = useState([]);
  const [updateData,setUpdateData] = useState(false);
  const [loader,setLoader] = useState(false);

  const [showImage,setShowImage] = useState('https://posterprintfactory.com/assets/file_placeholder.png');
  const [imageFile,setImageFile] = useState(null);
  const [imageError,setImageError] = useState('');
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
    fetch('http://localhost:4000/dishs/',{
      mathod:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${globalState.auth.authToken}`,
      }
    }).then(res => res.json())
    .then(responseJson => {
      var userDatais = [];
      responseJson.map(item=> {
          console.log("item",item);
          userDatais.push(
            [
              `<img style="width:50px;height:50px" src="http://localhost:4000/${item.rating}" alt="resturant Image" />`,
              item.dish_name,
              item.dish_description,
              moment(item.createdDate).format('ddd MM YYYY HH:mm'),
              item.id
            ]
          );        
        }  
      );
      setRestaurantData(userDatais);
    })
    .catch(error=>console.log("error",error));
  },[updateData]);


  // handle button disable function
  const handleBtnDisables = () => {
    const {dish_name,dish_description,lat,long,addressError} = state;
    if(dish_name !== "" && dish_description !=="" && lat !==""&& long !==""){
      if(addressError === ""){ 
        if(imageFile !== null || state.infoId !== ""){
          setImageError('');
          setBtnDisabled(false);
        }else{
          setBtnDisabled(true);
          setImageError('This Field is required')
        }
      }else{
        setBtnDisabled(true);
      }
    }else{
      setBtnDisabled(true);
    }
  }

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId:"",
      dish_name:"",
      dish_description:"",
      rating:"",
      distance:'',
      dish_type:[],
      price:'',
      tags:[],
      resturant_id:'',
    });
    setImageFile('https://posterprintfactory.com/assets/file_placeholder.png');
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
    const {dish_name,dish_description,lat,long,address,zipCode} = state;
    const form = new FormData();
    form.append('dish_name',dish_name);
    form.append('dish_description',dish_description);
    form.append('resturant_lat',lat);
    form.append('resturant_lng',long);
    form.append('resturant_address',address);
    form.append('resturant_zipCode',zipCode);
    if(imageFile !== null){
      form.append('rating',imageFile,imageFile.name);
    }
    WebServiceManager.postApiCallForm(
      {
        endPoint:'resturants/register',
        dataToInsert:form,
        token:globalState.auth.authToken,
      },
      (statusCode,responseAdd)=>{
        if(statusCode === "200"){
          handleClose();
          handleResetState();
          setUpdateData(!updateData);
        }else{
          alert(responseAdd.message);
        }
      }
    )

  }

  // handle Edit Click
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint:'resturants',
        dataToFetch:id,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUser)=>{
        stateUpdate.dish_name = responseUser.dish_name;
        stateUpdate.dish_description = responseUser.dish_description;
        stateUpdate.address  = responseUser.resturant_address;
        stateUpdate.zipCode = responseUser.resturant_zipCode;
        stateUpdate.lat = responseUser.resturant_lat;
        stateUpdate.long = responseUser.resturant_lng;
        stateUpdate.infoId = id;
        setState(stateUpdate);
        setShowImage("http://localhost:4000/"+responseUser.rating)
        setShowEdit(true);
        handleBtnDisables();
        console.log("State before",state);
        // handleBtnDisables();
      }
    )
  }

  // handle Edit submit (update call.)
  const handleUpdate = () => {
    const {dish_name,dish_description,lat,long,infoId,address,zipCode} = state;
    // debugger;
    const formdata = new FormData();
    formdata.append('dish_name',dish_name);
    formdata.append('dish_description',dish_description);
    formdata.append('resturant_lat',lat);
    formdata.append('resturant_lng',long);
    formdata.append('resturant_address',address);
    formdata.append('resturant_zipCode',zipCode);
    if(imageFile !== null){
      formdata.append('rating',imageFile,imageFile.name);
    }

    for (var key of formdata.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }

    WebServiceManager.postApiCallForm(
      {
        endPoint:'resturants/'+infoId,
        dataToInsert:formdata,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUpdate)=>{
        // debugger;
        console.log("updates");
        setShowEdit(false);
        setUpdateData(!updateData);
      }
    )
  }

  // handle delete function
  const handleDelete = (id) => {

    const confirmis = window.confirm("Are you sure you want to delete?"); 

    if(confirmis === true){
      WebServiceManager.DeleteApiInURL(
        {
          endPoint:'resturants',
          dataToDelete:id,
          token:globalState.auth.authToken
        },
        (statusCode,response)=>{
          setUpdateData(!updateData);
        }
      )
    }
  }

  const actionsList = {
    deleteAction:handleDelete,
    updateAction:handleEdit,
    addAction:()=>setShow(true),
  }

  // custom image 

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChangeImage = event => {
    const fileUploaded = event.target.files[0];
    setImageFile(fileUploaded);
    const Update = state;
    Update.dish_description = state.dish_description+"."
    setState(Update);
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function(e) {
      // console.log(reader.result); 
      setShowImage(reader.result);
      handleBtnDisables();
    };
  }

  return (
    <>
      {restaurantData.length >0?
        <DataTableComponent actionCol={4} columns={columns} data={restaurantData} actions={actionsList} />
      :
        <>
        <Row style={{flexDirection:'row-reverse'}}>
          <Button vairent="primary" onClick={()=>setShow(true)}>Add</Button>
        </Row>
        <hr/>
        <p style={{textAlign:'center'}}>No Record Found</p>
        </>
      }
      {/* add modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* <label style={{color:'red'}}>{imageError}</label> */}
            <Col sm={12} style={{display:'flex',justifyContent:'center'}}>
              <img onClick={handleClick} src={showImage} style={{width:'200px',objectFit:'fill',height:'150px',borderRadius:'5px'}} />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChangeImage}
                style={{display: 'none'}}
              />
            </Col>
            <small style={{textAlign:'center',fontWeight:'bold',color:'red'}}>**Click On Image to Upload New.**</small>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Restaurant Name"
                name="dish_name"
                value={state.dish_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.dish_description}
                name="dish_description"
                multiline
                rows={5}
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              {/* <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>
                    {option.label}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              /> */}
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-zip"
                label="ZIPCODE"
                type="text"
                value={state.zipCode}
                name="zipCode"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-lat"
                label="Latitude"
                type="text"
                value={state.lat}
                name="lat"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-long"
                label="Longitude"
                type="text"
                value={state.long}
                name="long"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* <label style={{color:'red'}}>{imageError}</label> */}
            <Col sm={12} style={{display:'flex',justifyContent:'center'}}>
              <img onClick={handleClick} src={showImage} style={{width:'200px',objectFit:'fill',height:'150px',borderRadius:'5px'}} />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChangeImage}
                style={{display: 'none'}}
              />
            </Col>
            <small style={{textAlign:'center',fontWeight:'bold',color:'red'}}>**Click On Image to Upload New.**</small>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Restaurant Name"
                name="dish_name"
                value={state.dish_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.dish_description}
                name="dish_description"
                multiline
                rows={5}
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              {/* <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>
                    {option.label}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-zip"
                label="ZipCode"
                type="text"
                value={state.zipCode}
                name="zipCode"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              /> */}
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-lat"
                label="Latitude"
                type="text"
                value={state.lat}
                name="lat"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-long"
                label="Longitude"
                type="text"
                value={state.long}
                name="long"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleUpdate}>
            Updates Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}