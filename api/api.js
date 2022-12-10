
export async function auth(phone) {
    return {
        'token': '98sadjioasd89'
    }
}

export async function medicine() {
    return {
        "data": [
            {
                "cure": {
                    "title": "джес",
                    "dose": 1.0,
                    "dose_type": "шт",
                    "type": "ТАБЛЕТКА"
                },
                "time": [
                    {
                        "time": "06:00:00"
                    },
                    {
                        "time": "08:00:00"
                    }
                ]
            }
        ]
    }
}