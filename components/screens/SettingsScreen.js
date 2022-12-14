import React, { Component } from 'react';
import { Icon, ListItem, Button } from 'react-native-elements'
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import firestore, { db } from '../../firebase/firebaseDb';
import { connect } from 'react-redux';
import { change_font_size, change_language, change_theme } from '../../redux/action/root';
import translate from '../../utils/translate';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            this.props.navigation.goBack();
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
                    containerStyle={styles.containerStyle}
                    content={
                        <>
                            <Icon name="language" size={30} color={this.resolve_front_color()} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), paddingLeft: 20, color: this.resolve_front_color(), fontSize: 30 }}>{translate('Select language', this.state.chosen_language)}</ListItem.Title>
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
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color(), fontSize: 30, paddingLeft: 20 }}>{lang}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ListItem.Accordion>
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    onPress={() => {
                        AsyncStorage.removeItem('auth_token').then(() => {
                            console.log('Item removed, getting back to auth')
                            this.props.navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'AuthScreen',
                                    },
                                ],
                            })
                        })
                    }}
                    title={translate('Log out', this.props.root.language)}
                />
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
    },
    containerStyle: {
    },
    button: {
        padding: 20,
        margin: 20,
        borderRadius: 10
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(SettingsScreen)
