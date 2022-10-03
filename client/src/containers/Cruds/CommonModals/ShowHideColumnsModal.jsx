import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import CheckBox from '../../../shared/components/form/CheckBox';

import { Field, reduxForm } from 'redux-form';
// import fetchMethodRequest from '../../../config/service';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'grey' : 'lightgrey',
    border: '1px solid white',
    borderRadius: 10,
    // styles we need to apply on draggables
    ...draggableStyle,

});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    padding: grid,
    overflow: 'auto',
    border: '1px solid black',
    borderRadius: 10,
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
});
let id2List = {
    droppable: 'selectTableFields',
    droppable2: 'notSelectedTableFields'
};
class ShowHideColumnsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableFields: [],
            changedTableFields: '',
            selectTableFields: [],
            notSelectedTableFields: [],


        };
    }

    componentDidMount = async () => {
        await this.getScreenFieldsData();
    }

    orderChange = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    // onDragEnd = async (result) => {
    //     // dropped outside the list
    //     if (!result.destination) {
    //         return;
    //     }

    //     const tableFields = this.orderChange(this.state.tableFields, result.source.index, result.destination.index);
    //     await this.setState({
    //         tableFields: tableFields,
    //         changedTableFields: tableFields,
    //     });
    // }
    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };
    getList = id => this.state[id2List[id]];
    onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!result.destination) {
            return;
        }
        const tableFields = this.orderChange(this.state.tableFields, result.source.index, result.destination.index);
        await this.setState({
            tableFields: tableFields,
            changedTableFields: tableFields,
        })
        // dropped outside the list
        // if (!destination) {
        //     return;
        // }
        // if (source.droppableId === destination.droppableId) {
        //     let items = this.orderChange(
        //         this.getList(source.droppableId),
        //         source.index,
        //         destination.index
        //     );
        //     if (source.droppableId === 'droppable2') {
        //         this.setState({ selectTableFields: items })
        //     }
        //     this.setState({ selectTableFields: items })
        // } else {
        //     const result = this.move(
        //         this.getList(source.droppableId),
        //         this.getList(destination.droppableId),
        //         source,
        //         destination
        //     );

        //     this.setState({
        //         selectTableFields: result.droppable,
        //         notSelectedTableFields: result.droppable2
        //     });
        // }
    };
    getScreenFieldsData = async () => {
        // let viewType = this.props.viewType;

        // fetchMethodRequest('GET','userSettings/Screens').then(async resp => {
        // colOrder = resp;
        // })
        let colOrder = localStorage.getItem(`${this.props.type}_column_order`);
        let columns = await JSON.parse(colOrder);
        let tempTableFields = [];
        if (columns) {
            tempTableFields = columns;
        }
        // let selectTableFields = this.state.selectTableFields;
        // let notSelectedTableFields = this.state.notSelectedTableFields;

        // for (let i = 0; i < tempTableFields.length; i++) {
        //     if (viewType === 'list') {
        //         if (tempTableFields[i]['show']) {
        //             selectTableFields.push(tempTableFields[i])
        //         } else {
        //             notSelectedTableFields.push(tempTableFields[i])
        //         }
        //     }
        //     if (viewType === 'grid') {
        //         if (tempTableFields[i]['mobile']) {
        //             selectTableFields.push(tempTableFields[i])
        //         } else {
        //             notSelectedTableFields.push(tempTableFields[i])
        //         }
        //     }
        // }
        this.setState({
            tableFields: tempTableFields,
            changedTableFields: tempTableFields,

        })
    }

    // Onchange checkbox
    onChange = async (event) => {
        let viewType = this.props.viewType;

        let fields = [...this.state.tableFields];

        if (event && event.target.name && fields && fields.length > 0) {
            fields.map(col => {
                if (col.field === event.target.name && viewType === 'list') {
                    col.show = !col.show
                    col.mobile = col.mobile
                }
                if (col.field === event.target.name && viewType === 'grid') {
                    col.mobile = !col.mobile
                    col.show = col.show
                }
                return col
            })

        }

        this.setState({
            tableFields: fields,
        })
    }

    // // On Confirm
    // submit = async (values) => {
    //     let selectTableFields = this.state.selectTableFields;
    //     let notSelectedTableFields = this.state.notSelectedTableFields;
    //     let data = [];
    //     // let viewType = this.props.viewType;
    //     // for (let i = 0; i < selectTableFields.length; i++) {
    //     //     if (viewType === 'list') {
    //     //         selectTableFields[i]['show'] = true;
    //     //         data.push(selectTableFields[i])
    //     //     } else {
    //     //         selectTableFields[i]['mobile'] = true;
    //     //         data.push(selectTableFields[i])
    //     //     }
    //     // }
    //     // for (let j = 0; j < notSelectedTableFields.length; j++) {
    //     //     if (viewType === 'list') {
    //     //         notSelectedTableFields[j]['show'] = false;
    //     //         data.push(notSelectedTableFields[j])
    //     //     } else {
    //     //         notSelectedTableFields[j]['mobile'] = false;
    //     //         data.push(notSelectedTableFields[j])
    //     //     }

    //     // }

    //     await localStorage.removeItem(`${this.props.type}_column_order`)
    //     await localStorage.setItem(`${this.props.type}_column_order`, JSON.stringify(this.state.changedTableFields))
    //     await this.props.closeShowHideColumnsModal('confirm', values, this.state.changedTableFields)
    // }
    // On Confirm
    submit = async (values) => {
        // console.log("valuesssss", values, this.state.tableFields)
        let tableFields = this.state.tableFields
        let obj = {}
        for (let tableField of tableFields) {
            obj[tableField.field] = tableField.show
        }
        console.log("objjjjj", obj)
        // let selectTableFields = this.state.selectTableFields;
        // let notSelectedTableFields = this.state.notSelectedTableFields;
        // let data = [];
        // // let viewType = this.props.viewType;
        // // for (let i = 0; i < selectTableFields.length; i++) {
        // //     if (viewType === 'list') {
        // //         selectTableFields[i]['show'] = true;
        // //         data.push(selectTableFields[i])
        // //     } else {
        // //         selectTableFields[i]['mobile'] = true;
        // //         data.push(selectTableFields[i])
        // //     }
        // // }
        // // for (let j = 0; j < notSelectedTableFields.length; j++) {
        // //     if (viewType === 'list') {
        // //         notSelectedTableFields[j]['show'] = false;
        // //         data.push(notSelectedTableFields[j])
        // //     } else {
        // //         notSelectedTableFields[j]['mobile'] = false;
        // //         data.push(notSelectedTableFields[j])
        // //     }

        // // }

        await localStorage.removeItem(`${this.props.type}_column_order`)
        await localStorage.setItem(`${this.props.type}_column_order`, JSON.stringify(this.state.changedTableFields))
        await this.props.closeShowHideColumnsModal('confirm', obj, this.state.changedTableFields)
    }

    render() {
        const { t, handleSubmit, viewType } = this.props;
        return (
            <div>
                <Modal isOpen={this.props.isOpenShowHideColumnsModal}
                    className={`modal-dialog-centered modal-dialog--primary modal-dialog--header `}>
                    <ModalHeader className="modal__header">
                        <button className="lnr lnr-cross modal__close-btn" type="button"
                            onClick={() => this.props.closeShowHideColumnsModal('close', null)} />
                        <p className="bold-text  modal__title"> {t('Select Fields To Show and Reorder')} </p>
                    </ModalHeader>
                    <ModalBody className='deleteModalBody'>
                        {/* <div style={{ marginBottom: 10 }}>
                            Select Fields To Show
                        </div> */}
                        <form onSubmit={handleSubmit(this.submit)} >
                            <div className='row mx-0 justify-content-center mb-3'

                            >
                                <DragDropContext onDragEnd={this.onDragEnd} >
                                    <div className='col-12 col-lg-6 col-md-10 col-sm-12'>
                                        <Droppable droppableId="droppable" direction="vertical" >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                    {...provided.droppableProps}
                                                >
                                                    {this.state.tableFields && this.state.tableFields.map((item, index) => {
                                                        if (item && item.displayInSettings) {
                                                            return <div className='col-sm-12 px-0 pb-2' key={index}>
                                                                <Draggable key={item.field} draggableId={item.field} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided.draggableProps.style
                                                                            )}
                                                                        >

                                                                            <Field
                                                                                className='col-2 mr-0 my-0 pl-2'
                                                                                key={item.field}
                                                                                name={item.field ? item.field : null}
                                                                                component={CheckBox}
                                                                                checked={viewType === 'grid' ? item.mobile : item.show}
                                                                                value={viewType === 'grid' ? item.mobile : item.show}
                                                                                onChange={(e) => this.onChange(e)}
                                                                                label={item.label ? t(item.label) : null}
                                                                            />
                                                                        </div>
                                                                    )}

                                                                </Draggable>
                                                            </div>
                                                        }
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>


                                    {/* <div className='col-6'>
                                        <Droppable droppableId="droppable2" direction="horizontal" >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                    {...provided.droppableProps}
                                                >
                                                    {
                                                        this.state.notSelectedTableFields && this.state.notSelectedTableFields.map((item, index) => {
                                                            if (item && item.displayInSettings) {
                                                                return <div className='col-sm-12 px-0 pb-2'>
                                                                    <Draggable key={item.field} draggableId={item.field} index={index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={getItemStyle(
                                                                                    snapshot.isDragging,
                                                                                    provided.draggableProps.style
                                                                                )}
                                                                            >
                                                                                {item.header}


                                                                            </div>
                                                                        )}

                                                                    </Draggable>
                                                                </div>
                                                            }
                                                        })}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div> */}
                                </DragDropContext>

                            </div>
                            <div className='col-sm-12 text-center'>
                                <Button
                                    color="primary"
                                    outline
                                    type="button"
                                    onClick={() => this.props.closeShowHideColumnsModal('close', null)}
                                    className='deleteModalBtn marginRight'
                                >
                                    {t('Cancel')}
                                </Button>
                                <Button
                                    color='primary'
                                    outline
                                    type="submit"
                                    className='deleteModalBtn'
                                >
                                    {t('Confirm')}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
ShowHideColumnsModal = reduxForm({
    form: "ShowHideColumnsModal Form", // a unique identifier for this form
    enableReinitialize: true,
})(ShowHideColumnsModal);

export default withTranslation('common')(ShowHideColumnsModal);