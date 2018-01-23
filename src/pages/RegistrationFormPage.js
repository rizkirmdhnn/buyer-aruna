import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, Keyboard, TextInput } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

/**
 *  Import Common
 */
import { CardRegistration, CardSectionRegistration, InputRegistration, Button } from './../components/common'
import { BASE_URL } from './../shared/lb.config';

class RegistrationFormPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,

            organizationType: '',
            nameInstitution: '',
            addressInstitution: '',
            npwp: '',
            email: '',

            name: '',
            idNumber: '',
            photo: '',
            address: '',
            phone: '',
            username: '',
            password: ''

        };
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
        title: 'Registration',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v })
    }

    register = () => {
        Keyboard.dismiss()
        this.setState({ loading: true })

        const data = this.state
        console.log(data, 'DATA REGISTER');
        axios.post(`${BASE_URL}/supplier/register`, data)
            .then(response => {
                console.log(response, 'Response');
                console.log(response.status)
                if (response.status === 200) {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Login' })
                        ]
                    })
                    this.props.navigation.dispatch(resetAction)
                    Alert.alert('Registrasi berhasil', `Silahkan cek email anda ${data.email} untuk verifikasi email`, [])
                }
                else {
                    alert(response.data.message)
                }

                this.setState({ loading: false })
            });
        // .catch(error => {
        //     if (error.response) {
        //         alert(error.response.data.message)
        //     }
        //     else {
        //         alert('Koneksi internet bermasalah')
        //     }

        //     this.setState({ loading: false })
        // })
    }


    render() {

        const { navigate } = this.props.navigation
        const { showAlert } = this.state;

        const {
			organizationType,
            nameInstitution,
            addressInstitution,
            npwp,
            email,

            name,
            idNumber,
            photo,
            address,
            phone,
            username,
            password
		} = this.state



        return (
            <View>
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
                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerTextStyle}>Jenis Lembaga</Text>
                                <View style={styles.pickerStyle}>
                                    <Picker
                                        selectedValue={organizationType}
                                        onValueChange={v => this.onChangeInput('organizationType', v)}
                                    >
                                        <Picker.Item label='PT' value='PT' />
                                        <Picker.Item label='CV' value='CV' />
                                        <Picker.Item label='OTHERS' value='OTHERS' />
                                    </Picker>
                                </View>
                            </View>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Nama Lembaga'
                                placeholder='Nama Lembaga'
                                value={nameInstitution}
                                onChangeText={v => this.onChangeInput('nameInstitution', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Alamat Lembaga'
                                placeholder='Alamat Lembaga'
                                value={addressInstitution}
                                onChangeText={v => this.onChangeInput('addressInstitution', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='NPWP Lembaga'
                                placeholder='NPWP Lembaga'
                                value={npwp}
                                onChangeText={v => this.onChangeInput('npwp', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Email'
                                placeholder='Email'
                                value={email}
                                onChangeText={v => this.onChangeInput('email', v)}
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
                                value={name}
                                onChangeText={v => this.onChangeInput('name', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='No. KTP'
                                placeholder='contoh: 321317989029'
                                value={idNumber}
                                onChangeText={v => this.onChangeInput('idNumber', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Alamat'
                                placeholder='Alamat'
                                value={address}
                                onChangeText={v => this.onChangeInput('address', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='No. HP'
                                placeholder='contoh: 085621017922'
                                value={phone}
                                onChangeText={v => this.onChangeInput('phone', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Username'
                                placeholder='Username'
                                value={username}
                                onChangeText={v => this.onChangeInput('username', v)}
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
                                value={password}
                                onChangeText={v => this.onChangeInput('password', v)}
                            />
                        </CardSectionRegistration>

                    </CardRegistration>
                    <CardSectionRegistration>
                        <Button onPress={() => this.showAlert()}>
                            Register
						</Button>
                    </CardSectionRegistration>
                </ScrollView>

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
                        this.register();
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
    },
    pickerTextStyle: {
        color: '#8e8e8e',
        paddingLeft: 5,
        fontSize: 16
    },
    pickerContainer: {
        flex: 1,
        height: 65,
        marginBottom: 5
    },
    pickerStyle: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#716c6c',
        marginRight: 3,
        marginLeft: 3,
    },
}

export default RegistrationFormPage;
