import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { back_end_domain } from './consts';

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
        return (await axios.get(`${back_end_domain}/main/cure/?as_patient`, {
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
        return (await axios.get(`${back_end_domain}/main/cure/${medicine_id}/?as_patient`, {
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
    console.log(medicine)
    try {
        return (await axios.put(`${back_end_domain}/main/cure/${medicine.id}/?as_patient`, medicine, {
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
    schedule['timesheet'] = time
    cure['schedule'] = schedule
    var token = await AsyncStorage.getItem('auth_token')
    try {
        return (await axios.post(`${back_end_domain}/main/cure/?as_patient`, cure, {
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
    await axios.delete(`${back_end_domain}/main/cure/${id}/?as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function doctors_list() {
    var token = await AsyncStorage.getItem('auth_token')
    try {
        return (await axios.get(`${back_end_domain}/managment/doctor/?as_patient`, {
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
    await axios.delete(`${back_end_domain}/managment/doctor/${id}/?as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function create_doctor(doctor) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/doctor/?as_patient`, doctor, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function doctor_detail(id) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/doctor/${id}/?as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function update_doctor(doctor) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.put(`${back_end_domain}/managment/doctor/${doctor.id}/?as_patient`, doctor, {
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

export async function doctorvisits_list() {
    var token = await AsyncStorage.getItem('auth_token')
    try {
        return (await axios.get(`${back_end_domain}/managment/doctorvisit/?as_patient`, {
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
    await axios.delete(`${back_end_domain}/managment/doctorvisit/${id}/?as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
}

export async function create_doctorvisit(doctor_id, date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.post(`${back_end_domain}/managment/doctorvisit/?as_patient`, {
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
    return (await axios.get(`${back_end_domain}/managment/doctorvisit/${id}/?as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function update_doctorvisit(visit_id, doctor_id, date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.put(`${back_end_domain}/managment/doctorvisit/${visit_id}/?as_patient`, {
        'doctor': doctor_id,
        'date': date,
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function take_medicine(id) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/medicine/take/cure/${id}/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}


export async function list_taken_med(date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/statistic/analytic/?date_data=${date}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function list_guard_taken_med(date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/statistic/report/?date_data=${date}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}


export async function get_settings() {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/settings/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function set_settings(settings) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.patch(`${back_end_domain}/managment/settings/99/`, settings, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function upload_photo(photo_url) {
    var token = await AsyncStorage.getItem('auth_token')
    var formData = new FormData()
    let filename = photo_url.split('/').pop();
    formData.append("file", { uri: photo_url, name: filename, type: 'image/jpg' })
    return (await axios.post(`${back_end_domain}/medicine/photos/`, formData, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    })).data
}

export async function get_my_code() {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/code/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}


export async function list_meds_by_date(date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/medicine/cure_date/?date=${date}&as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}

export async function list_visits_by_date(date) {
    var token = await AsyncStorage.getItem('auth_token')
    return (await axios.get(`${back_end_domain}/managment/doctorvisit_date/?date=${date}&as_patient`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })).data
}
