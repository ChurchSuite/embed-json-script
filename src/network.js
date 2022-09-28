import './cs'

document.addEventListener('alpine:init', () => {
	Alpine.data('CSOrganisations', (options = {}) => new CSOrganisations(options))
})
