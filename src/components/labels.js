/**
 * Loop the labels and capture them
 */
function buildLabels() {
	if (!this.options.hasOwnProperty('show_labels')) return

	let labelIds = Object.keys(this.label)
	let labelsIds = this.labels.map(l => '' + l.id)

	this.options.show_labels.forEach(labelId => {
		// try and find this label on the model
		model.labels.forEach(label => {
			if (label.id == labelId) {
				// don't add a label object unless we need it by id
				if (!labelsIds.includes('' + label.id)) {
					this.labels.push({
						id: label.id,
						multiple: label.multiple,
						name: label.name,
						options: label.options,
						required: label.required,
					})
				}
				// don't add a label filter value unless we need it by id
				if (!labelIds.includes('' + label.id)) {
					this.label[labelId] = {
						id: labelId,
						value: null,
					}
					this.$watch('label[' + labelId + '].value', v => {
						this.filterModels()
					})
				}
			}
		})
	})
}

export { buildLabels }