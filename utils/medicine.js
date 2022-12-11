import { create_medicine } from '../api/api';

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

// TODO and create medicine on back end
export var create_empty_medicine = (type, medicines_amount) => {
    var new_medicine = {
        "id": medicines_amount + Math.floor(Math.random() * 9999),
        "cure": {
            "title": `New medicine ${medicines_amount + 1}`,
            "dose": 1.0,
            "dose_type": "шт",
            "type": type
        },
        "time": [
            {
                "time": `${new Date().getHours()}:${new Date().getMinutes()}:00`
            }
        ]
    }
    create_medicine(new_medicine).catch(reason => console.error(reason))
    return new_medicine
}
