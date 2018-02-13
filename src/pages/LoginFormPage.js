import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Card, CardSection, Input, Spinner } from './../components/common';
import axios from 'axios';
import { Button } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';
import RegistrationFormPage from './../pages/RegistrationFormPage';
import { BASE_URL } from './../shared/lb.config';
import jwtDecode from 'jwt-decode';

class LoginFormPage extends Component {
    static navigationOptions = {
        headerLeft: null
    }
    state = {
        email: '',
        password: '',
        error: '',
        loading: false,

        dataRedirect: ''
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data Passing');
        this.setState({ dataRedirect: this.props.navigation.state.params.datas })
    }

    onButtonPress() {
        console.log('Start');
        const { email, password } = this.state;
        this.setState({ error: '', loading: true });
        const { navigate } = this.props.navigation;
        axios.post(`${BASE_URL}/login`, {
            'email': email,
            'password': password
        }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                console.log('SUKSES', response);
                const deco = jwtDecode(response.data.token);
                console.log(deco, 'Result Decode Token');
                AsyncStorage.setItem('loginCredential', response.data.token).then(() => {
                    this.setState({
                        email: '',
                        password: '',
                        loading: false,
                        error: ''
                    });
                    OneSignal.sendTags({ 'userid': deco.user.id });
                });
                OneSignal.getTags((receivedTags) => {
                    console.log(receivedTags, 'Get Tag');
                });
                navigate(this.state.dataRedirect);
            })
            .catch(error => {
                console.log(error.response)
                // this.onLoginFail.bind(this)
                this.setState({ error: 'Authentication Failed', loading: false });
                console.log('ERROR', error.message);
            });

    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button
                title="Login"
                buttonStyle={styles.buttonStyle}
                onPress={this.onButtonPress.bind(this)}
            />
        );
    }

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: ''
        });
        navigate('HomePage');
    }
    static navigationOptions = {
        // title: 'RegistrationForm',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }


    render() {
        const { navigate } = this.props.navigation

        return (
            <ScrollView>
                <Card>
                    <CardSection>
                        <Image
                            style={styles.imageStyle}
                            source={require('./../assets/image/logo.png')}
                        />
                    </CardSection>

                    <CardSection>
                        <Input
                            placeholder="Username/email"
                            label="Email"
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                        />
                    </CardSection>

                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        />
                    </CardSection>

                    <Text style={styles.errorText}>
                        {this.state.error}
                    </Text>

                    <CardSection>
                        {this.renderButton()}
                    </CardSection>

                    <CardSection>
                        <Text style={styles.textBottom}>
                            Belom memiliki akun?
                        </Text>

                        <TouchableOpacity onPress={() => navigate('RegistrationForm')}>
                            <Text style={styles.textLinkSignUp}>Sign Up</Text>
                        </TouchableOpacity>

                    </CardSection>

                    <CardSection>
                        <Text style={styles.textLinkForgetPassword}>Lupa Password?</Text>
                    </CardSection>
                </Card>
            </ScrollView>
        );
    }
};


const styles = {
    buttonStyle: {
        backgroundColor: '#006AAF',
        width: 318,
        height: 50,
        margin: 5,
        borderRadius: 5
    },
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    imageStyle: {
        flex: 1,
        marginTop: 80,
        marginBottom: 80,
        height: 70,
        width: 500,
        alignSelf: 'center'
    },
    textBottom: {
        margin: 5,
        marginLeft: 70,
        color: 'black'
    },
    textLinkSignUp: {
        margin: 5,
        color: '#30B2EC'
    },
    textLinkForgetPassword: {
        marginLeft: 120,
        margin: 5,
        color: '#30B2EC'
    }
};


export default LoginFormPage;