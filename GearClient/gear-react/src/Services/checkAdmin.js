import Oidc from 'oidc-client';

function checkAdmin() {
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

    return new Promise((resolve, reject) => {
        var JWTdecode = require('jwt-decode');
        mgr.getUser().then(user_ => {
            if(user_) {
                var role = JWTdecode(user_.access_token).role;
                if(role === "Admin") {
                    resolve("Admin");
                }
                else {
                    reject("Not admin");
                }
            }
            else {
                reject("Chua dang nhap");
            }
        });
    });
    

}
export default checkAdmin;