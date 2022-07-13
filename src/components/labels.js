/**
 * Loop the labels and capture them
 */
function buildLabels(model) {
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

function filterModel_Label(model) {
	// need to match them all so set up an array of matches
	let result = true
	Object.values(this.label).forEach(v => {
		let labelFilter = this.filterValue('value', v)
		if (!labelFilter) return

		// set up a bool for if the label had been found
		let labelFound = false
		model._original.labels.forEach(label => {
			if (label.id == v.id) {
				// if this is the right label mark as found
				labelFound = true
				// now check for a match - update result if false
				let filterResult = false
				labelFilter.forEach(filter => {
					// if we find at least one match then set this filterResult to true
					if (label.value.includes(filter)) filterResult = true
				})

				if (!filterResult) result = false
			}
		})
		// if this group doesn't have this label then update result
		if (!labelFound) result = false
	})

	return result
}

export { buildLabels, filterModel_Label }