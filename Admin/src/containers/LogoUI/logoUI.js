import React from 'react';
import config from '../../config/config';
class LogoUI extends React.Component {
    render() {
        return (
            <div className='logo'>{config.appName}</div>
        )
    }

}
export default LogoUI;
