import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, AsyncStorage, resizeMode } from 'react-native';
import { Card, CardSection, Input, Spinner, Container, ContainerSection, Button } from './../components/common';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import RegistrationFormPage from './../pages/RegistrationFormPage';
import { BASE_URL } from './../shared/lb.config';
import { COLOR } from './../shared/lb.config';
import jwtDecode from 'jwt-decode';

class LoginFormPage extends Component {
    static navigationOptions = {
        header: null
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
        this.setState({ error: '', loading: true });

        const { email, password } = this.state;
        axios.post(`${BASE_URL}/login`, {
            'email': email,
            'password': password
        }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async response => {
                console.log('SUKSES', response.data.token);
                const deco = jwtDecode(response.data.token);
                console.log(deco, 'Result Decode Token');
                this.setState({
                    email: '',
                    password: '',
                    loading: false,
                    error: ''
                });
                AsyncStorage.setItem('loginCredential', response.data.token, () => {
                    console.log('Sukses');
                    OneSignal.sendTags({ 'userid': deco.user.id });
                    OneSignal.getTags((receivedTags) => {
                        console.log(receivedTags, 'Get Tag');
                    });
                    const { navigate } = this.props.navigation;
                    navigate(this.state.dataRedirect);
                });
            })
            .catch(error => {
                console.log(error.response)
                this.setState({ error: 'Username & Kata Sandi tidak cocok. Silahkan coba lagi.', loading: false });
                console.log('ERROR', error.message);
                this.renderError.bind(this)
            });
    }

    onChange = (name, value) => {
        this.setState({ [name]: value })
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button onPress={() => this.onButtonPress()}>
                Login
			</Button>
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

    renderError = () => {
        return (
            <Text style={styles.errorTextStyle}>
                {this.state.error}
            </Text>
        )
    }

    render() {
        const { navigate } = this.props.navigation
        const { email, password } = this.state
        console.log(this.state)

        return (
            <View style={styles.container}>
                <Container>
                    <ContainerSection>
                        <View style={{ flex: 1, marginBottom: 30 }}>
                            <Image
                                style={{ alignSelf: 'center' }}
                                source={require('./../assets/images/logo.png')}
                            />
                        </View>
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            onChangeText={val => this.onChange('email', val)}
                            placeholder="Username / Email"
                            value={email}
                            icon="ic_user"
                        />
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            secureTextEntry
                            onChangeText={val => this.onChange('password', val)}
                            placeholder="Password"
                            value={password}
                            icon="ic_password"
                        />
                    </ContainerSection>

                    {this.renderError()}

                    <View style={{ marginTop: 10 }}>
                        <ContainerSection>
                            {this.renderButton()}
                        </ContainerSection>
                    </View>
                </Container>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Belum punya akun?
					</Text>
                    <TouchableOpacity onPress={() => navigate('RegistrationForm')}>
                        <Text style={{ color: COLOR.secondary_a }}>
                            {` Daftar`}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                    <Text style={{ textAlign: 'center', marginTop: 10, color: COLOR.secondary_a }}>
                        Lupa Kata Sandi?
					</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    container: {
        marginTop: 100,
        justifyContent: 'center'
    },
    errorTextStyle: {
        textAlign: 'center',
        color: 'red'
    }
}



export default LoginFormPage;