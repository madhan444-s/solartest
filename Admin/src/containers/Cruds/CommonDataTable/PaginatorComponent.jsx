import React from 'react'
import { Col, Row } from 'reactstrap';
import { Paginator } from 'primereact/paginator';

class PaginatorComponent extends React.Component {
    render() {
        const { totalRecords, first, rows, onPageChange, isWeb } = this.props;
        return (
            (isWeb ?
                <Row className="paginationcss mx-0">
                    <Col className="col-12 col-md-12 px-0">
                        <span style={{ float: 'right' }}>
                            <Paginator
                                totalRecords={totalRecords}
                                first={first}
                                rows={rows}
                                rowsPerPageOptions={[10, 15, 20, 30, 50, 100]}
                                onPageChange={onPageChange}
                                style={paginatorStyle}>
                            </Paginator>
                        </span>
                        <span style={countTextStyle, { float: 'right', marginTop: 8.5 }}>
                            {totalRecords === 0 ? 0 : first + 1} - {(rows + first) >= totalRecords ? totalRecords : rows + first} / {totalRecords}
                        </span>
                    </Col>
                </Row>
                :
                <Row >
                    <Col className="col-12 col-md-9 px-0">
                        <Paginator
                            totalRecords={totalRecords}
                            first={first}
                            rows={rows}
                            rowsPerPageOptions={[10, 15, 20, 30, 50, 100]}
                            onPageChange={onPageChange}
                            style={paginatorStyle}>
                        </Paginator>
                    </Col>
                    <Col className="col-12 col-md-3 py-2" style={countColStyle}>
                        <span style={countTextStyle}>
                            TOTAL RECORDS : {totalRecords}
                        </span>
                    </Col>
                </Row>
            )
        )
    }
}

const paginatorStyle = {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: 'rgba(0,0,0,.03)',
    border: 'none'
}

const countColStyle = {
    backgroundColor: 'White',
    border: 'none',
    textAlign: 'center'
}

const countTextStyle = {
    fontSize: 13,
    fontFamily: "Open Sans,Helvetica Neue,sans-serif",
}
export default PaginatorComponent;