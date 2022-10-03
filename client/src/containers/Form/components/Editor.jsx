import React from 'react';
import { Editor } from 'primereact/editor';


// config file
export default class SourceEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    onChangeText = (e) => {
        if (this.props.getEditorText) {
            this.props.getEditorText(e,this.props.name)
        }
    }

    render() {
        return (
            <div>
                <Editor
                    style={{ height: '320px' }}
                    value={this.props.value}
                    onTextChange={this.onChangeText} />
            </div>
        );
    }
}