import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  fullName: string,
  resetToken: string,
): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const expiresMinutes = process.env.PASSWORD_RESET_EXPIRES_IN_MINUTES || '30';

  await transporter.sendMail({
    from: `"UniMove" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Đặt lại mật khẩu UniMove',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Đặt lại mật khẩu</h2>
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu. Link có hiệu lực trong <strong>${expiresMinutes} phút</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background-color: #2563EB; color: white; padding: 12px 32px;
                    text-decoration: none; border-radius: 6px; font-size: 16px;">
            Đặt lại mật khẩu
          </a>
        </div>
        <p>Hoặc copy link sau vào trình duyệt:</p>
        <p style="word-break: break-all; color: #6B7280;">${resetUrl}</p>
        <hr style="margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
          Tài khoản của bạn vẫn an toàn.
        </p>
      </div>
    `,
  });
}
