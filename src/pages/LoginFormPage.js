import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { Card, CardSection, Input, Spinner } from './../components/common';
// import firebase from 'firebase';
import { Button } from 'react-native-elements'
import RegistrationFormPage from './../pages/RegistrationFormPage';

class LoginFormPage extends Component {

    // static navigationOptions = {
    // 	title: 'Login'
    // }


    state = {
        email: '',
        password: '',
        error: '',
        loading: false
    };

    onButtonPress() {
        console.log('Login Bottom Pressed');
        const { email, password } = this.state;
        this.setState({ error: '', loading: true });

        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then(this.onLoginSuccess.bind(this))
        //     .catch(() => {
        //         firebase.auth().createUserWithEmailAndPassword(email, password)
        //             .then(this.onLoginSuccess.bind(this))
        //             .catch(this.onLoginFail.bind(this));
        //     });
    }

    onLoginFail() {
        this.setState({ error: 'Authentication Failed', loading: false });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button
                title="Login"
                buttonStyle={styles.buttonStyle}
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
        backgroundColor: '#18A0DF',
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
        marginLeft: 70,
        height: 200,
        width: 200,
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