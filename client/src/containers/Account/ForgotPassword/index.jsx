import React from 'react';
import ForgotPasswordPage from './components/ForgotPassword';
import config from '../../../config/config';
import configImages from '../../../config/configImages';
const ForgotPasswordScreen = () => (
    // <div className="account">
    //     <div className="account__wrapper">
    //         <div className="account__card">
    //             <div style={{ textAlign: 'center', marginBottom: 15 }}>
    //                 <h3>Forgot Password</h3>
    //             </div>
    //             <ForgotPasswordPage onSubmit />
    //         </div>
    //     </div>
    // </div>

    <div>
        {config.selectedLoginScreenName && config.selectedLoginScreenName == "1" ?

            <div className='common-login-container'>
                <div className='login1'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='text-center w-100 pb-4 '>
                                <img src={configImages.loginImage} className='login-logo'></img>
                            </div>
                            <ForgotPasswordPage onSubmit />
                        </div>
                    </div>
                </div>
            </div>
            : config.selectedLoginScreenName && config.selectedLoginScreenName == "2" ?
                <div className='common-login-container'>
                    <div className='login-2 card'>
                        <div className='login-img'>
                            <img src={configImages.loginSideImage} alt="" className='h-100' />
                        </div>
                        <div className='card login2-form'>
                            <div className='card-body'>
                                <div className='text-center w-100 pb-4 '>
                                    <img src={configImages.loginImage} className='login-logo'></img>
                                </div>

                                <ForgotPasswordPage onSubmit />
                            </div>
                        </div>
                    </div>
                </div>
                : config.selectedLoginScreenName && config.selectedLoginScreenName == "3" ?
                    <div className='common-login-container'>
                        <div className='login-2 card'>

                            <div className='card login2-form'>
                                <div className='card-body'>
                                    <div className='text-center w-100 pb-4 '>
                                        <img src={configImages.loginImage} className='login-logo'></img>
                                    </div>

                                    <ForgotPasswordPage onSubmit />
                                </div>
                            </div>
                            <div className='login-img'>
                                <img src={configImages.loginSideImage} alt="" className='h-100' />
                            </div>
                        </div>
                    </div>
                    : config.selectedLoginScreenName && config.selectedLoginScreenName == "4" ?
                        <div className='common-login-container'>
                            <div className='login-4'>
                                <div className='login-side-logo'>
                                    <img src={configImages.loginImage} alt="" className='h-100' />
                                </div>
                                <div className='border-left login-form'>
                                    <div className='p-3'>

                                        <ForgotPasswordPage onSubmit />

                                    </div>
                                </div>

                            </div>
                        </div>

                        : null}
    </div>
);

export default ForgotPasswordScreen;
