export const type_to_icon = {
    'injection': 'syringe',
    'ampule': 'thermometer',
    'pill': 'tablets',
    'suspension': 'vial'
}

export const type_choices = [
    'injection',
    'ampule',
    'pill',
    'suspension',
]

let index = 0;
export const type_dropdown_data = {
    'RUSSIAN': [
        { key: index++, label: 'Укол', customKey: 'injection' },
        { key: index++, label: 'Ампула', customKey: 'ampule' },
        { key: index++, label: 'Таблетка', customKey: 'pill' },
        { key: index++, label: 'Суспензия', customKey: 'suspension' }
    ], 'ENGLISH': [
        { key: index++, label: 'Injection', customKey: 'injection' },
        { key: index++, label: 'Ampule', customKey: 'ampule' },
        { key: index++, label: 'Pill', customKey: 'pill' },
        { key: index++, label: 'Suspension', customKey: 'suspension' }
    ]
}

index = 0;
export const dose_dropdown_data = {
    'RUSSIAN': [
        { key: index++, label: 'шт', customKey: 'pcs' },
        { key: index++, label: 'мл', customKey: 'ml' },
    ],
    'ENGLISH': [
        { key: index++, label: 'pcs', customKey: 'pcs' },
        { key: index++, label: 'ml', customKey: 'ml' },
    ]
}
