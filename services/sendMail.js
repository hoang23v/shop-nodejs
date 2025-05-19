import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anan123456a123@gmail.com',
    pass: 'mykazstlkedledgp', // app password thật của bạn
  },
});

export async function sendProductEmail(toEmail, product, downloadFile) {
  const mailOptions = {
    from: 'anan123456a123@gmail.com',
    to: toEmail,
    subject: `Cảm ơn bạn đã mua sản phẩm ${product.name}`,
    text: `Chào bạn,\n\nCảm ơn bạn đã mua sản phẩm ${product.name}.\nBạn có thể tải file qua link sau:\n${downloadFile.googleDriveLink}\n\nTrân trọng!`,
    // Bỏ phần attachments vì bạn không gửi file đính kèm nữa
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email gửi thành công');
  } catch (error) {
    console.error('Lỗi gửi email:', error);
  }
}
