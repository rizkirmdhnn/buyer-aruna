import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, KeyboardAvoidingView, TextInput } from 'react-native'
import { CardRegistration, CardSectionRegistration, InputRegistration, Button } from './../components/common'
import AwesomeAlert from 'react-native-awesome-alerts';

/**
 *  Import Common
 */

// import { Header } from './../components/common';
class RegistrationFormPage extends Component {

    constructor(props) {
        super(props);
        this.state = { showAlert: false };
    };

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    static navigationOptions = {
        title: 'RegistrationForm',
        headerStyle: { backgroundColor: '#5D9FE2' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    render() {

        const { navigate } = this.props.navigation
        const { showAlert } = this.state;

        return (
            <View>
                {/* <Header headerText="Registrasi" /> */}
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                    keyboardVerticalOffset={80}
                >
                    <ScrollView
                        style={styles.containerStyle}
                        keyboardShouldPersistTaps="always"
                    >
                        <CardRegistration>
                            <CardSectionRegistration>
                                <Text style={styles.headerStyle}>
                                    INFORMASI LEMBAGA
							</Text>
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Jenis Lembaga'
                                    placeholder='Jenis Lembaga'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Nama Lembaga'
                                    placeholder='Nama Lembaga'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Alamat Lembaga'
                                    placeholder='Alamat Lembaga'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='NPWP Lembaga'
                                    placeholder='NPWP Lembaga'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Email'
                                    placeholder='Email'
                                />
                            </CardSectionRegistration>
                        </CardRegistration>

                        <CardRegistration>
                            <CardSectionRegistration>
                                <Text style={styles.headerStyle}>
                                    INFORMASI PERSONAL
							</Text>
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Nama Lengkap'
                                    placeholder='contoh: Ahmad Darudi'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='No. KTP'
                                    placeholder='contoh: 321317989029'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Alamat'
                                    placeholder='Alamat'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='No. HP'
                                    placeholder='contoh: 085621017922'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Username'
                                    placeholder='Username'
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Password'
                                    placeholder='minimal 6 karakter'
                                    secureTextEntry
                                />
                            </CardSectionRegistration>
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Konfirmasi Password'
                                    placeholder='minimal 6 karakter'
                                    secureTextEntry
                                />
                            </CardSectionRegistration>

                        </CardRegistration>
                        <CardSectionRegistration>
                            <Button onPress={() => this.showAlert()}>
                                Register
						</Button>
                        </CardSectionRegistration>
                    </ScrollView>
                </KeyboardAvoidingView>


                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Confirm"
                    message="Yakin data anda sudah benar ?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No, Cancel!"
                    confirmText="Yes, Sure!"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />

            </View>
        )
    }
}

const styles = {
    containerStyle: {

    },
    headerStyle: {
        marginLeft: 5
    },
    pickerTextStyle: {
        color: '#8e8e8e',
        flex: 1,
        paddingLeft: 5
    }
}

export default RegistrationFormPage;
