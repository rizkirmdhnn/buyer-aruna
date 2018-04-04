import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, ToastAndroid, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { NavigationActions } from 'react-navigation'
import axios from 'axios'
import { BASE_URL } from './../shared/lb.config';
import {
    Button,
    ContainerSection,
    Spinner
} from './../components/common';

class RegisterAuctionPage extends Component {
    static navigationOptions = {
        title: 'Registrasi',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            photoFirst: null,
            photoSecond: null,
            photoThird: null,
            tokenUser: '',
            loader: ''
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({
                tokenUser: result
            })
        });
    }


    tapFirst() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                const source = { uri: response.uri };
                this.setState({
                    photoFirst: source
                });
            }
        });
    }


    tapSecond() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                const source = { uri: response.uri };
                this.setState({
                    photoSecond: source
                });
            }
        });
    }


    tapThird() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                const source = { uri: response.uri };
                this.setState({
                    photoThird: source
                });
            }
        });
    }


    submitRegis() {
        const {
            photoFirst,
            photoSecond,
            photoThird
        } = this.state;

        switch (photoFirst) {
            case null:
                return ToastAndroid.show('Poto dokument 1 Tidak boleh kosong', ToastAndroid.SHORT);
            default:
                console.log('Photo 1 Lolos')
                switch (photoSecond) {
                    case null:
                        return ToastAndroid.show('Poto dokument 2 Tidak boleh kosong', ToastAndroid.SHORT);
                    default:
                        console.log('Photo 2 Lolos')
                        switch (photoThird) {
                            case null:
                                return ToastAndroid.show('Poto dokument 3 Tidak boleh kosong', ToastAndroid.SHORT);
                            default:
                                console.log('Photo 3 Lolos')
                                return this.regAuction();
                        }
                }
        }
    }

    regAuction() {
        this.setState({ loader: true })
        const regisAuction = new FormData();
        regisAuction.append('document1', {
            uri: this.state.photoFirst.uri,
            type: 'image/jpeg',
            name: 'document1.png'
        });

        regisAuction.append('document2', {
            uri: this.state.photoSecond.uri,
            type: 'image/jpeg',
            name: 'document2.png'
        });

        regisAuction.append('document3', {
            uri: this.state.photoThird.uri,
            type: 'image/jpeg',
            name: 'document3.png'
        });

        console.log(regisAuction, 'Data Form');
        console.log(this.state.tokenUser, 'Token');
        axios.post(`${BASE_URL}/register/auctions`,
            regisAuction
            , {
                headers: {
                    'Content-Type': 'application/json',
                    token: this.state.tokenUser
                }
            }).then(response => {
                console.log(response, 'RES');
                this.setState({ loader: false });
                ToastAndroid.show('Sukses Registrasi Lelang. Silahkan tunggu konfirmasi admin.', ToastAndroid.SHORT)
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'Auction' })
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            })
            .catch(error => {
                console.log(error, 'ERROR')
                console.log(error.message, 'ERROR')
                console.log(error, 'ERROR')
                if (error.response) {
                    ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
                }
                else {
                    ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
                }
                this.setState({ loader: false });
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ padding: '10%' }}>
                        <Text style={{ marginBottom: '3%' }}>Untuk mendaftar lelang dibutuhkan beberapa dokumen:</Text>

                        <Text style={{ marginLeft: 5 }}>Unggah dokumen #1</Text>
                        <ContainerSection>
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={this.tapFirst.bind(this)}>
                                    <View>
                                        {this.state.photoFirst === null ?
                                            <Image
                                                source={require('../assets/images/ic_add_a_photo.png')}
                                            />
                                            :
                                            <Image style={{ height: 200, width: 300 }} source={this.state.photoFirst} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ContainerSection>

                        <Text style={{ marginLeft: 5 }}>Unggah dokumen #2</Text>
                        <ContainerSection>
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={this.tapSecond.bind(this)}>
                                    <View>
                                        {this.state.photoSecond === null ?
                                            <Image
                                                source={require('../assets/images/ic_add_a_photo.png')}
                                            />
                                            :
                                            <Image style={{ height: 200, width: 300 }} source={this.state.photoSecond} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ContainerSection>

                        <Text style={{ marginLeft: 5 }}>Unggah dokumen #3</Text>
                        <ContainerSection>
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={this.tapThird.bind(this)}>
                                    <View>
                                        {this.state.photoThird === null ?
                                            <Image
                                                source={require('../assets/images/ic_add_a_photo.png')}
                                            />
                                            :
                                            <Image style={{ height: 200, width: 300 }} source={this.state.photoThird} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ContainerSection>

                        <ContainerSection>
                            {
                                this.state.loader ?
                                        <Spinner size='large' />
                                    :
                                    <Button
                                        onPress={() => {
                                            this.submitRegis()
                                        }}
                                    >
                                        Daftar
                                    </Button>
                            }
                        </ContainerSection>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = {
    container: {
        flex: 1
    },
    photoContainer: {
        flex: 1,
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd'
    }
}

export default RegisterAuctionPage
