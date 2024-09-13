import type { AppStore } from '@/modules/app/core/store/create-store';

import { SSRApp } from '@/modules/main.ssr';

let serverStore: AppStore;

export function getServerStore(): AppStore {
    if (typeof window === 'undefined' && !serverStore) {
        const ssrApp = new SSRApp();
        serverStore = ssrApp.store;
    }
    return serverStore;
}