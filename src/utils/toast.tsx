import React from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, AlertTriangle, XCircle, Info as InfoIcon } from 'lucide-react';

class Toastify {
  success(title: string, desc: string) {
    return toast.success(<Success title={title} desc={desc} />, {
      icon: () => <CheckCircle className="text-green-500" size={20} />
    });
  }

  warning(title: string, desc: string) {
    return toast.warning(<Warning title={title} desc={desc} />, {
      icon: () => <AlertTriangle className="text-yellow-500" size={20} />
    });
  }

  error(title: string, desc: string) {
    return toast.error(<Error title={title} desc={desc} />, {
      icon: () => <XCircle className="text-red-500" size={20} />
    });
  }

  info(title: string, desc: string) {
    return toast.info(<Info title={title} desc={desc} />, {
      icon: () => <InfoIcon className="text-blue-500" size={20} />
    });
  }
}

interface ToastProps {
  title?: string;
  desc?: string;
}


const ToastContent: React.FC<ToastProps> = ({ title = '', desc = '' }) => (
  <div style={{ marginLeft: 20 }}>
    <h4 style={{ color: '#fff', fontSize: '14px', padding: 0, margin: 0, fontFamily: 'Poppins' }}>{title}</h4>
    <p style={{ color: '#C8C5C5', fontSize: '12px', padding: 0, margin: 0, fontFamily: 'Poppins' }}>{desc}</p>
  </div>
);

const Success: React.FC<ToastProps> = ({ title, desc }) => (
  <div className="Toastify__toast--success">
    <ToastContent title={title} desc={desc} />
  </div>
);

const Warning = ToastContent;
const Error = ToastContent;
const Info = ToastContent;


export default new Toastify();
