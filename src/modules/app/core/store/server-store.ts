import type { AppStore } from '@/modules/app/core/store/create-store';

import { ssrApp } from '@/modules/main.ssr';

let serverStore: AppStore;

export function getServerStore(): AppStore {
    if (typeof window === 'undefined' && !serverStore) {
        serverStore = ssrApp.store;
    }
    return serverStore;
}
