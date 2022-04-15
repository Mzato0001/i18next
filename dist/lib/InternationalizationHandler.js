"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternationalizationHandler = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const pieces_1 = require("@sapphire/pieces");
const utilities_1 = require("@sapphire/utilities");
const promises_1 = require("fs/promises");
const i18next_1 = tslib_1.__importDefault(require("i18next"));
const i18next_fs_backend_1 = tslib_1.__importDefault(require("i18next-fs-backend"));
const path_1 = require("path");
/**
 * A generalized class for handling `i18next` JSON files and their discovery.
 * @since 1.0.0
 */
class InternationalizationHandler {
    /**
     * @param options The options that `i18next`, `i18next-fs-backend`, and {@link InternationalizationHandler} should use.
     * @since 1.0.0
     * @constructor
     */
    constructor(options) {
        /**
         * Describes whether {@link InternationalizationHandler.init} has been run and languages are loaded in {@link InternationalizationHandler.languages}.
         * @since 1.0.0
         */
        Object.defineProperty(this, "languagesLoaded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A `Set` of initially loaded namespaces.
         * @since 1.2.0
         */
        Object.defineProperty(this, "namespaces", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        /**
         * A `Map` of `i18next` language functions keyed by their language code.
         * @since 1.0.0
         */
        Object.defineProperty(this, "languages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        /**
         * The options InternationalizationHandler was initialized with in the client.
         * @since 1.0.0
         */
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The director passed to `i18next-fs-backend`.
         * Also used in {@link InternationalizationHandler.walkLanguageDirectory}.
         * @since 1.2.0
         */
        Object.defineProperty(this, "languagesDirectory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The backend options for `i18next-fs-backend` used by `i18next`.
         * @since 1.0.0
         */
        Object.defineProperty(this, "backendOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The method to be overridden by the developer.
         *
         * @note In the event that fetchLanguage is not defined or returns null / undefined, the defaulting from {@link fetchLanguage} will be used.
         * @since 2.0.0
         * @return A string for the desired language or null for no match.
         * @see {@link fetchLanguage}
         * @example
         * ```typescript
         * // Always use the same language (no per-guild configuration):
         * container.i18n.fetchLanguage = () => 'en-US';
         * ```
         * @example
         * ```typescript
         * // Retrieving the language from an SQL database:
         * container.i18n.fetchLanguage = async (context) => {
         *   const guild = await driver.getOne('SELECT language FROM public.guild WHERE id = $1', [context.guild.id]);
         *   return guild?.language ?? 'en-US';
         * };
         * ```
         * @example
         * ```typescript
         * // Retrieving the language from an ORM:
         * container.i18n.fetchLanguage = async (context) => {
         *   const guild = await driver.getRepository(GuildEntity).findOne({ id: context.guild.id });
         *   return guild?.language ?? 'en-US';
         * };
         * ```
         * @example
         * ```typescript
         * // Retrieving the language on a per channel basis, e.g. per user or guild channel (ORM example but same principles apply):
         * container.i18n.fetchLanguage = async (context) => {
         *   const channel = await driver.getRepository(ChannelEntity).findOne({ id: context.channel.id });
         *   return channel?.language ?? 'en-US';
         * };
         * ```
         */
        Object.defineProperty(this, "fetchLanguage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => null
        });
        this.options = options ?? { i18next: { ignoreJSONStructure: false } };
        this.languagesDirectory =
            this.options.defaultLanguageDirectory ?? (0, path_1.join)(pieces_1.container.client?.options?.baseUserDirectory ?? (0, pieces_1.getRootData)().root, 'languages');
        this.backendOptions = {
            loadPath: (0, path_1.join)(this.languagesDirectory, '{{lng}}', '{{ns}}.json'),
            addPath: this.languagesDirectory,
            ...this.options.backend
        };
        if ((0, utilities_1.isFunction)(this.options.fetchLanguage)) {
            this.fetchLanguage = this.options.fetchLanguage;
        }
    }
    /**
     * Initializes the handler by loading in the namespaces, passing the data to i18next, and filling in the {@link InternationalizationHandler#languages}.
     * @since 1.0.0
     */
    async init() {
        const { namespaces, languages } = await this.walkLanguageDirectory(this.languagesDirectory);
        const userOptions = (0, utilities_1.isFunction)(this.options.i18next) ? this.options.i18next(namespaces, languages) : this.options.i18next;
        const ignoreJSONStructure = userOptions?.ignoreJSONStructure ?? false;
        const skipOnVariables = userOptions?.interpolation?.skipOnVariables ?? false;
        i18next_1.default.use(i18next_fs_backend_1.default);
        await i18next_1.default.init({
            backend: this.backendOptions,
            fallbackLng: this.options.defaultName ?? 'en-US',
            initImmediate: false,
            interpolation: {
                escapeValue: false,
                ...userOptions?.interpolation,
                skipOnVariables
            },
            load: 'all',
            defaultNS: 'default',
            ns: namespaces,
            preload: languages,
            ...userOptions,
            ignoreJSONStructure
        });
        this.namespaces = new Set(namespaces);
        for (const item of languages) {
            this.languages.set(item, i18next_1.default.getFixedT(item));
        }
        this.languagesLoaded = true;
        const formatters = this.options.formatters ?? [];
        for (const { name, format } of formatters) {
            i18next_1.default.services.formatter.add(name, format);
        }
    }
    /**
     * Retrieve a raw TFunction from the passed locale.
     * @param locale The language to be used.
     * @since 1.0.0
     */
    getT(locale) {
        if (!this.languagesLoaded)
            throw new Error('Cannot call this method until InternationalizationHandler#init has been called');
        const t = this.languages.get(locale);
        if (t)
            return t;
        throw new ReferenceError('Invalid language provided');
    }
    /**
     * Localizes a content given one or more keys and i18next options.
     * @since 2.0.0
     * @param locale The language to be used.
     * @param key The key or keys to retrieve the content from.
     * @param options The interpolation options.
     * @see {@link https://www.i18next.com/overview/api#t}
     * @returns The localized content.
     */
    format(locale, key, options) {
        if (!this.languagesLoaded)
            throw new Error('Cannot call this method until InternationalizationHandler#init has been called');
        const language = this.languages.get(locale);
        if (!language)
            throw new ReferenceError('Invalid language provided');
        const missingHandlers = this.options.defaultMissingKey
            ? { defaultValue: language(this.options.defaultMissingKey, { replace: { key } }) }
            : undefined;
        return language(key, { ...missingHandlers, ...options });
    }
    /**
     * @description Skips any files that don't end with `.json`.
     * @param dir The directory that should be walked.
     * @param namespaces The currently known namespaces.
     * @param current The directory currently being traversed.
     * @since 1.0.0
     */
    async walkLanguageDirectory(dir, namespaces = [], current = '') {
        const directory = await (0, promises_1.opendir)(dir);
        const languages = [];
        for await (const entry of directory) {
            const fn = entry.name;
            if (entry.isDirectory()) {
                // This structure may very well be changed in future.
                // See i18next/i18next-fs-backend#13
                const isLanguage = fn.includes('-');
                if (isLanguage)
                    languages.push(fn);
                ({ namespaces } = await this.walkLanguageDirectory((0, path_1.join)(dir, fn), namespaces, isLanguage ? '' : `${fn}/`));
            }
            else if (entry.name.endsWith('.json')) {
                namespaces.push(`${current}${fn.substr(0, fn.length - 5)}`);
            }
        }
        return { namespaces: [...new Set(namespaces)], languages };
    }
    async reloadResources() {
        const result = await (0, framework_1.fromAsync)(async () => {
            let languages = this.options.hmr?.languages;
            let namespaces = this.options.hmr?.namespaces;
            if (!languages || !namespaces) {
                const languageDirectoryResult = await this.walkLanguageDirectory(this.languagesDirectory);
                languages ?? (languages = languageDirectoryResult.languages);
                namespaces ?? (namespaces = languageDirectoryResult.namespaces);
            }
            await i18next_1.default.reloadResources(languages, namespaces);
            pieces_1.container.logger.info('[i18next-Plugin] Reloaded language resources.');
        });
        if ((0, framework_1.isErr)(result)) {
            pieces_1.container.logger.error('[i18next-Plugin]: Failed to reload language resources.', result.error);
        }
    }
}
exports.InternationalizationHandler = InternationalizationHandler;
//# sourceMappingURL=InternationalizationHandler.js.map