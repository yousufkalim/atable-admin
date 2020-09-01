import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col,Modal } from "react-bootstrap";
import {TextField} from "@material-ui/core";

// import end complimentory.
const $ = require("jquery");
$.DataTable = require("datatables.net");

export default class DataTableComponent extends Component {
  constructor(props){
    super(props);
    this.state ={
      loading:false,
      show:true,
    }
  }

  handleClose = () => {
    this.setState({show:false})
  }

  handleEdit = (id) => {
    alert("edit "+id);
  }

  handleDelete = (id) => {
    alert('Delete '+id);
  }

  handleAdd = () =>{
    alert('Add Button Clicker');
  }

  componentDidMount() {
    console.log('PROPS',this.props);
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: this.props.columns,
      columnDefs: [{
        targets: 4,
        createdCell: (td, cellData, rowData, row, col) =>
          ReactDOM.render(
            <React.Fragment>
              <Button variant="success" onClick={()=>this.handleEdit(cellData)}>Edit</Button>
              <span> </span>
              <Button variant="danger" onClick={()=>this.handleDelete(cellData)}>Delete</Button>
            </React.Fragment>, td),
      }],
    });
    this.setState({loading:false});
  }

  componentWillMount() {
    // this.$el.DataTable.destroy(true);
    this.setState({loading:true})

  }
  render() {
    return (
      <div>
          <Row style={{flexDirection:'row-reverse'}}>
            <Button vairent="primary" onClick={this.handleAdd}>Add</Button>
          </Row>
          <hr/>
          <Row>
            <Col className="table-responsive">
              <table style={{backgroundColor:'#fff',overflow: 'hidden',borderRadius:'4px'}}
                className="display table table-hover table-striped table-bordered"
                width="100%"
                ref={el => (this.el = el)}
              ></table>
            </Col>
          </Row>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextField
                id="outlined-name"
                label="Name"
                value="Irtaza"
                onChange={()=>{}}
                margin="normal"
                variant="outlined"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
}