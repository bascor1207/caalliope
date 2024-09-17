import type { TranslationInterface } from '@/modules/app/core/translation.interface';

import i18n from '@/i18n';

export class I18nTranslationProvider implements TranslationInterface {
    private readonly translateKey= i18n.t

    translate(key: string): string {
        return this.translateKey(key)
    }
}
