import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, AsyncStorage, resizeMode } from 'react-native';
import { Card, CardSection, Input, Spinner, Container, ContainerSection, Button } from './../components/common';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import RegistrationFormPage from './../pages/RegistrationFormPage';
import { BASE_URL } from './../shared/lb.config';
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
                    OneSignal.getTags((receivedTags) => {
                        console.log(receivedTags, 'Get Tag');
                    });
                });
                navigate(this.state.dataRedirect);
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
            <Button onPress={this.onButtonPress.bind(this)}>
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
            <ScrollView>
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

                        {this.renderError()}

                        <ContainerSection>
                            <Input
                                label='Email'
                                onChangeText={val => this.onChange('email', val)}
                                value={email}
                            />
                        </ContainerSection>
                        <ContainerSection>
                            <Input
                                label='Password'
                                secureTextEntry
                                onChangeText={val => this.onChange('password', val)}
                                value={password}
                            />
                        </ContainerSection>

                        <ContainerSection>
                            {this.renderButton()}
                        </ContainerSection>
                    </Container>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        <Text style={{ textAlign: 'center' }}>
                            Belum punya akun?
					</Text>
                        <TouchableOpacity onPress={() => navigate('Register')}>
                            <Text style={{ color: 'green', fontWeight: 'bold' }}>
                                {` Registrasi`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                        <Text style={{ textAlign: 'center', marginTop: 10, color: 'green', fontWeight: 'bold' }}>
                            Lupa Password?
					</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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