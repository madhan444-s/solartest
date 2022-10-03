import React from 'react';
import '../../scss/loader.scss';
import config from '../../config/config';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        const { loader } = this.props;
        return (
            <div className={loader ? 'loadPage' : 'loadNone'}>
                <div className="load__icon-wrap">
                    <svg className="load__icon">
                        <path fill={config.templateColor} d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                    </svg>
                </div>
            </div>
        );
    }
}