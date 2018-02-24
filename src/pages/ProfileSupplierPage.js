import React, { Component } from 'react';
import { Text, View, AsyncStorage, FlatList, Image, ScrollView } from 'react-native';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import { Spinner, Container, ContainerSection, Card } from '../components/common';
import moment from 'moment';

class ProfileSupplierPage extends Component {

    static navigationOptions = {
        title: 'Profile Supplier',
        headerStyle: { backgroundColor: '#5D9FE2' },
        headerTitleStyle: { color: '#FFFFFF', paddingLeft: '25%' },
        headerTintColor: 'white',
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            dataParsing: '',
            dataProfile: ''
        }
    }

    componentWillMount() {
        this.setState({ dataParsing: this.props.navigation.state.params.datas })
        const idSupplier = this.props.navigation.state.params.datas.item.id;
        AsyncStorage.getItem('loginCredential', (err, result) => {

            axios.get(`${BASE_URL}/profile/${idSupplier}`, {
                headers: { 'token': result }
            })
                .then(response => {
                    res = response.data.user
                    this.setState({ dataProfile: res, loading: false })
                    console.log(res, 'Profile')
                })
                .catch(error => {
                    console.log(error.response, 'Error');
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah')
                    }
                })
        });
    }

    renderData = (item) => {
        return item.map((datax, index) => {
            console.log(datax.Fish, 'Data Ikan');
            const dateFish = moment(datax.updatedAt).format('DD/MM/YYYY');
            <Card>
                {/* <View style={styles.itemContainerStyle}> */}
                {/* <View style={styles.thumbnailContainerStyle}> */}
                <Image
                    style={styles.thumbnailStyles}
                    source={{ uri: `${BASE_URL}/images/${datax.Fish.photo}` }}
                />
                {/* </View> */}
                {/* <View style={styles.headerContentStyle}>
                        <Text style={styles.headerTextStyle}>{dateFish}</Text>
                        <Text style={styles.headerTextStyle}>{datax.Fish.name}</Text>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text>Total FishLog: {datax.fishLogAmount}</Text>
                        </View>*/}
                {/* </View> */}
                {/* </View> */}
            </Card>
        });
    }

    render() {

        const {
            loading
        } = this.state;

        if (loading) {
            return <Spinner size='large' />
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={{ uri: `${BASE_URL}/images/${this.state.dataProfile.photo}` }}
                    />
                </View>

                <View
                    style={{
                        marginLeft: '10%', flex: 1,
                        flexDirection: 'column',
                    }}
                >
                    <Text>Supplier Aruna</Text>
                    <Text style={{ marginTop: '3%', fontSize: 20, fontFamily: 'muli', fontWeight: 'bold' }}>{this.state.dataProfile.name}</Text>
                    <Text>{this.state.dataProfile.organization}</Text>
                </View>

                <View style={{ marginTop: '-10%', marginLeft: '10%', marginRight: '10%', borderBottomWidth: 3, borderBottomColor: '#DDD' }}></View>
                <View style={{ marginLeft: '10%', flexDirection: 'row', paddingTop: 20 }}>
                    <Text style={{ flex: 1 }}>Alamat</Text>
                    <Text style={{ flex: 1 }}>:</Text>
                    <Text style={{ flex: 1, justifyContent: 'flex-start' }}>{this.state.dataProfile.address}</Text>
                </View>
                <View style={{ marginLeft: '10%', flexDirection: 'row', paddingBottom: 20 }}>
                    <Text style={{ flex: 1 }}>Point</Text>
                    <Text style={{ flex: 1 }}>:</Text>
                    <Text style={{ flex: 1, justifyContent: 'flex-start' }}>{this.state.dataProfile.pointNow}</Text>
                </View>
                <View style={{ marginLeft: '10%', marginRight: '10%', borderBottomWidth: 3, borderBottomColor: '#DDD' }}></View>


                <Text style={{ marginLeft: '10%', paddingTop: 20, flex: 1, fontWeight: 'bold' }}> Komoditas Unggulan </Text>

                <View style={{ flex: 1 }}>
                    <FlatList
                        data={[this.state.dataProfile.Products]}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={(item, index) => index}
                    />
                </View>


            </View>
        );
    }
};


const styles = {
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 300,
        width: 430,
        resizeMode: 'stretch',
    },
    itemContainerStyleSupplier: {
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    thumbnailStyles: {
        height: 100,
        width: 100,
        resizeMode: 'stretch',
    },
    headerTextStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    }
};
export default ProfileSupplierPage;