import "./cs"

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => new CSGroups(options))
})