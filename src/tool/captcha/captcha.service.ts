import { BadRequestException, Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import { CaptchaSession } from 'src/dto/user.dto';

@Injectable()
export class CaptchaService {
  generateCaptcha(session: CaptchaSession) {
    const canvas = createCanvas(150, 50);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 150, 50);

    // Generate random text
    const captchaText = Math.random().toString(36).substring(2, 8); // Random 6-character string

    // Draw text
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(captchaText, 25, 35);

    // Optional: Add noise
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 150, Math.random() * 50);
      ctx.lineTo(Math.random() * 150, Math.random() * 50);
      ctx.stroke();
    }

    session.captcha = captchaText;
    return { image: canvas.toDataURL() };
  }

  verifyCaptcha(text: string, session: CaptchaSession) {
    if (!session.captcha) {
      throw new BadRequestException('no captcha');
    }

    if (text === session.captcha) {
      session.captcha = null;
      return { success: true };
    } else {
      throw new BadRequestException('captcha not correct!');
    }
  }
}
