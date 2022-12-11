export const specialty_choices = [
    'endocrinologist',
    'neurologist',
    'therapist',
    'cardiologist',
    'ophthalmologist',
    'nutritionist',
    'surgeon',
]

export const specialty_to_icon = {
    'endocrinologist': 'microscope',
    'neurologist': 'brain',
    'therapist': 'stethoscope',
    'cardiologist': 'heartbeat',
    'ophthalmologist': 'glasses',
    'nutritionist': 'carrot',
    'surgeon': 'head-side-mask',
}

let index = 0;
export const type_dropdown_data = specialty_choices.map(specialty => (
    { key: index++, label: specialty }
))
