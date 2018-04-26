import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Image,
    ToastAndroid,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import {
    ButtonOrder,
    ContainerSection,
    Card
} from './../components/common';
import { BASE_URL } from '../shared/lb.config';


class DetailFishesPage extends Component {

    static navigationOptions = {
        title: 'Detail Ikan',
        headerRight: <View />
    }

    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            dataFish: '',
            temp: '',
            idFish: '',
            dataSup: ''
        };
    }

    componentWillMount() {
        console.log(this.props.navigation.state.params, 'KAKAKAKAKKA');
        this.setState({
            temp: this.props.navigation.state.params.datas.id,
            dataSup: this.props.navigation.state.params.datas
        }, () => {
            const { temp } = this.state;
            this.setState({ idFish: temp }, () => {
                return this.getData();
            })
        })
    }

    onRefresh() {
        this.setState({
            refreshing: true
        }, () => {
            this.getData();
        });
    }

    getData() {
        const { idFish } = this.state;
        axios.get(`${BASE_URL}/fishes/${idFish}`).then(response => {
            res = response.data.data;
            console.log(res, 'Data Ikan');
            this.setState({ dataFish: res, refreshing: false });
        })
            .catch(error => {
                this.setState({ refreshing: false });
                ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }


    createRequest(item) {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            if (result) {
                console.log(item, 'Data Ikan Terpilih')
                this.props.navigation.navigate('RequestFormOrderFirst', { dataFish: item, navigation: 'LIST', private: false })
            } else {
                alert('Anda belum login. Silahkan lakukan login terlebih dahulu');
            }
        })
    }

    render() {
        const { dataFish } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={{ flex: 1, paddingTop: 5 }}>
                        <ContainerSection>
                            <View style={styles.thumbnailContainerStyle}>
                                <View>
                                    <Image
                                        style={styles.thumbnailStyle}
                                        source={{ uri: `${BASE_URL}/images/${dataFish.photo}` }}
                                        resizeMode='contain'
                                    />
                                </View>
                            </View>
                        </ContainerSection>

                        <View style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                            <View style={styles.card}>
                                <ContainerSection>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold', paddingLeft: '5%', paddingTop: '7%' }}>{dataFish.name}</Text>
                                        <Text style={{ flex: 1, fontSize: 14, paddingLeft: '5%', paddingTop: '-2%' }}>{dataFish.localName === null ? '' : dataFish.localName} </Text>
                                        <Text style={{ flex: 1, fontSize: 14, paddingLeft: '6%', paddingTop: '2%', fontWeight: 'bold' }}>{dataFish.description === null ? '' : dataFish.description}</Text>
                                        <View style={{ borderTopWidth: 1, borderColor: '#e2e2e2', width: '90%', marginLeft: '5%', marginRight: '5%', marginBottom: 20, marginTop: 5 }} />
                                    </View>
                                </ContainerSection>

                                <ContainerSection>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ flex: 1, fontSize: 16, paddingLeft: '5%', paddingTop: '-2%', fontWeight: 'bold' }}>Habitat Komoditas</Text>
                                        <Text style={{ flex: 1, fontSize: 14, paddingLeft: '5%', paddingTop: '-2%', textAlign: 'center' }}>{dataFish.habitat === null ? '' : dataFish.habitat}</Text>
                                    </View>
                                </ContainerSection>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ padding: 12, paddingLeft: 5, paddingRight: 5, margin: 5, marginBottom: 0, marginTop: 0, height: 60 }}>
                    <ButtonOrder onPress={() => { this.createRequest(dataFish); }}>
                        <Text style={{ marginTop: 1 }}>Buat Permintaan</Text>
                    </ButtonOrder>
                </View>
            </View>
        );
    }

}


const styles = {
    thumbnailStyle: {
        height: 290,
        width: 350,
        borderWidth: 1,
        alignSelf: 'stretch',
        resizeMode: 'cover',
        marginLeft: -4,
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    card: {
        borderRadius: 4,
        // borderColor: '#ddd',
        // borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10,
        // marginTop: 2,
        marginBottom: '2%',
        backgroundColor: '#FFF'
    }
};

export default DetailFishesPage;
