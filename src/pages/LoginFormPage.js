import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
// import firebase from 'firebase';
import { Button, Card, CardSection, Input, Spinner } from './../components/common';


class LoginFormPage extends Component {

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

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: ''
        });
    }
    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                Log In
            </Button>
        );
    }

    render() {
        return (
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
                    <Text style={styles.textLinkSignUp}>
                        Sign Up 
                    </Text>
                </CardSection>

                <CardSection>
                    <Text style={styles.textLinkForgetPassword}>Lupa Password?</Text>
                </CardSection>
            </Card>
        );
    }
};


const styles = {
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    imageStyle: {
        paddingLeft: 200,
        height: 50,
        width: 50
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