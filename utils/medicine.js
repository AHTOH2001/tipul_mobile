import { create_medicine } from '../api/api';

// TODO change to english names
export var type_to_icon = {
    'УКОЛ': 'syringe',
    'АМПУЛА': 'thermometer',
    'ТАБЛЕТКА': 'tablets',
    'СУСПЕНЗИЯ': 'vial'
}

export var type_choices = [
    'УКОЛ',
    'АМПУЛА',
    'ТАБЛЕТКА',
    'СУСПЕНЗИЯ',
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
