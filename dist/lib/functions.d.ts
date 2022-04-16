import { CommandInteraction, Message } from 'discord.js';
import { NonNullObject } from '@sapphire/utilities';
import type { StringMap, TFunctionKeys, TFunctionResult, TOptions } from 'i18next';
import type { ChannelTarget, LocalizedInteractionReplyOptions, LocalizedMessageOptions, Target } from './types';
/**
 * Retrieves the language name for a specific target, using {@link InternationalizationHandler.fetchLanguage}.
 * If {@link InternationalizationHandler.fetchLanguage} is not defined or this function returns a nullish value,
 * then there will be a series of fallback attempts in the following descending order:
 * 1. Returns {@link Guild.preferredLocale}.
 * 2. Returns {@link InternationalizationOptions.defaultName} if no guild was provided.
 * 3. Returns `'en-US'` if nothing else was found.
 * @since 2.0.0
 * @param target The target to fetch the language from.
 * @see {@link resolveLanguage}
 * @returns The name of the language key.
 */
export declare function fetchLanguage(target: Target): Promise<string>;
/**
 * Retrieves the language-assigned function from i18next designated to a target's preferred language code.
 * @since 2.0.0
 * @param target The target to fetch the language from.
 * @returns The language function from i18next.
 */
export declare function fetchT(target: Target): Promise<import("i18next").TFunction>;
/**
 * Resolves a key and its parameters.
 * @since 2.0.0
 * @param target The target to fetch the language key from.
 * @param key The i18next key.
 * @param values The values to be passed to TFunction.
 * @returns The data that `key` held, processed by i18next.
 */
export declare function resolveKey<TResult extends TFunctionResult = string, TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: Target, key: TKeys | TKeys[], options?: TOptions<TInterpolationMap>): Promise<TResult>;
/**
 * Send a localized message using the language `keys` from your i18next language setup.
 * @since 2.0.0
 * @param target The target to send the message to.
 * @param keys The language keys to be sent.
 * @example
 * ```typescript
 * // Using a string to specify the key to send
 * await sendLocalized(message, 'commands/ping:loading');
 * // ➡ "Pinging..."
 * ```
 */
export declare function sendLocalized<TKeys extends TFunctionKeys = string>(target: ChannelTarget, keys: TKeys | TKeys[]): Promise<Message>;
/**
 * Send a localized message using an object of {@link LocalizedMessageOptions}.
 * @since 2.0.0
 * @param target The target to send the message to.
 * @param options The options to be sent, requiring at least `keys` to be passed.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await sendLocalized(message, { keys: 'commands/ping:loading' });
 * // ➡ "Pinging..."
 * ```
 * @example
 * ```typescript
 * // Passing interpolation options into i18next
 * const latency = 42;
 *
 * await sendLocalized(message, {
 * 	keys: 'commands/ping:loading',
 * 	formatOptions: { latency }
 * });
 * // ➡ "Pinging... current latency is 42ms."
 * ```
 */
export declare function sendLocalized<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: ChannelTarget, options: LocalizedMessageOptions<TKeys, TInterpolationMap>): Promise<Message>;
/**
 * Replies to another message using the language `keys` from your i18next language setup.
 * @since 2.0.0
 * @param target The message to reply to.
 * @param keys The language keys to be sent.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await replyLocalized(message, 'commands/ping:loading');
 * // ➡ "Pinging..."
 * ```
 */
export declare function replyLocalized<TKeys extends TFunctionKeys = string>(target: Message, keys: TKeys | TKeys[]): Promise<Message>;
/**
 * Replies to another message using an object of {@link LocalizedMessageOptions}.
 * @since 2.0.0
 * @param target The message to reply to.
 * @param options The options to be sent, requiring at least `keys` to be passed.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await replyLocalized(message, { keys: 'commands/ping:loading' });
 * // ➡ "Pinging..."
 * ```
 * @example
 * ```typescript
 * // Passing interpolation options into i18next
 * const latency = 42;
 *
 * await replyLocalized(message, {
 * 	keys: 'commands/ping:loading',
 * 	formatOptions: { latency }
 * });
 * // ➡ "Pinging... current latency is 42ms."
 * ```
 */
