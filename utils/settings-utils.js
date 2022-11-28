
export function resolve_back_color(props) {
    console.log(props.root)
    return props.root.theme == 'dark' ? '#151614' : 'white'
}
export function resolve_front_color(props) {
    console.log(props.root)
    return props.root.theme == 'dark' ? 'white' : '#151614'
}
