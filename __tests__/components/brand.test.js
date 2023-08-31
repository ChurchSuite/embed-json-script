import Brand from '../../src/components/brand'

const json = {
	"id": 18,
	"name": "Kings Hope Church",
	"default": true,
	"hashes": "{\"emblem\":{\"hash\":\"7KJawf\",\"extension\":\"png\",\"source\":\"admin\"},\"logo\":{\"hash\":\"D2wu3K\",\"extension\":\"png\",\"source\":\"admin\"}}",
	"emblem": {
		"16": {
			"px": 16,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_16.png"
		},
		"32": {
			"px": 32,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_32.png"
		},
		"64": {
			"px": 64,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_64.png"
		},
		"128": {
			"px": 128,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_128.png"
		},
		"152": {
			"px": 152,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_152.png"
		},
		"200": {
			"px": 200,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_200.png"
		},
		"512": {
			"px": 512,
			"square": true,
			"transparent": false,
			"mtime": "1619432247",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_512.png"
		}
	},
	"logo": {
		"full": {
			"px": "1000",
			"square": false,
			"transparent": false,
			"mtime": "1654767916",
			"url": "https://cdn.churchsuite.com/2mCEi8cf/brand/logo_D2wu3K.png"
		}
	},
	"color": "#4697c9",
}

const brand = new Brand(json);

test('id property', () => expect(brand.id).toBe(18));
test('name property', () => expect(brand.name).toBe('Kings Hope Church'));
test('emblem property', () => expect(brand.emblem['512'].url).toBe('https://cdn.churchsuite.com/2mCEi8cf/brand/emblem_7KJawf_512.png'));
test('logo property', () => expect(brand.logo.url).toBe('https://cdn.churchsuite.com/2mCEi8cf/brand/logo_D2wu3K.png'));
test('color property', () => expect(brand.color).toBe('#4697c9'));