export declare function replyLocalized<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: Message, options: LocalizedMessageOptions<TKeys, TInterpolationMap>): Promise<Message>;
/**
 * Replies to the interaction using the language `keys` from your i18next language setup.
 * @since 2.0.0
 * @param target The interaction to reply to.
 * @param keys The language keys to be sent.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await replyLocalized(interaction, 'commands/ping:loading');
 * // ➡ "Pinging..."
 * ```
 */
export declare function replyLocalized<TKeys extends TFunctionKeys = string>(target: CommandInteraction, keys: TKeys | TKeys[]): Promise<ReturnType<CommandInteraction['reply']>>;
/**
 * Replies to the interaction using an object of {@link LocalizedMessageOptions}.
 * @since 2.0.0
 * @param target The interaction to reply to.
 * @param options The options to be sent, requiring at least `keys` to be passed.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await replyLocalized(interaction, { keys: 'commands/ping:loading' });
 * // ➡ "Pinging..."
 * ```
 * @example
 * ```typescript
 * // Passing interpolation options into i18next
 * const latency = 42;
 *
 * await replyLocalized(interaction, {
 * 	keys: 'commands/ping:loading',
 * 	formatOptions: { latency }
 * });
 * // ➡ "Pinging... current latency is 42ms."
 * ```
 */
export declare function replyLocalized<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: CommandInteraction, options: LocalizedInteractionReplyOptions<TKeys, TInterpolationMap>): Promise<ReturnType<CommandInteraction['reply']>>;
/**
 * Edits a message using the language `keys` from your i18next language setup.
 * @since 2.0.0
 * @param target The message to edit.
 * @param keys The language keys to be sent.
 * @example
 * ```typescript
 * // Using a string to specify the key to send
 * await editLocalized(message, 'commands/ping:fail');
 * // ➡ "Pong!"
 * ```
 */
export declare function editLocalized<TKeys extends TFunctionKeys = string>(target: Message, keys: TKeys | TKeys[]): Promise<Message>;
/**
 * Edits a message using an objects option.
 * @since 2.0.0
 * @param target The message to edit.
 * @param options The options to be sent, requiring at least `keys` to be passed.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await editLocalized(message, { keys: 'commands/ping:fail' });
 * // ➡ "Pong!"
 * ```
 * @example
 * ```typescript
 * // Passing interpolation options into i18next
 * const latency = 42;
 * const took = 96;
 *
 * await editLocalized(message, {
 * 	keys: 'commands/ping:success',
 * 	formatOptions: { latency, took }
 * });
 * // ➡ "Pong! Took me 96ms to reply, and my heart took 42ms to beat!"
 * ```
 */
export declare function editLocalized<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: Message, options: LocalizedMessageOptions<TKeys, TInterpolationMap>): Promise<Message>;
/**
 * Edits a deferred/replied interaction using the language `keys` from your i18next language setup.
 * @since
 * @param target The interaction to editReply.
 * @param options The language keys to be sent.
 * @example
 * ```typescript
 * // Using a string to specify the key to send
 * await editLocalized(interaction, 'commands/ping:fail');
 * // ➡ "Pong!"
 * ```
 */
export declare function editLocalized<TKeys extends TFunctionKeys = string>(target: CommandInteraction, keys: TKeys | TKeys[]): Promise<ReturnType<CommandInteraction['editReply']>>;
/**
 * Edits a deferred/replied interaction using an objects option.
 * @since
 * @param target The interaction to editReply.
 * @param options The options to be sent, requiring at least `keys` to be passed.
 * @example
 * ```typescript
 * // Using an object to specify the key to send
 * await editLocalized(interaction, { keys: 'commands/ping:fail' });
 * // ➡ "Pong!"
 * ```
 * @example
 * ```typescript
 * // Passing interpolation options into i18next
 * const latency = 42;
 * const took = 96;
 *
 * await editLocalized(interaction, {
 * 	keys: 'commands/ping:success',
 * 	formatOptions: { latency, took }
 * });
 * // ➡ "Pong! Took me 96ms to reply, and my heart took 42ms to beat!"
 * ```
 */
export declare function editLocalized<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>(target: CommandInteraction, options: LocalizedInteractionReplyOptions<TKeys, TInterpolationMap>): Promise<ReturnType<CommandInteraction['editReply']>>;
//# sourceMappingURL=functions.d.ts.map