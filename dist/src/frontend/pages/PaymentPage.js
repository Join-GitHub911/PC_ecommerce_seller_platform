"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentPage = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const PaymentMethod_1 = require("../../entities/PaymentMethod");
const api_1 = require("../utils/api");
const logger_1 = require("../../utils/logger");
const PaymentPage = () => {
    const { orderId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [selectedMethod, setSelectedMethod] = (0, react_1.useState)(PaymentMethod_1.PaymentMethod.ALIPAY);
    const [paymentUrl, setPaymentUrl] = (0, react_1.useState)('');
    const [qrCode, setQrCode] = (0, react_1.useState)('');
    const [status, setStatus] = (0, react_1.useState)('pending');
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const fetchOrderAmount = async () => {
            try {
                const response = await api_1.api.get(`/orders/${orderId}`);
                setAmount(response.data.amount);
            }
            catch (error) {
                logger_1.logger.error('Failed to fetch order amount', { error });
                setError('获取订单金额失败');
            }
        };
        fetchOrderAmount();
    }, [orderId]);
    const handlePayment = async () => {
        try {
            const response = await api_1.api.post('/payments/create', {
                orderId,
                method: selectedMethod,
                amount
            });
            if (response.data.success) {
                const { paymentUrl, qrCode } = response.data.data;
                if (paymentUrl) {
                    setPaymentUrl(paymentUrl);
                    window.location.href = paymentUrl;
                }
                else if (qrCode) {
                    setQrCode(qrCode);
                }
            }
            else {
                setError(response.data.message);
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to create payment', { error });
            setError('创建支付失败');
        }
    };
    const checkPaymentStatus = async () => {
        try {
            const response = await api_1.api.get(`/payments/${orderId}/status`);
            if (response.data.success) {
                setStatus(response.data.data.status);
                if (response.data.data.status === 'success') {
                    navigate(`/orders/${orderId}`);
                }
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to check payment status', { error });
        }
    };
    (0, react_1.useEffect)(() => {
        if (qrCode) {
            const interval = setInterval(checkPaymentStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [qrCode]);
    return (<div className="payment-page">
      <h1>支付订单</h1>
      <div className="payment-info">
        <p>订单号: {orderId}</p>
        <p>支付金额: ¥{amount.toFixed(2)}</p>
      </div>

      <div className="payment-methods">
        <h2>选择支付方式</h2>
        <div className="method-options">
          <label>
            <input type="radio" value={PaymentMethod_1.PaymentMethod.ALIPAY} checked={selectedMethod === PaymentMethod_1.PaymentMethod.ALIPAY} onChange={(e) => setSelectedMethod(e.target.value)}/>
            支付宝
          </label>
          <label>
            <input type="radio" value={PaymentMethod_1.PaymentMethod.WECHAT} checked={selectedMethod === PaymentMethod_1.PaymentMethod.WECHAT} onChange={(e) => setSelectedMethod(e.target.value)}/>
            微信支付
          </label>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {qrCode && (<div className="qr-code">
          <h3>请使用微信扫码支付</h3>
          <img src={qrCode} alt="支付二维码"/>
          <p>支付状态: {status}</p>
        </div>)}

      <button onClick={handlePayment} disabled={!amount || !!qrCode}>
        确认支付
      </button>
    </div>);
};
exports.PaymentPage = PaymentPage;
//# sourceMappingURL=PaymentPage.js.map