import { Plugin, preGenericsInitialization, preLogin, postLogin, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { InternationalizationClientOptions, InternationalizationHandler } from './index';
export declare class I18nextPlugin extends Plugin {
    static [preGenericsInitialization](this: SapphireClient, options: ClientOptions): void;
    static [preLogin](this: SapphireClient): Promise<void>;
    static [postLogin](this: SapphireClient): void;
}
declare module '@sapphire/pieces' {
    interface Container {
        i18n: InternationalizationHandler;
    }
}
declare module 'discord.js' {
    interface ClientOptions extends InternationalizationClientOptions {
    }
}
//# sourceMappingURL=register.d.ts.map