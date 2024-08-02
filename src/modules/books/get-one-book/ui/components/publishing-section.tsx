import { FC } from 'react';
import { useTranslation } from 'react-i18next'

export const PublishingSection: FC = () => {
  const { t } = useTranslation('home');
    return (
        <div>
            <div>
                <span>2021 - Lumen | Français | 684 pages</span>
                <div>
                    <select>
                        <option value='notOwned'>{t('notOwned')}</option>
                        <option value='inProgress'>{t('inProgress')}</option>
                        <option value='toRead'>{t('toRead')}</option>
                        <option value='wishlist'>{t('whislist')}</option>
                        <option value='giveUp'>{t('giveUp')}</option>
                    </select>
                    <button>{t('valid')}</button>
                </div>
            </div>
        </div>
    );
};