export const type_to_icon = {
    'injection': 'syringe',
    'ampule': 'thermometer',
    'pill': 'tablets',
    'suspension': 'vial',
    'bag': 'cube',
    'aerosols': 'spray-can',
    'capsules': 'capsules',
}

export const type_choices = [
    'injection',
    'ampule',
    'pill',
    'suspension',
    'bag',
    'aerosols',
    'capsules',
]

let index = 0;
export const type_dropdown_data = {
    'RUSSIAN': [
        { key: index++, label: 'Укол', customKey: 'injection' },
        { key: index++, label: 'Ампула', customKey: 'ampule' },
        { key: index++, label: 'Таблетка', customKey: 'pill' },
        { key: index++, label: 'Суспензия', customKey: 'suspension' },
        { key: index++, label: 'Пакетик', customKey: 'bag' },
        { key: index++, label: 'Аэрозоль', customKey: 'aerosols' },
        { key: index++, label: 'Капсула', customKey: 'capsules' },
    ], 'ENGLISH': [
        { key: index++, label: 'Injection', customKey: 'injection' },
        { key: index++, label: 'Ampule', customKey: 'ampule' },
        { key: index++, label: 'Pill', customKey: 'pill' },
        { key: index++, label: 'Suspension', customKey: 'suspension' },
        { key: index++, label: 'Bag', customKey: 'bag' },
        { key: index++, label: 'Aerosols', customKey: 'aerosols' },
        { key: index++, label: 'Capsules', customKey: 'capsules' },
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
