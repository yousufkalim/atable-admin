import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col,Modal } from "react-bootstrap";
const $ = require("jquery");
$.DataTable = require("datatables.net");

export default class DataTableComponent extends Component {
  constructor(props){
    super(props);
    this.state ={
      loading:false
    }
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
          <Modal>
            <Model.body>
                <Col md={6}>
                    <TextField
                      id="outlined-name"
                      label="Name"
                      className={classes2.textField}
                      value={values2.name}
                      onChange={handleChange2("name")}
                      margin="normal"
                      variant="outlined"
                    />
                </Col>
            </Model.body>
          </Modal>
      </div>
    );
  }
}