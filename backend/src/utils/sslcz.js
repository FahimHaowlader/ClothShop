import SSLCommerzPayment from 'sslcommerz-lts';

const store_id = process.env.SSL_STORE_ID || 'cloth6af301dae3bfb';
const store_passwd = process.env.SSL_STORE_PASSWD || 'JslegYZWgelw';
const is_live = process.env.NODE_ENV === 'production'; // true for live, false for sandbox

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
export default sslcz;