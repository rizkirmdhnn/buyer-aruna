import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, KeyboardAvoidingView, TextInput } from 'react-native'
import { CardRegistration, CardSectionRegistration, InputRegistration, Button } from './../components/common'


/**
 *  Import Common
 */

// import { Header } from './../components/common';
class RegistrationFormPage extends Component {
    static navigationOptions = {
        title: 'RegistrationForm',
        header: () => {
            return {
                right: <Text>Go Back</Text>
            };
        }
        // header: null,
        // headerBackTitle: true,
        // tabBarVisible: false,
    }

    render() {
        const { navigate } = this.props.navigation

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
                            <Button onPress={() => alert('Yakin data anda sudah benar ?')}>
                                Register
						</Button>
                        </CardSectionRegistration>
                    </ScrollView>
                </KeyboardAvoidingView>
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
