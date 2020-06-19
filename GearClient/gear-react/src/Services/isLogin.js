import Oidc from 'oidc-client';

function IsLogin()  {
  return new Promise((resolve, reject) => {
    var config = {
      authority: "http://localhost:5000",
      client_id: "spa",
      redirect_uri: "http://localhost:5003/redirect",
      response_type: "code",
      scope:"openid profile email address phone gearapi",
      post_logout_redirect_uri : "http://localhost:5003/",
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    };
  
    var mgr = new Oidc.UserManager(config);
  
    mgr.getUser().then(user => {
      if(user) {
        resolve(user);
      }
      reject("Chưa đăng nhập");
    });
  })
  
}

export default IsLogin;