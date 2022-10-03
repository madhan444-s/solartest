/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Container, Card, CardBody, Col, Row } from 'reactstrap';

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import config from '../../../config/config'
import dateFormats from '../../UI/FormatDate/formatDate';
import store from '../../App/store'
class CountDisplay extends PureComponent {
	static propTypes = {
		t: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			languageData:''
		};
	}
    static getDerivedStateFromProps(props, state) {
        let storeData=store.getState()
        let languageData=storeData && storeData.settingsData &&storeData.settingsData.settings&& storeData.settingsData.settings.languageTranslation? storeData.settingsData.settings.languageTranslation:""
        return {languageData: languageData };
      }
	componentDidMount() {
		if (localStorage.getItem('loginCredentials')) {
			let user = JSON.parse(localStorage.getItem('loginCredentials'));
			if (user.role) {
				this.setState({ employeeRole: user.role });
			}
		}
	}

	handleClick = (index) => {
		this.setState({
			activeIndex: index,
		});
	};

	render() {
		const { dashboardData, meetingsData } = this.props;
		const {languageData}=this.state
		return (
			<div>
				{/* If user is Admin or superAdmin  */}
				{dashboardData ?
					<Row>

						<Col md={12} xl={3} lg={6} xs={12}>
							<Card style={{ paddingBottom: '20px' }}>
								<CardBody className="dashboard__card-widget">
									{/* <img className="dashboard_image" src={require('../../../assets/img/dashboard/project.png')} /> */}
									<div className="card__title">
				<h5 className="bold-text">{languageData&&languageData['']?languageData['']:''}Employees</h5>
									</div>
									<div className="dashboard__total">
										<TrendingUpIcon className="dashboard__trend-icon" />
										<p className="dashboard__total-stat">
											<Link to="/dashboard">{dashboardData.employeesCount ? dashboardData.employeesCount : 0}</Link>
										</p>
									</div>
								</CardBody>
							</Card>
						</Col>

						<Col md={12} xl={3} lg={6} xs={12}>
							<Card style={{ paddingBottom: '20px' }}>
								<CardBody className="dashboard__card-widget">
									{/* <img className="dashboard_image" src={require('../../../assets/img/dashboard/project.png')} /> */}

									<div className="card__title">
										<h5 className="bold-text">{languageData&&languageData['']?languageData['']:''}Users</h5>
									</div>
									<div className="dashboard__total">
										<TrendingUpIcon className="dashboard__trend-icon" />
										<p className="dashboard__total-stat">
											<Link to="/users">{dashboardData.usersCount ? dashboardData.usersCount : 0}</Link>
										</p>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col md={12} xl={3} lg={6} xs={12}>
							<Card style={{ paddingBottom: '20px' }}>
								<CardBody className="dashboard__card-widget">
									{/* <img className="dashboard_image" src={require('../../../assets/img/dashboard/project.png')} /> */}
									<div className="card__title">
										<h5 className="bold-text">{languageData&&languageData['']?languageData['']:''}Meetings</h5>
									</div>
									<div className="dashboard__total">
										<TrendingUpIcon className="dashboard__trend-icon" />
										<p className="dashboard__total-stat">
											<Link to="/meetings">{dashboardData.meetingsCount ? dashboardData.meetingsCount : 0}</Link>
										</p>
									</div>
								</CardBody>
							</Card>
						</Col>

						<Col md={12} xl={3} lg={6} xs={12}>
							<Card style={{ paddingBottom: '20px' }}>
								<CardBody className="dashboard__card-widget">
									{/* <img className="dashboard_image" src={require('../../../assets/img/dashboard/project.png')} /> */}

									<div className="card__title">
										<h5 className="bold-text">{languageData&&languageData['']?languageData['']:''}Schedules</h5>
									</div>
									<div className="dashboard__total">
										<TrendingUpIcon className="dashboard__trend-icon" />
										<p className="dashboard__total-stat">
											<Link to="/schedules">{dashboardData.schedulesCount ? dashboardData.schedulesCount : 0}</Link>
										</p>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
					: null}
					<Row>
          <Col md={12}>
            <h3 className="page-title" style={{ marginBottom: '5px' }}>Today Meetings</h3>
          </Col>
        </Row>
				<Row>
					{
					meetingsData &&meetingsData.length?
						meetingsData.map((item, index) => {
							return (<Col md={12} xl={3} lg={6} xs={12} key={index}>
								<Card style={{ paddingBottom: '20px' }}>
									<CardBody className="dashboard__card-widget">
										{/* <img className="dashboard_image" src={require('../../../assets/img/dashboard/project.png')} /> */}
										<h4 className="bold-text mb-1 mt-0">{item && item.topic ? item.topic : ''}</h4>
										<h5 className="mb-1 mt-0">{`${languageData&&languageData['startTime']?languageData['startTime']:'Start Time'} : ${item && item.startTime ? dateFormats.formatDate(item.startTime, config.timeFormat) : 'not mentioned'} `}</h5>
										<h5 className="mb-1 mt-0">{`${languageData&&languageData['meetingId']?languageData['meetingId']:'Meeting ID'} : ${item && item.roomId ? item.roomId : ''}`}</h5>
										<h5 className="mb-1 mt-0">{`${languageData&&languageData['host']?languageData['host']:'Host'} : ${item && item.adminName ? item.adminName : ''}`}</h5>
									</CardBody>
								</Card>
							</Col>)
						})
						:
						<Col md={12} xl={3} lg={6} xs={12}>
							<Card style={{ paddingBottom: '20px' }}>
								<CardBody className="dashboard__card-widget">
									<p className=" mb-1 mt-0">{languageData&&languageData['noMeetings']?languageData['noMeetings']:'No Meetings'}</p>

								</CardBody>
							</Card>
						</Col>
						}

				</Row>
			</div>
		);
	}
}

export default withTranslation('common')(CountDisplay);

