import React from 'react';
import LogInForm from './components/LogInForm';
import config from '../../../config/config';
import configImages from '../../../config/configImages';
import LogoUI from '../../LogoUI/logoUI'
const LogIn = () => (
  // ~Old Login Screen changes
  // <div className="account">
  //   <div className="account__wrapper">
  //     <div className="account__card p-2">
  //       <div className='row justifyContentLogin'>
  //         <div className='col-sm-5 textcenter mt-4 pl-0 pr-0 mb-4'>
  //           {/* <LogoUI /> */}
  //           <img src={configImages.loginImage} className='hide-mobile img_htwt'></img>
  //         </div>
  //         <div className='col-sm-6 vertical_middle width_90'>
  //           <div className='width_90'>
  //             <LogInForm onSubmit />
  //           </div>
  //         </div>
  //       </div>

  //     </div>
  //   </div>
  // </div>

  //~ New Login modals
  <div>
    {config.selectedLoginScreenName && config.selectedLoginScreenName == "1" ?
      <div className='common-login-container'>
        <div className='login1'>
          <div className='card'>
            <div className='card-body'>
              <div className='text-center w-100 pb-4 '>
                <img src={configImages.loginImage} className='login-logo'></img>
              </div>
              <LogInForm onSubmit />
            </div >
          </div >
        </div >
      </div >
      : config.selectedLoginScreenName && config.selectedLoginScreenName == "2" ?
        <div className='common-login-container'>
          <div className='login-2 card'>
            <div className='login-img'>
              <img src={configImages.loginSideImage} alt="" className='h-100' />
            </div>
            <div className='card login2-form border-left'>
              <div className='card-body'>
                <div className='text-center w-100 pb-4 '>
                  <img src={configImages.loginImage} className='login-logo'></img>
                </div>
                <LogInForm onSubmit />
              </div>
            </div>
          </div>
        </div>
        : config.selectedLoginScreenName && config.selectedLoginScreenName == "3" ?
          <div className='common-login-container'>
            <div className='login-2 card'>
              <div className='card login2-form border-right'>
                <div className='card-body'>
                  <div className='text-center w-100 pb-4 '>
                    <img src={configImages.loginImage} className='login-logo'></img>
                  </div>
                  <LogInForm onSubmit />
                </div>
              </div>
              <div className='login-img'>
                <img src={configImages.loginSideImage} alt="" className='h-100' />
              </div>
            </div>
          </div>
          : config.selectedLoginScreenName && config.selectedLoginScreenName == "4" ?
            < div className='common-login-container' >
              <div className='login-4'>
                <div className='login-side-logo'>
                  <img src={configImages.loginImage} alt="" className='h-100' />
                </div>
                <div className='border-left login-form'>
                  <div className='p-3'>
                    <LogInForm onSubmit />
                  </div>
                </div>
              </div>
            </div >
            : null}
  </div >
);

export default LogIn;
