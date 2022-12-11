
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function auth(phone) {
    await sleep(500)
    return {
        'token': '98sadjioasd89'
    }
}

export async function medicine_list() {
    await sleep(200)
    return {
        "data": [
            {
                "id": 1,
                "cure": {
                    "title": "джес",
                    "dose": 1.0,
                    "dose_type": "PCS",
                    "type": "pill"
                },
                "time": [
                    {
                        "time": "06:00:00"
                    },
                    {
                        "time": "08:00:00"
                    }
                ],
                "schedule": {
                    "cycle_start": "2022-12-10",
                    "cycle_end": "2022-12-24",
                    "frequency": 2,
                    "strict_status": true
                }
            }
        ]
    }
}

export async function medicine_detail(medicine_title) {
    await sleep(200)
    return {
        "id": 1,
        "cure": {
            "title": "джес детальный",
            "dose": 1.0,
            "dose_type": "PCS",
            "type": "pill"
        },
        "time": [
            {
                "time": "06:00:00"
            },
            {
                "time": "08:00:00"
            }
        ],
        "schedule": {
            "cycle_start": "2022-12-10",
            "cycle_end": "2022-12-24",
            "frequency": 2,
            "strict_status": true
        },
    }
}

export async function update_medicine(medicine) {
    await sleep(500)
    console.log('Update medicine')
}

export async function create_medicine(medicine) {
    await sleep(500)
    console.log('Create medicine')
}

export async function delete_medicine(id) {
    await sleep(500)
    console.log('Delete medicine ' + id.toString())
}

export async function doctors_list() {
    await sleep(200)
    return [
        {
            "id": 1,
            "first_name": "Victoria",
            "last_name": "Sviridchik",
            "specialty": "endocrinologist"
        },
        {
            "id": 2,
            "first_name": "Kukusha",
            "last_name": "Sviridchik",
            "specialty": "therapist"
        }
    ]
}

export async function delete_doctor(id) {
    await sleep(500)
    console.log('Delete doctor ' + id.toString())
}

export async function create_doctor(doctor) {
    await sleep(500)
    console.log('Create doctor')
}


export async function doctor_detail(id) {
    var doctors = await doctors_list()
    return doctors.find(doc => doc.id == id)
}

export async function update_doctor(doctor) {
    await sleep(500)
    console.log('Update doctor')
}
