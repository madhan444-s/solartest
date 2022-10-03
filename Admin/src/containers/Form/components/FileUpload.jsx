import React from 'react';
import { FileUpload } from 'primereact/fileupload';

import fetchMethodRequest from '../../../config/service';

// toaster message
import showToasterMessage from '../../../containers/UI/ToasterMessage/toasterMessage';
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { picture: [], fileName: '' };

  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  onSelect = async (event) => {
    // console.log(123)
    await this.setState({ picture: event.files[0], files: event.files });
    if (this.props.type && this.props.type == 'bulkUpload') {
      return;
    } else {
      if (event) {
        this.UploadFileToServer(event.files);
      }
    }
  }

  UploadFileToServer() {
    if (this.state.picture) {
      let data = {};
      if (this.props.projectType == 'attach') {
        if (this.props.projectId) {
          data.contextId = { 'project': this.props.projectId };
          data.contextType = "project";
        } else if (this.props.taskId) {
          data.contextId = { 'task': this.props.taskId };
          data.contextType = "task";
        } else if (this.props.issueId) {
          data.contextId = { 'issue': this.props.issueId };
          data.contextType = "issue";
        }
        data.eventType = "attachments";
        data.attachment = this.state.picture;
      }
      let url
      if (this.props.type && this.props.type == 'profile') {
        url = this.props.url
      } else {
        url = 'uploads/csvUpload?type=' + this.props.url
      }
      // console.log('profile', url, this.props.url, this.props.type)
      fetchMethodRequest('POST', url, this.state.picture, 'upload')
        .then(async (response) => {
          if (response && response.respCode) {
            if (response.fileName || response.fineName) {
              let fileName = response.fileName ? response.fileName : response.fineName;
              this.setState({ fileName: fileName });
              let data = JSON.parse(localStorage.getItem('loginCredentials'))
              data.photo = fileName;
              localStorage.setItem('loginCredentials', JSON.stringify(data))
              // call function in parent
              if (this.props.getFileName) {
                this.props.getFileName(fileName);
              }
              if (this.props.type == 'profile') {
                if (fileName) {
                  this.props.input.onChange(fileName);
                }
              }
              if (response.respMessage == '204' || response.respCode == 204) {
                if (this.props.type !== 'profile') {
                  showToasterMessage('Bulk upload sucessful', 'success');
                }
                this.props.reload();
              }
            }
            if (this.props.close) {
              this.props.close();
            }
          } else if (response && response.errorMessage) {
            showToasterMessage(response.errorMessage, 'error');
          } else {

            if (response.sucess && response.sucess.respMessage) {
              showToasterMessage(response.sucess.respMessage, 'success');
            } else if (response.failure && response.failure.errorMessage) {
              showToasterMessage(response.failure.errorMessage, 'error');
            }
            if (this.props.close) {
              this.props.close();
            }
          }
        }).catch((err) => {
          return err;
        });
    } else {
      return '';
    }
  }


  render() {
    return (
      <FileUpload onSelect={this.onSelect}
        mode="basic"
        name="file"
        uurl="./upload.php"
        maxFileSize={1000000}
        auto={false}
        chooseLabel={this.props.label ? this.props.label : "Browse"}
        accept={this.props.acceptType} />
    )
  }
}
