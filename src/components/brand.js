export default class Brand {
	/**
	 * Creates an Brand from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.emblem = json.emblem ? {
			px_16: json.emblem.px_16,
			px_32: json.emblem.px_32,
			px_64: json.emblem.px_64,
			px_128: json.emblem.px_128,
			px_152: json.emblem.px_152,
			px_200: json.emblem.px_200,
		} : null,
		this.logo = json.logo ? {
			height: json.logo.height,
			width: json.logo.width,
			url: json.logo.url,
		} : null,
		this.color = json.color
		this.css = json.css
	}
}