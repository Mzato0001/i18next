import { Awaitable, NonNullObject } from '@sapphire/utilities';
import { StringMap, TFunction, TFunctionKeys, TFunctionResult, TOptions } from 'i18next';
import { i18nextFsBackend } from 'i18next-fs-backend';
import type { InternationalizationContext, InternationalizationOptions } from './types';
/**
 * A generalized class for handling `i18next` JSON files and their discovery.
 * @since 1.0.0
 */
export declare class InternationalizationHandler {
    /**
     * Describes whether {@link InternationalizationHandler.init} has been run and languages are loaded in {@link InternationalizationHandler.languages}.
     * @since 1.0.0
     */
    languagesLoaded: boolean;
    /**
     * A `Set` of initially loaded namespaces.
     * @since 1.2.0
     */
    namespaces: Set<string>;
    /**
     * A `Map` of `i18next` language functions keyed by their language code.
     * @since 1.0.0
     */
    readonly languages: Map<string, TFunction>;
    /**
     * The options InternationalizationHandler was initialized with in the client.
     * @since 1.0.0
     */
    readonly options: InternationalizationOptions;
    /**
     * The director passed to `i18next-fs-backend`.
     * Also used in {@link InternationalizationHandler.walkLanguageDirectory}.
     * @since 1.2.0
     */
    readonly languagesDirectory: string;
    /**
     * The backend options for `i18next-fs-backend` used by `i18next`.
     * @since 1.0.0
     */
    protected readonly backendOptions: i18nextFsBackend.i18nextFsBackendOptions;
    /**
     * @param options The options that `i18next`, `i18next-fs-backend`, and {@link InternationalizationHandler} should use.
     * @since 1.0.0
     * @constructor
     */
    constructor(options?: InternationalizationOptions);
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
    fetchLanguage: (context: InternationalizationContext) => Awaitable<string | null>;
    /**
     * Initializes the handler by loading in the namespaces, passing the data to i18next, and filling in the {@link InternationalizationHandler#languages}.
     * @since 1.0.0
     */
    init(): Promise<void>;
    /**
     * Retrieve a raw TFunction from the passed locale.
     * @param locale The language to be used.
     * @since 1.0.0
     */
    getT(locale: string): TFunction;
    /**
     * Localizes a content given one or more keys and i18next options.
     * @since 2.0.0
     * @param locale The language to be used.
     * @param key The key or keys to retrieve the content from.
     * @param options The interpolation options.
     * @see {@link https://www.i18next.com/overview/api#t}
     * @returns The localized content.
     */
    format<TResult extends TFunctionResult = string, TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(locale: string, key: TKeys | TKeys[], options?: TOptions<TInterpolationMap>): TResult;
    /**
     * @description Skips any files that don't end with `.json`.
     * @param dir The directory that should be walked.
     * @param namespaces The currently known namespaces.
     * @param current The directory currently being traversed.
     * @since 1.0.0
     */
    walkLanguageDirectory(dir: string, namespaces?: string[], current?: string): Promise<{
        namespaces: string[];
        languages: string[];
    }>;
    reloadResources(): Promise<void>;
}
//# sourceMappingURL=InternationalizationHandler.d.ts.map