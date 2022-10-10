import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Input, Icon, ListItem, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';


class PhaseDetail extends Component {
    constructor({ item, updatePhase }) {
        super();
        this.updatePhase = updatePhase
        this.state = {
            item,
        };
    }


    shouldComponentUpdate(nextProps, nextState) {
        return nextState.item.duration !== this.props.item.duration
    }

    resolve_back_color = () => {
        return this.props.root.theme == 'dark' ? '#151614' : 'white'
    }
    resolve_front_color = () => {
        return this.props.root.theme == 'dark' ? 'white' : '#151614'
    }
    resolve_font_size = (original_size) => {
        return Math.round(this.props.root.font_size / 20 * original_size)
    }

    render() {
        return (
            <ListItem
                key={this.state.item.id}
                bottomDivider
                containerStyle={{ flex: 1, backgroundColor: this.resolve_back_color() }}
                onLongPress={() => Alert.alert(`Delete ${this.state.item.type}?`, null, [
                    {
                        text: 'NO',
                        style: 'cancel'
                    },
                    {
                        text: 'YES',
                        onPress: () => {
                            this.updatePhase(this.state.item.id, null)
                        },
                        style: 'destructive'
                    },
                ])}
            >
                <Icon name={this.state.item.iconName} type='material-community' color='blue' />
                <ListItem.Content style={{
                    flex: 3
                }}>
                    <ListItem.Title style={{ fontSize: this.resolve_font_size(20), color: this.resolve_front_color() }}>{translate(this.state.item.type, this.props.root.language)}</ListItem.Title>
                </ListItem.Content>
                <Input
                    value={String(this.state.item.duration)}
                    onChangeText={(val) => {
                        if (Number(val) <= 999 && Number(val) >= 1) {
                            !Number.isNaN(Number(val)) && val.length <= 4 && this.updatePhase(this.state.item.id, { ...this.state.item, duration: Number(val) })
                            !Number.isNaN(Number(val)) && val.length <= 4 && this.setState({ item: { ...this.state.item, duration: Number(val) } })
                        }
                    }}
                    label={translate('Duration', this.props.root.language)}
                    keyboardType="numeric"
                    containerStyle={{
                        flex: 5,
                        padding: 0,
                        margin: 0,
                    }}
                    color={this.resolve_front_color()}
                    leftIcon={
                        <Button
                            type='clear'
                            onPress={() => {
                                if (this.state.item.duration > 1) {
                                    this.updatePhase(this.state.item.id, { ...this.state.item, duration: this.state.item.duration - 1 })
                                    this.setState({ item: { ...this.state.item, duration: this.state.item.duration - 1 } })
                                }
                            }}
                            icon={{
                                name: "minuscircle",
                                type: 'antdesign',
                                color: 'blue',
                            }}
                            style={{ padding: 0 }}
                        />}
                    rightIcon={
                        <Button
                            type='clear'
                            onPress={() => {
                                if (this.state.item.duration < 999) {
                                    this.updatePhase(this.state.item.id, { ...this.state.item, duration: this.state.item.duration + 1 })
                                    this.setState({ item: { ...this.state.item, duration: this.state.item.duration + 1 } })
                                }
                            }}
                            icon={{
                                name: "pluscircle",
                                type: 'antdesign',
                                color: 'blue',
                            }}
                            style={{ padding: 0 }}
                        />}
                />
            </ListItem>)
    }
}

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(PhaseDetail)
