import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback } from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';
// import { NavigationActions } from 'react-navigation';

class RequestOrderPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: ''
        };
    };

    static navigationOptions = {
        title: 'Permintaan',
        header: (
            <View>
                <Header
                    backgroundColor={'#006AAF'}
                    containerStyle={{ backgroundColor: 'red' }}
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Home', style: { color: '#EFF6F9' } }}
                    rightComponent={{ icon: 'notifications', color: '#faa51a' }}
                />
                <SearchBar
                    style={{ flex: 1 }}
                    round
                    lightTheme
                    inputStyle={{ color: 'white' }}
                    placeholder='Type Here...' />
            </View>
        )
    }

    renderData = (item) => {
        return item.map((datax) => {
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.detailOrder(datax)}
                >
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={require('./../assets/image/gurame.jpg')}
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{datax.name}</Text>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text>{datax.dueDate}</Text>
                                <Text>{datax.response}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        })

    }

    _keyExtractor = (item, index) => item.id;

    detailOrder = (props) => {
        const listData = props;
        this.props.navigation.navigate('DetailRequestOrder', { datas: listData })
    }

    componentWillMount() {
        const data =
            [
                {
                    id: 1,
                    name: 'Kakap Merah - 400 kg',
                    dueDate: 'Batas Waktu: 19/2/2018 pukul 03.00',
                    response: '7 Sanggup | 3 Menolak | 2 Menunggu'
                },
                {
                    id: 2,
                    name: 'Tuna Merah - 500 kg',
                    dueDate: 'Batas Waktu: 19/2/2018 pukul 03.00',
                    response: '3 Sanggup | 6 Menolak | 1 Menunggu'
                },
                {
                    id: 3,
                    name: 'Tongkol Abu Abu - 800 kg',
                    dueDate: 'Batas Waktu: 19/2/2018 pukul 03.00',
                    response: '1 Sanggup | 3 Menolak | 7 Menunggu'
                }
            ]
        this.setState({ dataList: data });
    }

    render() {
        return (
            <View>
                <FlatList
                    data={[this.state.dataList]}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={this._keyExtractor}
                />
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
    }
}

export default RequestOrderPage;