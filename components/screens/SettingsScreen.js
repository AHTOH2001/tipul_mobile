import React, { Component } from 'react';
import { Icon, ListItem, Button } from 'react-native-elements'
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import firestore, { db } from '../../firebase/firebaseDb';
import { connect } from 'react-redux';
import { change_font_size, change_language, change_theme } from '../../redux/action/root';
import translate from '../../utils/translate';

class SettingsScreen extends Component {
    constructor() {
        super();
        this.firestoreRef = firestore.collection(db, 'settings');
        this.state = {
            languages: ['english', 'русский'],
            themes: ['light', 'dark'],
            language_expanded: false,
            isLoading: true,
            chosen_language: 'english',
            font_size: 0,
            theme: '',
            key: '',
            theme_expanded: false
        };
    }

    getCollection = (querySnapshot) => {
        // const {language} = querySnapshot[0].data()
        querySnapshot.forEach((res) => {
            const { language, font_size, theme } = res.data();
            this.setState({
                key: res.id,
                res,
                chosen_language: language || 'english',
                theme: theme || 'light',
                font_size: font_size || 20,
            });
        });
        this.setState({
            isLoading: false,
        });
    }

    componentDidMount() {
        this.unsubscribe = firestore.onSnapshot(this.firestoreRef, this.getCollection)
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => this.updateSettings()}
                    color="#fff"
                    type='clear'
                    icon={{
                        name: "check",
                        color: 'white',
                    }}
                />
            ),
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    updateSettings() {
        this.setState({
            isLoading: true,
        });
        this.props.dispatch(change_theme(this.state.theme))
        this.props.dispatch(change_language(this.state.chosen_language))
        this.props.dispatch(change_font_size(this.state.font_size))
        const updateDBRef = firestore.doc(firestore.collection(db, 'settings'), this.state.key)
        firestore.setDoc(updateDBRef, {
            language: this.state.chosen_language,
            font_size: this.state.font_size,
            theme: this.state.theme
        }).then((docRef) => {
            this.setState({
                key: '',
                language: 0,
                font_size: 0,
                theme: '',
                isLoading: true,
            });
            this.props.navigation.navigate('MainScreen');
        })
            .catch((error) => {
                console.error("Error: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    resolve_back_color = () => {
        return this.state.theme == 'dark' ? '#151614' : 'white'
    }
    resolve_front_color = () => {
        return this.state.theme == 'dark' ? 'white' : '#151614'
    }
    resolve_font_size = (original_size) => {
        return Math.round(this.state.font_size / 20 * original_size)
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: this.resolve_back_color() }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <ScrollView style={{ backgroundColor: this.resolve_back_color() }}>
                <ListItem.Accordion         // language
                    containerStyle={{ backgroundColor: this.resolve_back_color() }}
                    content={
                        <>
                            <Icon name="language" size={30} color={this.resolve_front_color()} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), paddingLeft: 20, color: this.resolve_front_color() }}>{translate('Select language', this.state.chosen_language)}</ListItem.Title>
                            </ListItem.Content>
                        </>
                    }
                    isExpanded={this.state.language_expanded}
                    onPress={() => {
                        this.setState({ 'language_expanded': !this.state.language_expanded })
                    }}
                >
                    {this.state.languages.map((lang, i) => (
                        <ListItem key={i} onPress={() => {
                            console.log(lang + ' lang chosen ')
                            this.setState({ language_expanded: false, chosen_language: lang })
                        }}
                            containerStyle={{ backgroundColor: lang == this.state.chosen_language ? 'lightgrey' : this.resolve_back_color() }}
                            bottomDivider>

                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color() }}>{lang}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ListItem.Accordion>
                <ListItem.Accordion         // Theme
                    containerStyle={{ backgroundColor: this.resolve_back_color() }}
                    content={
                        <>
                            <Icon name="palette" size={30} color={this.resolve_front_color()} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), paddingLeft: 20, color: this.resolve_front_color() }}>{translate('Select theme', this.state.chosen_language)}</ListItem.Title>
                            </ListItem.Content>
                        </>
                    }
                    isExpanded={this.state.theme_expanded}
                    onPress={() => {
                        this.setState({ 'theme_expanded': !this.state.theme_expanded })
                    }}
                >
                    {this.state.themes.map((theme, i) => (
                        <ListItem key={i} onPress={() => {
                            console.log(theme + ' theme chosen')
                            this.setState({ theme_expanded: false, theme: theme })
                        }}
                            containerStyle={{ backgroundColor: theme == this.state.theme ? 'lightgrey' : this.resolve_back_color() }}
                            bottomDivider>

                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color() }}>{translate(theme, this.state.chosen_language)}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ListItem.Accordion>
                <ListItem       // font size                    
                    bottomDivider
                    containerStyle={{ flex: 1, backgroundColor: this.resolve_back_color() }}
                >
                    <Icon name='format-size' type='material-community' size={30} color={this.resolve_front_color()} />
                    <Button
                        type='clear'
                        onPress={() => {
                            if (this.state.font_size > 8) {
                                this.setState({ font_size: this.state.font_size - 1 })
                            }
                        }}
                        icon={{
                            name: "minuscircle",
                            type: 'antdesign',
                            color: 'blue',
                        }}
                        style={{ padding: 0 }}
                    />
                    <ListItem.Content style={{
                        flex: 3,
                        alignItems: 'center'
                    }}>
                        <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color() }}>{translate('Font size', this.state.chosen_language)} ({this.state.font_size})</ListItem.Title>
                    </ListItem.Content>
                    <Button
                        type='clear'
                        onPress={() => {
                            if (this.state.font_size < 30) {
                                this.setState({ font_size: this.state.font_size + 1 })
                            }
                        }}
                        icon={{
                            name: "pluscircle",
                            type: 'antdesign',
                            color: 'blue',
                        }}
                        style={{ padding: 0 }}
                    />
                </ListItem>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(SettingsScreen)
