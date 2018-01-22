import React, { Component } from 'react'
import {
    FlatList,
    View,
    Image,
    Text,
    TouchableNativeFeedback,
    AsyncStorage,
    ScrollView,
    Alert
} from 'react-native'
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import { CheckBox } from 'react-native-elements'

class RequestFormOrderSecondPage extends Component {

    static navigationOptions = {
        title: 'Create Request Order',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            datax: [{}],
            dataSupplier: [{}],
            loading: null,
            checked: true
        };
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data 1');
        this.setState({ datax: this.props.navigation.state.params.datas });
    }

    componentDidMount() {
        console.log(this.state.datax, 'Data 2');
        this.setState({ loading: true });
        AsyncStorage.getItem('loginCredential', (err, result) => {

            const token = result;
            axios.post(`${BASE_URL}/generate-request`, {
                'FishId': 1,
                'ProvinceId': this.state.datax.provinsiId,
                'CityId': this.state.datax.cityId,
                'minBudget': this.state.datax.minBudget,
                'maxBudget': this.state.datax.maxBudget
            }, {
                    headers: {
                        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJuYW1lIjoiYXJpZiIsImVtYWlsIjoiYXJpZkBnbWFpbGMub3JnIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJwaG9uZSI6IjA4MjExMTEyMjIxIiwicGhvdG8iOiJpa2FuLmpwZyIsImFkZHJlc3MiOiJhbGRpcm9uIiwicm9sZSI6bnVsbCwicG9pbnRBbW91bnQiOjAsImlkTnVtYmVyIjoiMzI0NzAyNDQyMzQxMjIiLCJvcmdhbml6YXRpb25UeXBlIjoicHQiLCJucHdwIjpudWxsLCJzdWJEaXN0cmljdCI6bnVsbCwidmlsbGFnZSI6bnVsbCwiYWN0aXZlIjpmYWxzZSwidmVyaWZpZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDE4LTAxLTE0VDAwOjAwOjAwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDE4LTAxLTE0VDAwOjAwOjAwLjAwMFoiLCJDaXR5SWQiOjF9LCJpYXQiOjE1MTU4OTUyMTIsImV4cCI6MTUxNjUwMDAxMn0.jJcAMQkXQIwoJQ9JAzaNImgS9rYbzG9xgg4pTfHMMGs',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    res = response.data.data;
                    console.log(res, 'RES')
                    const result = res;
                    console.log(result, 'Result');
                    this.setState({ dataSupplier: result, loading: false })
                })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    alert('Koneksi internet bermasalah')
                })
        });

    }

    checkBox = () => {
        this.setState({ checked: !this.state.checked })
        console.log(this.state.checked, 'Checked');
    }

    renderLoading = () => {
        if (this.state.loading == true) {
            return <Spinner size="small" />
        } else if (this.state.loading == false) {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataSupplier]}
                        renderItem={({ item }) => this.renderItem(item)}
                    />
                </View>
            );
        }
    }

    onSubmit = () => {
        Keyboard.dismiss()

    }

    renderButton = () => {
        const { navigate } = this.props.navigation;
        if (this.state.loading) {
            return <View style={styles.loadingStyle}><Spinner size='large' /></View>
        }

        return (
            <Button
                onPress={
                    () => Alert.alert(
                        '',
                        'Sukses Request Order.',
                        [
                            { text: 'Ya', onPress: () => navigate('Home') },
                        ]
                    )
                }
            >
                Next
			</Button>
        )
    }


    renderItem = (item) => {
        console.log(item, 'Data Supplier');
        return item.map((data) => {
            console.log(data, 'DATA MAP')
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.User.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    checked={this.state.checked}
                                    onPress={() => this.checkBox()}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            )
        })

    }

    renderData = (item) => {
        console.log(item, 'Data Product');
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={require('./../assets/image/gurame.jpg')}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.suggestions[0].name}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={styles.titleTextStyle}>{item.quantity} Kg</Text>
                        <Text>Rp. {item.minBudget} - {item.maxBudget}</Text>
                        <Text>Batas Waktu: {item.datePick}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render(props) {
        
        return (
            <View>
                <FlatList
                    data={[this.state.datax]}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={(item, index) => item.cityId}
                />
                <View style={styles.containerScroll}>
                    <ScrollView

                    >
                        {this.renderLoading()}
                    </ScrollView>
                </View>

                <ContainerSection>
                    {this.renderButton()}
                </ContainerSection>

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
    itemContainerStyleSupplier: {
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
        height: 50,
        width: 50,
        borderRadius: 8
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    loadingStyle: {
        marginTop: 30
    },
    containerScroll: {
        marginBottom: 30,
        padding: 10,
        height: 200
    }
}

export default RequestFormOrderSecondPage;