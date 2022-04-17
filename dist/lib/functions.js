"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editLocalized = exports.replyLocalized = exports.sendLocalized = exports.resolveKey = exports.fetchT = exports.fetchLanguage = void 0;
const pieces_1 = require("@sapphire/pieces");
const utilities_1 = require("@sapphire/utilities");
const discord_js_1 = require("discord.js");
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
function fetchLanguage(target) {
    // Handle Interactions:
    if (target instanceof discord_js_1.BaseCommandInteraction || target instanceof discord_js_1.MessageComponentInteraction) {
        return resolveLanguage({ channel: target.channel, guild: target.guild, user: target.user });
    }
    // Handle Message:
    if (target instanceof discord_js_1.Message) {
        return resolveLanguage({ channel: target.channel, guild: target.guild, user: target.author });
    }
    // Handle Guild:
    if (target instanceof discord_js_1.Guild) {
        return resolveLanguage({ channel: null, guild: target, user: null });
    }
    // Handle DMChannel:
    if (target.type === 'DM') {
        return resolveLanguage({ channel: target, guild: null, user: null });
    }
    // Handle any other channel:
    return resolveLanguage({ channel: target, guild: target.guild, user: null });
}
exports.fetchLanguage = fetchLanguage;
/**
 * Retrieves the language-assigned function from i18next designated to a target's preferred language code.
 * @since 2.0.0
 * @param target The target to fetch the language from.
 * @returns The language function from i18next.
 */
async function fetchT(target) {
    return pieces_1.container.i18n.getT(await fetchLanguage(target));
}
exports.fetchT = fetchT;
/**
 * Resolves a key and its parameters.
 * @since 2.0.0
 * @param target The target to fetch the language key from.
 * @param key The i18next key.
 * @param values The values to be passed to TFunction.
 * @returns The data that `key` held, processed by i18next.
 */
async function resolveKey(target, key, options) {
    return pieces_1.container.i18n.format(await fetchLanguage(target), key, options);
}
exports.resolveKey = resolveKey;
async function sendLocalized(target, options) {
    const channel = resolveTextChannel(target);
    return channel.send(await resolveOverloads(target, options));
}
exports.sendLocalized = sendLocalized;
async function replyLocalized(target, options) {
    // Handle Interactions:
    if (target instanceof discord_js_1.BaseCommandInteraction || target instanceof discord_js_1.MessageComponentInteraction) {
        return target.reply(await resolveOverloads(target, options));
    }
    // Handle Message:
    return target.reply(await resolveOverloads(target, options));
}
exports.replyLocalized = replyLocalized;
async function editLocalized(target, options) {
    // Handle Interactions:
    if (target instanceof discord_js_1.BaseCommandInteraction || target instanceof discord_js_1.MessageComponentInteraction) {
        return target.editReply(await resolveOverloads(target, options));
    }
    // Handle Message:
    return target.edit(await resolveOverloads(target, options));
}
exports.editLocalized = editLocalized;
/**
 * @internal
 */
async function resolveLanguage(context) {
    Object.defineProperty(context, 'author', {
        get: () => {
            process.emitWarning("Using InternationalizationContext's `author` property is deprecated and will be removed in the next major version. Use `InternationalizationContext.user` instead.", 'DeprecationWarning');
            return context.user;
        }
    });
    const lang = await pieces_1.container.i18n.fetchLanguage(context);
    return lang ?? context.guild?.preferredLocale ?? pieces_1.container.i18n.options.defaultName ?? 'en-US';
}
/**
 * @internal
 */
function resolveTextChannel(target) {
    if (target instanceof discord_js_1.Message)
        return target.channel;
    if (target.isText())
        return target;
    throw new TypeError(`Cannot resolve ${target.name} to a text-based channel.`);
}
/**
 * @internal
 */
async function resolveOverloads(target, options) {
    if ((0, utilities_1.isObject)(options)) {
        const casted = options;
        return { ...options, content: await resolveKey(target, casted.keys, casted.formatOptions) };
    }
    return { content: await resolveKey(target, options) };
}
//# sourceMappingURL=functions.js.map