import { toast } from 'react-toastify';

// for CSS animation effects and display toast 
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

toast.configure();

const showToasterMessage = async (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        });
    } else if (type === 'error') {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
    } else if (type === 'warning') {
        toast.warn(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
    }
}

export default showToasterMessage;