// TODO change to english names
export var type_to_icon = {
    'УКОЛ': '',
    'АМПУЛА': '',
    'ТАБЛЕТКА': '',
    'СУСПЕНЗИЯ': ''
}

export var type_choices = [
    'УКОЛ',
    'АМПУЛА',
    'ТАБЛЕТКА',
    'СУСПЕНЗИЯ',
]

export var create_medicine = (type, medicines_amount) => (
    {
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
)