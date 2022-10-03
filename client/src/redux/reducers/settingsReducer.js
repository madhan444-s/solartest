import {
    SETTINGS_DATA ,
    // AUTHENTICATE_ERROR_AUTH,
  } from '../actions/settingsAction';
  
  const initialState = {
    data: {},
  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case SETTINGS_DATA:
        return { settings: action.data };
      default:
        return state;
    }
  } 
  