import React from 'react';
import {Link} from 'react-router-dom';
import Oidc from 'oidc-client';

class Footer extends React.Component {
  render() {
    return (
      <div className="footer" id="footer">
      <div className="banner-footer">
        <p>HHL<br />Mua hàng online với nhiều ưu đãi hơn tại HHL</p>
      </div>
      <div className="content-footer padding-gear-40">
        <div className="col-6 content-left-footer"><b>HHL.COM - HI-END PC &amp; GAMING GEAR</b>
          <br /><b>CÔNG TY TNHH CÔNG NGHỆ HHL</b>
          <br /><br />Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh
          <br />Điện thoại: 1800 0000 (miễn phí) - Bảo hành: nhánh số 0
          <br />Email: kinhdoanh@HHL.com
          <p className="p-blue"><b><br />Hotline: 1800 6975
              <br />Chính sách bảo mật và hình thức thanh toán</b></p>
          <br /><b>THỜI GIAN LÀM VIỆC: 08:30 - 21:30 TỪ THỨ 2 ĐẾN CHỦ NHẬT</b>
          <br /><br />
          <a href="http://online.gov.vn/CustomWebsiteDisplay.aspx?DocId=52800">
            <img src="images/logobct.png" style={{maxWidth: '400px'}} />
          </a>
        </div>
        <div className="col-6">
          <p><b>BẢN ĐỒ TỚI HHL</b><br /><br /></p>
          <div className="mapouter">
            <div className="gmap_canvas"><iframe width={600} height={500} id="gmap_canvas" src="https://maps.google.com/maps?q=%C4%91%E1%BA%A1i%20h%E1%BB%8Dc%20s%C3%A0i%20g%C3%B2n&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder={0} scrolling="no" marginHeight={0} marginWidth={0} /></div>
            <style dangerouslySetInnerHTML={{__html: "\n            .mapouter {\n              position: relative;\n              height: 400px;\n            }\n\n            .gmap_canvas {\n              overflow: hidden;\n              background: none !important;\n              height: 400px;\n            }\n          " }} />
          </div>
        </div>
      </div>
    </div>
    );
  }
}
  
export default Footer;
  