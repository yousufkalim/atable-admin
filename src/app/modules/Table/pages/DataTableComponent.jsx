import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col } from "react-bootstrap";

// import end complimentory.
const $ = require("jquery");
$.DataTable = require("datatables.net");
export default class DataTableComponent extends Component {
  constructor(props){
    super(props);
    this.state ={
      loading:false,
    }
  }

  componentDidMount() {
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: this.props.columns,
      columnDefs: [{
        targets: this.props.actionCol,
        createdCell: (td, cellData, rowData, row, col) =>
          ReactDOM.render(
            <React.Fragment>
              <Button variant="success" onClick={()=>this.props.actions.updateAction(cellData)}>Edit</Button>
              <span> </span>
              <Button variant="danger" onClick={()=>this.props.actions.deleteAction(cellData)}>Delete</Button>
            </React.Fragment>, td),
      }],
    });
    this.setState({loading:false});
  }
  render() {
    return (
      <div>
          <Row style={{flexDirection:'row-reverse'}}>
            <Button vairent="primary" onClick={this.props.actions.addAction}>Add</Button>
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
      </div>
    );
  }
}