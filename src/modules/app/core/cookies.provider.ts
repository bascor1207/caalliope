import { CookiesInterface } from '@/modules/app/core/cookies.interface';
import { destroyCookie } from 'nookies';

export class CookiesProvider implements CookiesInterface {
    destroyCookies(_context:null, cookieName: string) {
        destroyCookie(null, cookieName)
    }
}
