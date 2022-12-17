import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const back_end_domain = 'https://anton123lll.pythonanywhere.com'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function auth(username, password) {
    return (await axios.post(`${back_end_domain}/api/v1/auth-token/token/login/`, {
        'username': username,
        'password': password
    })).data
}

export async function register(email, username, password) {
    return (await axios.post(`${back_end_domain}/api/v1/auth/users/`, {
        'email': email,
        'username': username,
        'password': password
    })).data
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

export async function medicine_detail(medicine_id) {
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

export async function update_medicine({ cure, schedule, time }) {
    await sleep(500)
    console.log('Update medicine')
}

export async function create_medicine({ cure, schedule, time }) {
    var token = await AsyncStorage.getItem('auth_token')
    var time_ids = []
    for (let i = 0; i < time.length; i++) {
        res = await axios.post(`${back_end_domain}/main/time/`, time[i], {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        time_ids.push(res.id)
    }


    var schedule_res = await axios.post(`${back_end_domain}/main/schedule/`, schedule, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })

    cure['id'] = schedule_res.id

    return (await axios.post(`${back_end_domain}/main/cure/`, cure, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function delete_medicine(id) {
    await sleep(500)
    console.log('Delete medicine ' + id.toString())
}

export async function doctors_list() {
    try {
        return (await axios.get(`${back_end_domain}/managment/doctor/`)).data
    } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        console.log(errorObject);
        throw error
    }
}

export async function delete_doctor(id) {
    await axios.delete(`${back_end_domain}/managment/doctor/${id}/`)
}

export async function create_doctor(doctor) {
    return (await axios.post(`${back_end_domain}/managment/doctor/`, doctor)).data
}

export async function doctor_detail(id) {
    return (await axios.get(`${back_end_domain}/managment/doctor/${id}/`)).data
}

export async function update_doctor(doctor) {
    console.log(doctor)
    return (await axios.put(`${back_end_domain}/managment/doctor/${doctor.id}/`, doctor)).data
}

export async function get_user_type() {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/whoiam/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function create_patient(first_name, last_name, age, phone) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/patients/`, {
        "first_name": first_name,
        "last_name": last_name,
        "age": age,
        "phone": phone,
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function create_guardian(first_name, last_name, relationship, phone) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/guardians/`, {
        "relationship": relationship,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}
