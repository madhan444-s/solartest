import React from "react";
import configImages from "../../config/configImages";
import RegisterForm from "./components/Register";
import config from '../../config/config';
// import LogoUI from "../LogoUI/logoUI"
const Register = () => (

  // <div className="account_login">
  //   <div className="account__wrapper_login" style={{ "width": "50%" }}>
  //     <div className="account__card_login p-2">
  //       <div className='row justifyContentLogin'>
  //         <div className='col-sm-6 textcenter mt-1 pl-0 pr-0 mb-4'>
  //           {/* <LogoUI /> */}
  //           <h2 className='pt-3' style={{ textAlign: 'center' }}>
  //             <b>NOCODE</b>
  //           </h2>
  //           <h2 className='pt-3' style={{ textAlign: 'center' }}>
  //             <img
  //               src={configImages.loginImage}
  //               alt="image"
  //               style={{ width: "120px", height: "120px" }} />  </h2>

  //         </div>
  //         <div className='col-sm-6 vertical_middle width_90 mt-3'>
  //           <div className='width_90'>
  //             <RegisterForm onSubmit />
  //           </div>

  //         </div>
  //       </div>
  //     </div>
  //   </div>
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
              <RegisterForm onSubmit />
            </div>
          </div>
        </div>
      </div>
      : config.selectedLoginScreenName && config.selectedLoginScreenName == "2" ?
        <div className='common-login-container'>
          <div className='login-2 register-2 card'>
            <div className='login-img'>
              <img src={configImages.loginSideImage} alt="" className='h-100' />
            </div>
            <div className='card login2-form'>
              <div className='card-body'>
                <div className='text-center w-100 pb-4 '>
                  <img src={configImages.loginImage} className='login-logo'></img>
                </div>
                <RegisterForm onSubmit />
              </div>
            </div>
          </div>
        </div>
        : config.selectedLoginScreenName && config.selectedLoginScreenName == "3" ?
          <div className='common-login-container'>
            <div className='login-2 register-2 card'>

              <div className='card login2-form'>
                <div className='card-body'>
                  <div className='text-center w-100 pb-4 '>
                    <img src={configImages.loginImage} className='login-logo'></img>
                  </div>
                  <RegisterForm onSubmit />
                </div>
              </div>
              <div className='login-img'>
                <img src={configImages.loginSideImage} alt="" className='h-100' />
              </div>
            </div>
          </div>
          : config.selectedLoginScreenName && config.selectedLoginScreenName == "4" ?
            <div className='common-login-container'>
              <div className='login-4 '>
                <div className='login-side-logo'>
                  <img src={configImages.loginImage} alt="" className='h-100' />
                </div>
                <div className='border-left login-form'>
                  <div className='p-3'>
                    <RegisterForm onSubmit />
                  </div>
                </div>
              </div>
            </div>

            : null}
  </div >
);

export default Register;
