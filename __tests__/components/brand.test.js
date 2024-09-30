import Brand from '../../src/components/brand'

const json = {
	"id": 18,
	"name": "Kings Hope Church",
	"default": true,
	"emblem": {
		"px_16": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_16.png",
		"px_32": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_32.png",
		"px_64": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_64.png",
		"px_128": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_128.png",
		"px_152": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_152.png",
		"px_200": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_200.png"
	},
	"logo": {
		"height": 200,
		"width": 753,
		"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/logo_IgBBdl.png"
	},
	"color": "#4697c9",
	"css": "https://cdn.churchsuite.com/_brand/300921/4697c9.css"
}

const brand = new Brand(json);

test('id property', () => expect(brand.id).toBe(18));
test('name property', () => expect(brand.name).toBe('Kings Hope Church'));
test('emblem property', () => expect(brand.emblem.px_200).toBe('https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_bWxJxu_200.png'));
test('logo property', () => expect(brand.logo.url).toBe('https://cdn.churchsuite.com/2mCEi8cf/brand/logo_IgBBdl.png'));
test('color property', () => expect(brand.color).toBe('#4697c9'));