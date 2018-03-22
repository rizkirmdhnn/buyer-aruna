import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import jwtDecode from 'jwt-decode';
import { NavigationActions } from 'react-navigation';
import { Input, Spinner, Container, ContainerSection, Button } from './../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class LoginFormPage extends Component {
    static navigationOptions = {
        header: null
    }
    state = {
        username: '',
        password: '',
        error: '',
        loading: false,
        dataRedirect: ''
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data Passing');
        this.setState({ dataRedirect: this.props.navigation.state.params.datas })
    }

    onLogin() {
        const { username, password } = this.state;
        switch (username) {
            case '':
                return ToastAndroid.show('Email/Username Tidak Boleh Kosong', ToastAndroid.SHORT);
            default:
                switch (password) {
                    case '':
                        return ToastAndroid.show('Password Tidak Boleh Kosong', ToastAndroid.SHORT);
                    default:
                        console.log('Password Tidak Kosong');
                        return this.onLoginFire();
                }
        }
    }

    onLoginFire() {
        this.setState({ error: '', loading: true });

        const { username, password } = this.state;
        axios.post(`${BASE_URL}/buyer/login`, {
            username,
            password
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
                    username: '',
                    password: '',
                    loading: false,
                    error: ''
                });
                AsyncStorage.setItem('loginCredential', response.data.token, () => {
                    console.log('Sukses');
                    OneSignal.sendTags({ userid: deco.user.id });
                    OneSignal.getTags((receivedTags) => {
                        console.log(receivedTags, 'Get Tag');
                    });
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: this.state.dataRedirect })
                        ]
                    })
                    this.props.navigation.dispatch(resetAction)
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
            <Button onPress={() => this.onLogin()}>
                Login
			</Button>
        );
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
        const { username, password } = this.state
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
                            onChangeText={val => this.onChange('username', val)}
                            placeholder="Username / Email"
                            value={username}
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
                    <TouchableOpacity
                        onPress={() => {
                            navigate('RegistrationForm')
                        }}
                    >
                        <Text style={{ color: COLOR.secondary_a }}>
                            {' '}{'Daftar'}
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
