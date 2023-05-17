import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { set_settings } from '../../api/api';
import { change_font_size, change_language, change_theme } from '../../redux/action/root';
import translate from '../../utils/translate';

class SettingsScreen extends Component {
    constructor() {
        super();
        this.state = {
            languages: [{ key: 'ENGLISH', label: 'english' }, { key: 'RUSSIAN', label: 'русский' }],
            themes: ['light', 'dark'],
            language_expanded: false,
            isLoading: true,
            chosen_language: null,
            font_size: 0,
            theme: '',
            key: '',
            theme_expanded: false
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            chosen_language: this.props.root.language,
            isLoading: false,
            font_size: this.props.root.font_size,
            theme: this.props.root.theme
        })
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

    updateSettings() {
        this.setState({
            isLoading: true,
        });
        this.props.dispatch(change_theme(this.state.theme))
        this.props.dispatch(change_language(this.state.chosen_language))
        this.props.dispatch(change_font_size(this.state.font_size))

        set_settings({
            'language': this.state.chosen_language,
            'font': this.state.font_size,
            'color': this.state.theme
        }).then(settings_resp => {
            this.props.navigation.goBack()
        })
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
        console.log(this.state)
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
                            console.log(lang.key + ' lang chosen ')
                            this.setState({ language_expanded: false, chosen_language: lang.key })

                        }}
                            containerStyle={{ backgroundColor: lang.key == this.state.chosen_language ? 'lightgrey' : this.resolve_back_color() }}
                            bottomDivider>

                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color(), fontSize: 30, paddingLeft: 20 }}>{lang.label}</ListItem.Title>
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
                    title={translate('Log out', this.state.chosen_language)}
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
