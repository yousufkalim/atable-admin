import React,{useState,useEffect, useMemo,useRef} from 'react';
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
// react bootstarp components
import { Button, Row, Col,Modal } from "react-bootstrap";

// material ui components
import {TextField} from "@material-ui/core";
import ChipInput from 'material-ui-chip-input'
import Autocomplete from '@material-ui/lab/Autocomplete';

// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";


export default function DishesList() {

  //  reffeance for input field
  const hiddenFileInput  = useRef(null);
  const {menu_id} = useParams();

  console.log(menu_id)

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
    { title: 'Dish Name' },
    { title: 'Description'},
    { title: 'Restaurant'},
    { title: 'Price'},
    { title: 'Tags'},
    { title: 'Rating'},
    { title: 'Distance'},
    {title: 'Date Of Created'},
    {title:'Actions'},
  
  ];

  const [restaurantData,setRestaurantData] = useState([]);
  const [yourChips,setYourChips] = useState([]);
  const [updateData,setUpdateData] = useState(false);
  const [loader,setLoader] = useState(false);
  const [restaurantListis,setRestaurantListis] = useState([]);

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


  // userEffect if tag changes

  useEffect(() => {
    console.log("Tag |Chnage")
  }, [yourChips])

  // load add resturent name
  useEffect(()=>{
    let restaurantList = [];
    WebServiceManager.getApiCall({
      endPoint:'resturants',
      token:globalState.auth.authToken
    },(statusCode,responseRest)=>{
      console.log('sasa',responseRest);
      responseRest.map(item=>{
        restaurantList.push({id:item.id,name:item.resturant_name});
      })
      setRestaurantListis(restaurantList)
    });
    if(menu_id !== "error" && menu_id !== undefined){
      const stateUpdate = state;
      // if user is redirected from resturant table it automaticaly set state to it's id
      stateUpdate.resturant_id = menu_id;
      setState(stateUpdate);
    }
  },[])


  function convertStringToList(elm){
    elm = elm.split('')
    elm = elm.filter(e=> e !=='[' && e!=="'" && e!=="]")
    var b='';
    var c = []
    elm.map(item=>{
      if(item === ','){
        c.push(b);
        b=''
      } else {
        b= b+item;
      }
    })
    c.push(b);

    return c;
    
  }

  useEffect(()=>{
    setRestaurantData([]);
    var SendUrl = "";
    if(menu_id !== "error" && menu_id !== undefined){
      SendUrl = 'http://localhost:4000/dishs/restaurant/'+menu_id;
    }else{
      SendUrl = 'http://localhost:4000/dishs/';
    }
    fetch(SendUrl,{
      mathod:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${globalState.auth.authToken}`,
      }
    }).then(res => res.json())
    .then(responseJson => {
      console.log('res',responseJson)
      var userDatais = [];
      responseJson.users.map(item=> {
          userDatais.push(
            [
              item.dish_images.length >0?
              `<img style="width:100px;height:100px" src="http://localhost:4000/${item.dish_images[0]}" alt="resturant Image" />`:
              `<img style="width:100px;height:100px" src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg" alt="resturant Image" />`,
              item.dish_name,
              item.dish_description,
              item.resturant_id.resturant_name, 
              item.price,
              convertStringToList(item.tags[0]),
              item.rating !==undefined?item.rating:0,
              item.distance !== undefined ? item.distance:0,
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
    const {dish_name,dish_description,price,resturant_id} = state;
    if(dish_name !== "" && dish_description !=="" && price !=="" && resturant_id !== ""){ 
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
  }

  //  reset state data
  const handleResetState = () => {
    if(menu_id !== "error" && menu_id !== undefined){
      var rest_id = menu_id;
    }else{
      var rest_id = ''
    }
    setState({
      infoId:"",
      dish_name:"",
      dish_description:"",
      rating:"",
      distance:'',
      dish_type:[],
      price:'',
      tags:[],
      resturant_id:rest_id,
    });
    setImageFile('https://posterprintfactory.com/assets/file_placeholder.png');
    setYourChips([]);
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
    const {dish_name,dish_description,price,resturant_id} = state;
    const form = new FormData();
    form.append('dish_name',dish_name);
    form.append('dish_description',dish_description);
    form.append('price',String(price));
    form.append('tags',yourChips);
    console.log('res on send',resturant_id)
    form.append('resturant_id',resturant_id);
    if(imageFile !== null){
      form.append('dish_images',imageFile,imageFile.name);
    }
    WebServiceManager.postApiCallForm(
      {
        endPoint:'dishs/register',
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
        endPoint:'dishs',
        dataToFetch:id,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUser)=>{
        stateUpdate.dish_name = responseUser.dish_name;
        stateUpdate.dish_description = responseUser.dish_description;
        stateUpdate.tags  = convertStringToList(responseUser.tags[0]);
        stateUpdate.price = responseUser.price;
        stateUpdate.distance = responseUser.distance;
        stateUpdate.rating = responseUser.rating;
        stateUpdate.infoId = id;
        stateUpdate.dish_type = responseUser.dish_type;
        stateUpdate.resturant_id = responseUser.resturant_id;
        setState(stateUpdate);
        if(responseUser.dish_images.length >0){
        setShowImage("http://localhost:4000/"+responseUser.dish_images[0]);
        }else{
          setShowImage('https://posterprintfactory.com/assets/file_placeholder.png');
        }
        setYourChips(convertStringToList(responseUser.tags[0]))
        setShowEdit(true);
        handleBtnDisables();
        console.log("State before",state);
        // handleBtnDisables();
      }
    )
  }

  // handle Edit submit (update call.)
  const handleUpdate = () => {  
    const {dish_name,dish_description,price,infoId} = state;
    const formdata = new FormData();
    formdata.append('dish_name',dish_name);
    formdata.append('dish_description',dish_description);
    formdata.append('resturant_id',menu_id);
    formdata.append('price',String(price));
    formdata.append('tags',yourChips);
    if(imageFile !== null){
      formdata.append('dish_images',imageFile,imageFile.name);
    }


    WebServiceManager.putApiForm(
      {
        endPoint:'dishs',
        dataToUpdate:formdata,
        userID:infoId,
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
          endPoint:'dishs',
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

  const handleAddChip = (chip) => {
    console.log('chip',chip)
    setYourChips([...yourChips,chip])
  }
  const handleDeleteChip = (chip,index) => {
    // Remove item 'seven' from array
    var delArray = yourChips.filter(function(e) { return e !== chip })
    setYourChips(delArray);
  }


  const SetAddress = async item => {
    console.log("item",item.target.textContent )
    const selectedItem = item.target.textContent;
    for(var i=0;i<restaurantListis.length;i++){
      if(restaurantListis[i].name === selectedItem){
        var stateUpdate = state;
        stateUpdate.resturant_id = restaurantListis[i].id;
        await setState(stateUpdate);
        console.log('New',state);
        // dummy state to update fields 
        setLoader(!loader);
        handleBtnDisables();
      }
    }
  };
  return (
    <>
      {restaurantData.length >0?
        <DataTableComponent actionCol={9} columns={columns} data={restaurantData} actions={actionsList} />
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
          <Modal.Title>Add Dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* <label style={{color:'red'}}>{imageError}</label> */}
            <Col sm={12} style={{display:'flex',justifyContent:'center'}}>
              <img onClick={handleClick} src={showImage} style={{width:'200px',objectFit:'fill',height:'150px',borderRadius:'5px'}} />
              <input
                type="file"
                ref={hiddenFileInput}
                multiple
                onChange={handleChangeImage}
                style={{display: 'none'}}
              />
            </Col>
            <small style={{textAlign:'center',fontWeight:'bold',color:'red'}}>**Click On Image to Upload New.**</small>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Dish Name"
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
            <Col md={12} style={{margin:'10px 0px'}}>
              <ChipInput
                fullWidth={true}
                label="Dish Tags"
                helperText="Tags for dish"
                value={yourChips}
                defaultValue={['foo', 'bar']}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                variant="outlined"
              />
            </Col>
            <Col md={menu_id === 'error'?6:12}>
              <TextField
                id="outlined-zip"
                label="Price"
                type="number"
                value={state.price}
                name="price"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            {/* only show if restaurant is not picked automaticaly */}
            {menu_id === 'error'?
            <Col md={6}>
              <Autocomplete
                id="combo-box-demo"
                options={restaurantListis}
                getOptionLabel={(option) => option.name}
                style={{ marginTop: 15 }}
                onChange={SetAddress}
                renderInput={
                  (params) => 
                    <TextField 
                      {...params} 
                      label="Restaurant" 
                      variant="outlined" 
                    />
                }
              />
            </Col>
            :""}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add Dish
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dish</Modal.Title>
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
                label="Dish Name"
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
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={12} style={{margin:'10px 0px'}}>
              <ChipInput
                fullWidth={true}
                label="Dish Tags"
                helperText="Tags for dish"
                value={yourChips}
                defaultValue={['foo', 'bar']}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-zip"
                label="Price"
                type="number"
                value={state.price}
                name="price"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            {/* <Col md={4}>
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
            </Col> */}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleUpdate}>
            Update Dish
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}