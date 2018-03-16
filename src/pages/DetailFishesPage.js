import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Image,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import {
    Button,
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
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }


    createRequest(item) {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            if (result) {
                console.log(item, 'Data Ikan Terpilih')
                this.props.navigation.navigate('RequestFormOrderFirst', { dataFish: item, navigation: 'LIST' })
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
                                    />
                                </View>
                            </View>
                        </ContainerSection>

                        <Card style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                            <View style={styles.card}>
                                <ContainerSection>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold' }}>{dataFish.name}</Text>
                                    </View>
                                </ContainerSection>

                                <ContainerSection>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View>
                                            <Text style={{ flex: 1, fontSize: 13 }}>{dataFish.description}</Text>
                                        </View>
                                    </View>
                                </ContainerSection>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
                <View style={{ margin: 10 }}>
                    <ContainerSection>
                        <Button onPress={() => { this.createRequest(dataFish); }}>
                            Buat Permintaan
                        </Button>
                    </ContainerSection>
                </View>
            </View>
        );
    }

}


const styles = {
    thumbnailStyle: {
        height: 290,
        width: 330,
        borderWidth: 1,
        alignSelf: 'stretch',
        resizeMode: 'cover',
        marginLeft: -5,
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
};

export default DetailFishesPage;
