import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { AuthService } from '../auth.service';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
      callbackURL: process.env.VK_CALLBACK_URL,
      scope: ['email'],
      profileFields: ['email', 'first_name', 'last_name', 'photo_100'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    params: any,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<void> {
    const email = params.email;

    const user = await this.authService.findOrCreateUserWithOAuth2Profile({
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email,
      vkId: profile.id,
    });

    if (!user) {
      done(new Error('User not found'), null);
    } else {
      done(null, user);
    }
  }
}
