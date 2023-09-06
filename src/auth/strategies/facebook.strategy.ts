import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      scope: ['email'],
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<void> {
    const { name, emails } = profile;
    const email = emails[0]?.value;

    const user = await this.authService.findOrCreateUserWithOAuth2Profile({
      firstName: name.givenName,
      lastName: name.familyName,
      email,
      facebookId: profile.id,
    });

    if (!user) {
      done(new Error('User not found'), null);
    } else {
      done(null, user);
    }
  }
}
