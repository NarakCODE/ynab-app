import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.get('4ef9a417-02e9-4d39-ad75-9611e0fcc33c');

export default resend;
