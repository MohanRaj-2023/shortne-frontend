// actions/authActions.js
export const ClearResetPassword = () => {
  return {
    type: 'CLEAR_RESET_PASSWORD',
  };
};

export const ClearNewPassword = () => {
  return {
    type: 'CLEAR_NEW_PASSWORD',
  };
};


export const ClearSignin = ()=>{
  return {
    type: 'CLEAR_SIGNIN_SCREEN'
  }
}


export const ClearSignup = ()=>{
  return {
    type: 'CLEAR_SIGNUP_SCREEN'
  }
}