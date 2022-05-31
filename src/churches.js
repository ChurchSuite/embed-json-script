import './cs'

document.addEventListener('alpine:init', () => {
	Alpine.data('CSChurches', (options = {}) => new CSChurches(options))
})
