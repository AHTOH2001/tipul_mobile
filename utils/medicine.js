export const type_to_icon = {
    'injection': 'syringe',
    'ampule': 'thermometer',
    'pill': 'tablets',
    'SUSPENSION': 'vial'
}

export const type_choices = [
    'injection',
    'ampule',
    'pill',
    'SUSPENSION',
]

let index = 0;
export const type_dropdown_data = [
    { key: index++, label: 'injection' },
    { key: index++, label: 'ampule' },
    { key: index++, label: 'pill' },
    { key: index++, label: 'SUSPENSION' }
]

index = 0;
export const dose_dropdown_data = [
    { key: index++, label: 'PCS' },
    { key: index++, label: 'ml' },
]
