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

// import qr code genrator
import { QRCode } from "react-qr-svg";


export default function DishesList() {

  const {rest_id} = useParams();


  const [state, setState] = React.useState({
    infoId:"",
    table_number:"",
    table_url:"",
    resturant_id:'',
  });

  const columns = [
    { title: 'Resturant Name' },
    { title: 'Table Number'},
    { title: 'Table Number'},
    {title: 'Date Of Created'},
    {title:'Actions'},
  
  ];

  const [restaurantData,setRestaurantData] = useState([]);
  const [updateData,setUpdateData] = useState(false);
  const [restaurantListis,setRestaurantListis] = useState([]);
  const [loader,setLoader] = useState(false);
  // model toogler
  const [show,setShow] = useState(false);
  const [showEdit,setShowEdit] = useState(false);
  const [showQR,setShowQR] = useState(false);
  const [qrInfo,setQRInfo] = useState(null);
  // disables button toogles
  const [btnDisabled,setBtnDisabled]  = useState(true);
  // global state from redux
  const globalState = useSelector(state => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  // only for update resturant id and get resturent list for first time
  useEffect(() => {
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
    const updateState = state;
    if(rest_id !== 'error' || rest_id !== undefined){
      updateState.resturant_id = rest_id;
      setState(updateState);
    }
  }, [])

// populate data on load and on list change

  useEffect(()=>{
    setRestaurantData([]);
    var SendUrl = "";
    if(rest_id !== "error" && rest_id !== undefined){
      SendUrl = 'http://localhost:4000/tables/restaurant/'+rest_id;
    }else{
      SendUrl = 'http://localhost:4000/tables/';
    }
    fetch(SendUrl,{
      mathod:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${globalState.auth.authToken}`,
      }
    }).then(res => res.json())
    .then(responseJson => {
      var userDatais = [];
      responseJson.tableData.map(item=> {
          userDatais.push(
            [
              item.resturant_id.resturant_name,
              item.table_number,
              item.table_url,
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
    const {table_number,table_url} = state;
    if(table_number !== "" && table_url !==""){ 
      setBtnDisabled(false);
    }else{
      setBtnDisabled(true);
    }
  }

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId:"",
      table_number:"",
      table_url:"",
      resturant_id:'',
    });
    const updateState = state;
    if(rest_id !== 'error' || rest_id !== undefined){
      updateState.resturant_id = rest_id;
      setState(updateState);
    }else{
      updateState.resturant_id = '';
      setState(updateState);
    }

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
    const {table_number,table_url,resturant_id} = state;
    const formData = {
      table_number,
      table_url,
      resturant_id,
    }
    WebServiceManager.postApiCall(
      {
        endPoint:'tables/register',
        dataToInsert:JSON.stringify(formData),
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
        endPoint:'tables',
        dataToFetch:id,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUser)=>{
        stateUpdate.table_number = responseUser.table_number;
        stateUpdate.table_url = responseUser.table_url;
        stateUpdate.infoId = id;
        stateUpdate.resturant_id = responseUser.resturant_id.id;
        setState(stateUpdate);
        setShowEdit(true);
        handleBtnDisables();
      }
    )
  }

  // handle Edit submit (update call.)
  const handleUpdate = () => {  
    const {table_number,table_url,infoId,resturant_id} = state;
    const formData = {
      table_number,
      table_url,
      resturant_id,
    }

    WebServiceManager.putApi(
      {
        endPoint:'tables',
        dataToUpdate:JSON.stringify(formData),
        userID:infoId,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUpdate)=>{
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
          endPoint:'tables',
          dataToDelete:id,
          token:globalState.auth.authToken
        },
        (statusCode,response)=>{
          setUpdateData(!updateData);
        }
      )
    }
  }

  const qrCodeGenerate = (id) => {
    WebServiceManager.getApiWithParamCall(
      {
        endPoint:'tables',
        dataToFetch:id,
        token:globalState.auth.authToken,
      },
      (statusCode,responseUser)=>{
        setQRInfo(responseUser);
        setShowQR(true);
      }
    )
  }

  const actionsList = {
    deleteAction:handleDelete,
    updateAction:handleEdit,
    qrGenerate:qrCodeGenerate,
    addAction:()=>setShow(true),
  }


  const SetAddress = async item => {
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
        <DataTableComponent actionCol={4} columns={columns} data={restaurantData} actions={actionsList} qr_generate={true} />
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
          <Modal.Title>Add Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {rest_id === 'error' || rest_id === undefined?
            <Col md={12}>
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
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Table Number"
                name="table_number"
                value={state.table_number}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Table Url"
                value={state.table_url}
                name="table_url"
                type="url"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add Table
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
          <Col md={12}>
              <TextField
                id="outlined-name"
                label="Table Number"
                name="table_number"
                value={state.table_number}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Table Url"
                value={state.table_url}
                name="table_url"
                type="url"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleUpdate}>
            Update Table
          </Button>
        </Modal.Footer>
      </Modal>
       {/* qrCode Model  */}
       <Modal show={showQR}>
        <Modal.Header closeButton>
          <Modal.Title>Table QR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {qrInfo !== null?
            <>
              <Row>
                <b>Resturent = </b>{qrInfo.resturant_id.resturant_name}
              </Row>
              <Row>
                <b>Table Number = </b>{qrInfo.table_number}
              </Row>
              <Row>
                <b>Table URL = </b>{qrInfo.table_url}
              </Row>
              <Row id="qr-row">
                {/* <QRCode value={qrInfo.table_url} size={200}/> */}
                <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="Q"
                    style={{ width: 256 }}
                    value={qrInfo.table_url}
                />
              </Row>
            </>
            
          :""}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowQR(false)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}