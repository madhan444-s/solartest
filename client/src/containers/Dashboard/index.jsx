import React from 'react';
import { Card, CardBody, Col, Container, Row, Table } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import CountDisplay from './components/CountDisplay';
import fetch from '../../config/service';
import config from '../../config/config'
import apiCalls from '../../config/apiCalls'
import Loader from '../App/Loader';


class Dashboard extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dashboardData: {},
      isLoading: false,
      expirationsList: [],
      meetingsData:[]
    };
  }

  componentDidMount = () => {
    let user = JSON.parse(localStorage.getItem('loginCredentials'));
    if (user) {
      this.setState({
        loginData: user,
        role: user.role
      })
    }
    // this.getExpirationsList();
    this.getCountData();
  }

  // Get dashboard counts
  getCountData() {
    this.setState({ isLoading: true });
    fetch('GET',apiCalls.dashboard )
      .then(async (response) => {
        if (response && response.details) {
          this.setState({
            dashboardData: response.details,
            meetingsData:response.todaymeetings     
          });
        }
        this.setState({ isLoading: false });
      }).catch((err) => {
        return err;
      });
  }

  // Get Last 30 days expirations list
  getExpirationsList = () => {
    this.setState({ isLoading: true });
    fetch('GET', 'locations')
      .then(async (response) => {
        if (response && response.locations) {
          this.setState({
            expirationsList: response.locations
          });
        }
        this.setState({
          isLoading: false,
        });
      }).catch((err) => {
        return err;
      });

  }

  render() {
    return (
      <Container className="dashboard" style={{ width: '98%', marginLeft: '20px' }}>
        <Loader loader={this.state.isLoading} />

        <Row>
          <Col md={12}>
            <h3 className="page-title" style={{ marginBottom: '5px' }}>DashBoard</h3>
          </Col>
        </Row>

        {/* Counts */}
        <CountDisplay
          dashboardData={this.state.dashboardData} 
          meetingsData={this.state.meetingsData}
          />

        {/* Expirations Table */}
        <Row className="d-none">
          <Col lg={12} xl={12} >
            <Card className="dashBoardCardWithScroll">
              <CardBody>
                <Table className="table--bordered table--head-accent table-fixed" responsive hover>
                  <thead>
                    <tr style={{ background: 'blue' }}>
                      {/* <th style={{ width: 8 + '%' }}>#</th> */}
                      <th style={{ width: 20 + '%', color: 'whitesmoke', borderRight: '1px white solid' }}>Company</th>
                      <th style={{ width: 20 + '%', color: 'whitesmoke', borderRight: '1px white solid' }}>Clinics</th>
                      <th style={{ width: 20 + '%', color: 'whitesmoke', borderRight: '1px white solid' }}>Cart</th>
                      <th style={{ width: 20 + '%', color: 'whitesmoke', borderRight: '1px white solid' }}>Address</th>
                      <th style={{ width: 20 + '%', color: 'whitesmoke', borderRight: '1px white solid' }}>Status</th>

                    </tr>
                  </thead>
                  <tbody>
                    {this.state.expirationsList.map((project, i) => {

                      return <tr key={i}>
                        {/* //<td style={{ width: 8 + '%' }}>{i + 1} </td> */}
                        {project && project.companyName ?
                          <td style={{ width: 20 + '%', textTransform: 'capitalize' }}>{project.companyName}</td>
                          : <td style={{ width: 20 + '%' }}></td>}
                        {project && project.clinics && project.clinics.name ?
                          <td style={{ width: 20 + '%', textTransform: "capitalize" }}>{project.clinics.name}</td>
                          : <td style={{ width: 20 + '%' }}></td>}
                        {project && project.cart ?
                          <td style={{ width: 20 + '%', textTransform: "capitalize" }}>{project.cart}</td>
                          : <td style={{ width: 20 + '%' }}></td>}
                        {project && project.cartLocation ?
                          <td style={{ width: 20 + '%', textTransform: "capitalize" }}> {project.cartLocation.building ? ("Building:") + (project.cartLocation.building + (" ")) : null}
                            {project.cartLocation.area ? ("Area:") + (project.cartLocation.area + (";")) : null}
                            {project.cartLocation.floor ? ("Floor:") + (project.cartLocation.floor + (";")) : null}
                            {project.cartLocation.facility ? ("Facility:") + (project.cartLocation.facility + (" ;")) : null}
                            {project.cartLocation.room ? ("Room:") + (project.cartLocation.room + (" ;")) : null}</td>
                          : <td style={{ width: 20 + '%' }}></td>}
                        <td style={{ width: 20 + '%', textTransform: "capitalize", textAlign: "center" }}> {project.status}</td>
                      </tr>
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container >
    );
  }
}

export default withTranslation('common')(Dashboard);