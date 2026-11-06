import { Injectable } from '@angular/core';

import { Language } from '@interfaces';

@Injectable({
	providedIn: 'root',
})
export class LanguageService {
	/**
	 * List of available languages
	 */
	private languages: Language[] = [
		{
			locale: 'en',
			label: 'english',
			icon: '🇬🇧',
		},
		{
			locale: 'fr',
			label: 'français',
			icon: '🇫🇷',
		},
		{
			locale: 'de',
			label: 'deutsch',
			icon: '🇩🇪',
		},
		{
			locale: 'it',
			label: 'italiano',
			icon: '🇮🇹',
		},
		{
			locale: 'es',
			label: 'español',
			icon: '🇪🇸',
		},
		{
			locale: 'pt',
			label: 'português',
			icon: '🇵🇹',
		},
		{
			locale: 'zh-CN',
			label: '简体中文',
			icon: '🇨🇳',
		},
		{
			locale: 'zh-TW',
			label: '繁體中文',
			icon: '🇹🇼',
		},
	];

	constructor() {}

	/**
	 * Get the flag of a language
	 *
	 * @param {string} language code (en, fr, de, it, es, pt, zh-CN, zh-TW)
	 *
	 * @returns {string} the emoji flag
	 */
	public getFlag(locale: string): string {
		const lang = this.languages.find(
			(lang: Language) => lang.locale === locale
		);
		return lang ? lang.icon : '';
	}

	/**
	 * Get the label of a language
	 *
	 * @param {string} language code (en, fr, de, it, es, pt,  zh-CN, zh-TW)
	 *
	 * @returns {string} the label of the language
	 */
	public getLabel(locale: string) {
		const lang = this.languages.find(
			(lang: Language) => lang.locale === locale
		);
		return lang ? lang.label : '';
	}

	/**
	 * Get the list of available languages
	 *
	 * @returns {string[]} the list of available languages
	 */
	public getLocales(): string[] {
		return this.languages.map((lang: Language) => lang.locale);
	}

	/**
	 * Get the available language closest to a locale
	 *
	 * @param {string} locale a browser or stored locale
	 *
	 * @returns {string} an available language, en by default
	 */
	public resolve(locale: string | null | undefined): string {
		const locales = this.getLocales();

		if (!locale) {
			return 'en';
		}

		const exact = locales.find(
			(candidate: string) => candidate.toLowerCase() === locale.toLowerCase()
		);

		if (exact) {
			return exact;
		}

		const [base, ...rest] = locale.toLowerCase().split('-');

		if (base === 'zh') {
			return rest.some((part: string) =>
				['tw', 'hk', 'mo', 'hant'].includes(part)
			)
				? 'zh-TW'
				: 'zh-CN';
		}

		return locales.find((candidate: string) => candidate === base) ?? 'en';
	}
}
