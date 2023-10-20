import './cs'

document.addEventListener('alpine:init', () => {
	Alpine.data('CSBookedResources', (options = {}) => new CSBookedResources(options))
})
