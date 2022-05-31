import './cs'

document.addEventListener('alpine:init', () => {
	Alpine.data('CSEvents', (options = {}) => new CSEvents(options))
})
