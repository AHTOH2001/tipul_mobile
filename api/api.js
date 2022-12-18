import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const back_end_domain = 'https://anton123lll.pythonanywhere.com'
const back_end_domain = 'https://4c00-37-214-82-117.eu.ngrok.io'


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
    var token = await AsyncStorage.getItem('auth_token')
    // return {
    //     "data": [
    //         {
    //             "id": 1,
    //             "cure": {
    //                 "title": "джес",
    //                 "dose": 1.0,
    //                 "dose_type": "PCS",
    //                 "type": "pill"
    //             },
    //             "time": [
    //                 {
    //                     "time": "06:00:00"
    //                 },
    //                 {
    //                     "time": "08:00:00"
    //                 }
    //             ],
    //             "schedule": {
    //                 "cycle_start": "2022-12-10",
    //                 "cycle_end": "2022-12-24",
    //                 "frequency": 2,
    //                 "strict_status": true
    //             }
    //         }
    //     ]
    // }
    try {
        return (await axios.get(`${back_end_domain}/main/cure/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        console.log(errorObject);
        throw error
    }
}

export async function medicine_detail(medicine_id) {
    var token = await AsyncStorage.getItem('auth_token')
    // return {
    //     "id": 1,
    //     "cure": {
    //         "title": "джес детальный",
    //         "dose": 1.0,
    //         "dose_type": "PCS",
    //         "type": "pill"
    //     },
    //     "time": [
    //         {
    //             "time": "06:00:00"
    //         },
    //         {
    //             "time": "08:00:00"
    //         }
    //     ],
    //     "schedule": {
    //         "cycle_start": "2022-12-10",
    //         "cycle_end": "2022-12-24",
    //         "frequency": 2,
    //         "strict_status": true
    //     },
    // }
    try {
        return (await axios.get(`${back_end_domain}/main/cure/${medicine_id}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        console.log(errorObject);
        throw error
    }
}

export async function update_medicine(medicine) {
    var token = await AsyncStorage.getItem('auth_token')

    var cure = medicine
    var schedule = medicine.schedule
    var time = medicine.schedule.timesheet

    delete cure.schedule
    delete cure.patient
    delete schedule.timesheet

    var time_ids = []
    for (let i = 0; i < time.length; i++) {
        try {
            var res = (await axios.put(`${back_end_domain}/main/time/${time[i].id}/`, time[i], {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })).data
        } catch (error) {
            if (error.response.status == 404) {
                try {
                    var res = (await axios.post(`${back_end_domain}/main/time/`, time[i], {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    })).data
                } catch (error) {
                    console.log(error.response)
                    throw error
                }
            } else {
                console.log(error.response)
                throw error
            }
        }
        time_ids.push(res.id)
    }

    schedule['timesheet'] = time_ids
    try {
        var res = (await axios.put(`${back_end_domain}/main/schedule/${schedule.id}/`, schedule, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        console.log(error.response)
        throw error
    }


    cure['schedule'] = res.id
    try {
        var res = (await axios.put(`${back_end_domain}/main/cure/${cure.id}/`, cure, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        console.log(error.response)
        throw error
    }

}

export async function create_medicine({ cure, schedule, time }) {
    var token = await AsyncStorage.getItem('auth_token')
    var time_ids = []
    for (let i = 0; i < time.length; i++) {
        try {
            var res = (await axios.post(`${back_end_domain}/main/time/`, time[i], {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })).data
        } catch (error) {
            console.log(error.response)
            throw error
        }
        time_ids.push(res.id)
    }

    schedule['timesheet'] = time_ids
    try {
        var schedule_res = (await axios.post(`${back_end_domain}/main/schedule/`, schedule, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        console.log(error.response)
        throw error
    }

    cure['schedule'] = schedule_res.id

    try {
        return (await axios.post(`${back_end_domain}/main/cure/`, cure, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        console.log(error.response)
        throw error
    }
}

export async function delete_medicine(id) {
    var token = await AsyncStorage.getItem('auth_token')
    await axios.delete(`${back_end_domain}/main/cure/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function doctors_list() {
    var token = await AsyncStorage.getItem('auth_token')
    try {
        return (await axios.get(`${back_end_domain}/managment/doctor/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        console.log(errorObject);
        throw error
    }
}

export async function delete_doctor(id) {
    var token = await AsyncStorage.getItem('auth_token')
    await axios.delete(`${back_end_domain}/managment/doctor/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function create_doctor(doctor) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/doctor/`, doctor, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function doctor_detail(id) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/doctor/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function update_doctor(doctor) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.put(`${back_end_domain}/managment/doctor/${doctor.id}/`, doctor, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
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


export async function doctorvisits_list() {
    var token = await AsyncStorage.getItem('auth_token')
    try {
        return (await axios.get(`${back_end_domain}/managment/doctorvisit/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })).data
    } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        console.log(errorObject);
        throw error
    }
}

export async function delete_doctorvisit(id) {
    var token = await AsyncStorage.getItem('auth_token')
    await axios.delete(`${back_end_domain}/managment/doctorvisit/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function create_doctorvisit(doctor_id, date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/doctorvisit/`, {
        doctor: doctor_id,
        date: date
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function doctorvisit_detail(id) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/doctorvisit/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function update_doctorvisit(visit_id, doctor_id, date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.put(`${back_end_domain}/managment/doctorvisit/${visit_id}/`, {
        'doctor': doctor_id,
        'date': date,
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}
