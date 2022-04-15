"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nextPlugin = void 0;
const framework_1 = require("@sapphire/framework");
const chokidar_1 = require("chokidar");
const index_1 = require("./index");
class I18nextPlugin extends framework_1.Plugin {
    static [framework_1.preGenericsInitialization](options) {
        framework_1.container.i18n = new index_1.InternationalizationHandler(options.i18n);
    }
    static async [framework_1.preLogin]() {
        await framework_1.container.i18n.init();
    }
    static [framework_1.postLogin]() {
        if (this.options.i18n?.hmr?.enabled) {
            framework_1.container.logger.info('[i18next-Plugin]: HMR enabled. Watching for languages changes.');
            const hmr = (0, chokidar_1.watch)(framework_1.container.i18n.languagesDirectory, this.options.i18n.hmr.options);
            for (const event of ['change', 'unlink'])
                hmr.on(event, () => framework_1.container.i18n.reloadResources());
        }
    }
}
exports.I18nextPlugin = I18nextPlugin;
framework_1.SapphireClient.plugins.registerPostInitializationHook(I18nextPlugin[framework_1.preGenericsInitialization], 'I18next-PreGenericsInitialization');
framework_1.SapphireClient.plugins.registerPreLoginHook(I18nextPlugin[framework_1.preLogin], 'I18next-PreLogin');
framework_1.SapphireClient.plugins.registerPostLoginHook(I18nextPlugin[framework_1.postLogin], 'I18next-PostLogin');
//# sourceMappingURL=register.js.map